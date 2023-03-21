import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, Authorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AuthorizerWrapper } from './auth/AuthorizerWrapper'
import { Bucket } from 'aws-cdk-lib/aws-s3/lib';
import { WebAppDeployment } from './webAppDeployment';

export class LniServerlessBackendCdkStack extends cdk.Stack {

  private api: RestApi = new RestApi(this, "lniApi", {
    defaultCorsPreflightOptions: {
      allowOrigins: ["*"],
      allowHeaders: [
        "Access-Control-Allow-Origin, Access-Control-Allow-Methods, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"]
    },

  })
  private authorizer: AuthorizerWrapper;
  private suffix: string;
  private spacesPhotosBucket: Bucket;

  private lniTable = new GenericTable(this, {
    tableName: 'LniTable',
    primaryKey: 'PK',
    sortKey: 'SK',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
    updateLambdaPath: 'Update',
    deleteLambdaPath: 'Delete'
  }) 

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.initializeSuffix();
    this.authorizer = new AuthorizerWrapper(this, this.api)
    new WebAppDeployment(this, this.suffix);

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

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId
      }
    }

    // lniApi lambda initegratioin
    // allows a client to call the helloLambdaNodeJs function 
    const helloLambdaNodeJsResource = this.api.root.addResource('hola');
    const helloLambdaNodeJsIntegration: LambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    helloLambdaNodeJsResource.addMethod('GET', helloLambdaNodeJsIntegration, optionsWithAuthorizer)

    //spaces api integrations:
    const ClientResource = this.api.root.addResource('lni');
    ClientResource.addMethod('POST', this.lniTable.createLambdaIntegration);
    ClientResource.addMethod('GET', this.lniTable.readLambdaIntegration);
    ClientResource.addMethod('PUT', this.lniTable.updateLambdaIntegration);
    ClientResource.addMethod('DELETE', this.lniTable.deleteLambdaIntegration);
  }

  private initializeSuffix(){
    const shortStackId = cdk.Fn.select(2, cdk.Fn.split('/', this.stackId));
    const Suffix = cdk.Fn.select(4, cdk.Fn.split('-', shortStackId));
    this.suffix = Suffix;
}
}