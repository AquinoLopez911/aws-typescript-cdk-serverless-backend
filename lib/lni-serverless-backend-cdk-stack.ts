import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';''
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function as LamFunc, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

export class LniServerlessBackendCdkStack extends cdk.Stack {

  private api: RestApi = new RestApi(this, "lniApi")

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda: LamFunc = new LamFunc(this, "helloLambda", {
      functionName: "helloLambda",
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.handler"
    })

    // lniApi lambda initegratioin
    // allows a client to call the helloLambda function 
    const helloLambdaResource = this.api.root.addResource('hello');
    const helloLambdaIntegration:LambdaIntegration = new LambdaIntegration(helloLambda);
    helloLambdaResource.addMethod('GET', helloLambdaIntegration)

  }
}
