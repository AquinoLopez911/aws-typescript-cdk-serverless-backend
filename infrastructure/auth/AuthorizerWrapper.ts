import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient, CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { IdentityPoolWrapper } from "./IdentityPoolWrapper";

export class AuthorizerWrapper {

    private scope: Construct;
    private api: RestApi;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPoolWrapper: IdentityPoolWrapper;
    
    public authorizer: CognitoUserPoolsAuthorizer;

    constructor(scope: Construct, api: RestApi) {
        this.scope = scope;
        this.api = api;

        this.initialize();

    }
    
    private initialize() {
        this.createUserPool();
        this.addUserPoolClient();
        this.createAuthorizer();
        this.initializeIdentityPoolWrapper();
        this.createAdminsGroup();
    }

    private createAdminsGroup() {
        new CfnUserPoolGroup(this.scope, 'admins', {
            groupName: 'admins',
            userPoolId: this.userPool.userPoolId,
            roleArn: this.identityPoolWrapper.adminRole.roleArn
        })
    }

    private createAuthorizer() {
        this.authorizer = new CognitoUserPoolsAuthorizer(this.scope, "spaceUserAuthorizer", {
            cognitoUserPools: [this.userPool],
            authorizerName: 'SpaceUserAuthorizer',
            identitySource: 'method.request.header.Authorization',
        })
        this.authorizer._attachToApi(this.api);
    }

    private initializeIdentityPoolWrapper() {
        this.identityPoolWrapper = new IdentityPoolWrapper(this.scope, this.userPool, this.userPoolClient)
    }

    private addUserPoolClient() {
        this.userPoolClient = this.userPool.addClient('SpaceUserPool-client', {
            userPoolClientName: 'SpaceUserPool-client',
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false,
        })
        new CfnOutput(this.scope, 'SpaceUserPoolClient', {
            value: this.userPoolClient.userPoolClientId
        })
    }


    private createUserPool() {
        this.userPool = new UserPool(this.scope, 'spacesUserPool', {
            userPoolName: 'spacesUserPool',
            selfSignUpEnabled: true,
            signInAliases:{
                username: true,
                email: true
            }
        })
        new CfnOutput(this.scope, 'userPoolId', {
            value: this.userPool.userPoolId
        })
    }
}