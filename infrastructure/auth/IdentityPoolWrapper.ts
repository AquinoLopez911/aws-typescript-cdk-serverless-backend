import { CfnOutput } from "aws-cdk-lib";
import { UserPool, UserPoolClient, CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";



export class IdentityPoolWrapper {
    private scope: Construct;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;

    private identityPool: CfnIdentityPool;
    private unauthenticatedRole: Role;
    private authenticatedRole: Role;

    public adminRole: Role;



    constructor( scope: Construct, userPool: UserPool, userPoolClient: UserPoolClient) {
        this.scope = scope;
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;

        this.initialize();
        this.initializeRoles()
        this.attachRoles();

    }

    attachRoles() {
        new CfnIdentityPoolRoleAttachment(this.scope, 'rolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unauthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }
    initializeRoles() {
        this.authenticatedRole = new Role(this.scope, 'cognitoAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    'ForAnyValue: StriingLike': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.unauthenticatedRole = new Role(this.scope, 'cognitoUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    'ForAnyValue: StriingLike': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole = new Role(this.scope, 'cognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    'ForAnyValue: StriingLike': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:ListAllMyBuckets'
            ],
            resources: ['*']
        }))
    }

    private initialize() {
        this.initializeIdentityPool();
    }

    initializeIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'spaceFinderIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        })
        new CfnOutput(this.scope, 'identityPoolId', {
            value: this.identityPool.ref
        })
    }
}