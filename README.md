# AWS Lambda Lab
This lab is part of the [foundations trainings](https://github.com/octo-technology-downunder/octo-au-foundations) at [OCTO Technology Australia](http://careers.octo.com.au/).

## The Goal
In this lab we'll need to create a serverless application using AWS Lambda service which will react on events from S3 service. It will also respond to HTTP requests from AWS API Gateway<br>
That will cover the following topics:
- Working with AWS Lambda service via AWS console
- Creating a simple lambda function with S3 event trigger
- Creating an application using Serverless framework

This lab will take approximately 60 minutes

## Overview of technology
AWS provides a set of managed services which do not require infrastructure setup and management. Such services are usually referenced as `serverless`. These include:
- Lambda functions - pieces of code which are run on demand in containers hidden from lambda's owner
- S3 - serverless blob storage
- API Gateway - handles API calls from internet and directs them to other services, e.g. Lambda, S3, EC2

Now let's dive into the world of serverless technology :)

## **_Exercise 1:_ Create a S3 bucket indexer using Lambda function**
In this exercise we're going to create a simple application which will react on uploading events in S3 bucket and write a object's key into `index.lst` file in the same bucket<br>
![Event driven lambda](images/lambda-event.png)

### Create S3 bucket
* In AWS Console, go to `S3` service, then click `Create bucket`
* Type `foundation-labs-lambda-<your_name>` in the `Bucket name` field (don't forget to replace <your_name> with your name ;) )
* Leave all other parameters as default and create the bucket

### Create Lambda function skeleton
* In AWS Console, go to `Lambda` service, then click `Create function`
* Select `Author from scratch`
* Set `Name` as `foundation-labs-lambda-<your_name>`
* Set `Runtime` as `Node.js 8.10`
* Set `Role` to `Create a new role from one or more templates.`
* Set `Role name` as `foundation-labs-lambda-role-<your_name>`
* Choose `Amazon S3 object read-only permissions` in `Policy templates`
* Click `Create function`
