import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function as LamFunc, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class LniServerlessBackendCdkStack extends cdk.Stack {

  private api: RestApi = new RestApi(this, "lniApi")
  private dynamoTables = new GenericTable('lniTable', 'lniId', this)

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      functionName: "holaLambda",
      entry: join(__dirname, "..", "services", "node-lambda", 'hello.ts'),
      handler: "handler"
    })

    // lniApi lambda initegratioin
    // allows a client to call the helloLambdaNodeJs function 
    const helloLambdaNodeJsResource = this.api.root.addResource('hola');
    const helloLambdaNodeJsIntegration: LambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    helloLambdaNodeJsResource.addMethod('GET', helloLambdaNodeJsIntegration)

  }
}
