import { CfnOutput, DockerImage, Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { BucketDeployment, Source, CacheControl } from "aws-cdk-lib/aws-s3-deployment";
import {join} from 'path'
import * as fs from 'fs'
// import { CloudFrontWebDistribution, CfnDistribution } from "aws-cdk-lib/aws-cloudfront";
import * as cf from 'aws-cdk-lib/aws-cloudfront'



export class WebAppDeployment {
    private stack: Stack;
    private bucketSuffix: string;
    private deploymentBucket: Bucket;

    constructor(stack: Stack, bucketSuffix: string) {
        this.stack = stack;
        this.bucketSuffix = bucketSuffix;

        this.initialize();
    }

    private initialize() {
        const bucketName = 'space-app-web' + this.bucketSuffix;

        this.deploymentBucket = new Bucket(this.stack, 'space-app-web-bucket-id', {
            bucketName: bucketName,
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            
        })

        const Error403ResponseProperty: cf.CfnDistribution.CustomErrorResponseProperty = {
            errorCode: 403,
          
            // the properties below are optional
            errorCachingMinTtl: 123,
            responseCode: 200,
            responsePagePath: '/index.html',
          };


        const cloudFront = new cf.CloudFrontWebDistribution( this.stack, 'cloudFrontWebDistro-id', {
            originConfigs: [
                {
                    behaviors: [
                        {
                            isDefaultBehavior: true
                        }
                    ],
                    s3OriginSource: {
                        s3BucketSource: this.deploymentBucket
                    },
                    failoverS3OriginSource: {
                        s3BucketSource: this.deploymentBucket
                    },
                    
                },
            ],
            loggingConfig: {},
            errorConfigurations: [Error403ResponseProperty],
        })

        new BucketDeployment(this.stack, 'sapce-app-web-deployment-id', {
            destinationBucket: this.deploymentBucket,
            sources: [Source.asset(join(__dirname, '..', '..', 'late-night-ice', 'build'))],
            cacheControl: [CacheControl.fromString('max-age=0,no-cache,no-store,must-revalidate')],
            distribution: cloudFront,
            distributionPaths: ["/*"]
        } )

        new CfnOutput(this.stack, 'spaceFinder', {
            value: this.deploymentBucket.bucketWebsiteUrl
        })

        new CfnOutput(this.stack, 'spaceFinderrWebAppCCloudFrontUrl', {
            value: cloudFront.distributionDomainName
        })


    }
}