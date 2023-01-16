import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class LniServerlessBackendCdkStack extends cdk.Stack {

  private api: RestApi = new RestApi(this, "lniApi")
  // private dynamoTables = new GenericTable('lniTable', 'lniId', this)
  private spacesTable = new GenericTable(this, {
    tableName: 'SpacesTable',
    primaryKey: 'spaceId',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
    updateLambdaPath: 'Update',
    deleteLambdaPath: 'Delete',
    secondaryIndexes: ['location']
  }) 

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // creates allow policy statement
    const s3ListPolicy: PolicyStatement = new PolicyStatement();
    s3ListPolicy.addActions('s3:listAllMyBuckets');
    s3ListPolicy.addResources('*');

    // creates a lambda function with functionallity to write code in .ts, does the compliling behind the scenes to a .js file
    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      functionName: "holaLambda",
      entry: join(__dirname, "..", "services", "node-lambda", 'hello.ts'),
      handler: "handler"
    })
    // add allow s3 list action policy to the helloLambdaNodeJs function
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    // lniApi lambda initegratioin
    // allows a client to call the helloLambdaNodeJs function 
    const helloLambdaNodeJsResource = this.api.root.addResource('hola');
    const helloLambdaNodeJsIntegration: LambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    helloLambdaNodeJsResource.addMethod('GET', helloLambdaNodeJsIntegration)

    //spaces api integrations:
    const spaceResouce = this.api.root.addResource('spaces');

    spaceResouce.addMethod('POST', this.spacesTable.createLambdaIntegration);
    spaceResouce.addMethod('GET', this.spacesTable.readLambdaIntegration);
    spaceResouce.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
    spaceResouce.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);
  }
}