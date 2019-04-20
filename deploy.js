const path = require("path");
const fs = require("fs");
const config = require("./config");
const AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
const S3 = new AWS.S3();
const mime = require("mime");
const bucket_name = `www.${config.domainName}`;

(async () => {
  try {
    const dist_path = path.resolve(__dirname, "dist");
    if (!fs.existsSync(dist_path) || !fs.readdirSync(dist_path).length) {
      console.error("dist folder doesn't exist or empty!");
      process.exit(1);
    }

    let bucket_exists = false;
    try {
      await S3.headBucket({
        Bucket: bucket_name
      }).promise();
      bucket_exists = true;
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
    if (!bucket_exists) {
      console.log(`Creating s3://${bucket_name}...`);
      await S3.createBucket({
        Bucket: bucket_name,
        ACL: "public-read"
      }).promise();
    }
    let bucket_is_website = false;
    let website_endpoint = `${bucket_name}.s3-website-${
      S3.config.region
    }.amazonaws.com`;
    try {
      await S3.getBucketWebsite({
        Bucket: bucket_name
      }).promise();
      bucket_is_website = true;
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
    if (!bucket_is_website) {
      console.log(`Configuring s3://${bucket_name} as website hosting...`);
      await S3.putBucketWebsite({
        Bucket: bucket_name,
        WebsiteConfiguration: {
          ErrorDocument: {
            Key: "index.html"
          },
          IndexDocument: { Suffix: "index.html" }
        }
      }).promise();
    }
    let cors_exists = false;
    try {
      await S3.getBucketCors({ Bucket: bucket_name }).promise();
      cors_exists = true;
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
    if (!cors_exists) {
      console.log(`Creating CORS for s3://${bucket_name}...`);
      await S3.putBucketCors({
        Bucket: bucket_name,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET"],
              AllowedOrigins: ["*"]
            }
          ]
        }
      }).promise();
    }
    const dist_files = fs.readdirSync(dist_path);
    for (let dist_file of dist_files) {
      const dist_file_path = path.resolve(dist_path, dist_file);
      console.log(`Uploading ${dist_file} to s3://${bucket_name}...`);
      await S3.putObject({
        Bucket: bucket_name,
        Key: dist_file,
        Body: fs.readFileSync(dist_file_path),
        ACL: "public-read",
        ContentType: mime.getType(dist_file_path)
      }).promise();
    }
    console.log(`Done!`);
    console.log(
      `Please create a new record: CNAME ${bucket_name} -> ${website_endpoint}`
    );
  } catch (error) {
    console.error(error.stack);
  }
})();