# Software Subscription and License Management System API

## What is this repository for ?

This repository contains the API for the software subscription and license managment system

## How do I get set up?

You can checkout this project using the following.

    git clone git@github.com:BlockSHK/management-system-api.git

You can deploy the application to an environment using the following.

    ./deploy.sh <aws-region>

- `aws-region` is the AWS region in which the deployment environment is hosted (for example `us-east-1`)

Usage details on deployment tooling are availabe via the following command.

    ./deploy.sh -h

Please note that the API requires access to the contract's bin/abi files. To upload these files, use the script located in contracts/solidity/upload.sh and run the following command:

    ./upload.sh <aws-region>

Make sure to use the correct S3 bucket naming convention, as AWS has a global naming standard.

## Architecture

The following resources describes the current API and Data Model.

- [Data model](./documentation/model.md)
- [API](./documentation/api.md)

![Architecture diagram](./documentation/Mangment-System-API.jpg)
