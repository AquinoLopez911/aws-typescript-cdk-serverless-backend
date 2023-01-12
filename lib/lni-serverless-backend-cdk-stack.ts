import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';''
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LniServerlessBackendCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lniBucket: Bucket = new Bucket(this, 'lni-bucket', {
      bucketName: "lni-bucket"
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'LniServerlessBackendCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
