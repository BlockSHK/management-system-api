#!/bin/bash
set -e

function print_title() {
        local timestamp=$(date +%Y-%m-%dT%H:%M:%S.%N%z)
        echo
        echo
        echo -e "\e[1;34m[$timestamp] ==> $1\e[0m"
}

function print_message() {
        echo -e "\e[1;34m==> $1\e[0m"
}

function create_s3_bucket_if_not_exist() {
        account_id=$(aws sts get-caller-identity --region $region --query "Account" --output text)
        bucket_name=$1
        if [[ ! -z $(aws s3api list-buckets --query 'Buckets[?Name==`bucket-name`]' --output text) ]]; then
                echo "Bucket Exists"
        fi

        bucket_status=$(aws s3api head-bucket --bucket $bucket_name 2>&1 || true)
        if [[ ! -z "$bucket_status" ]]; then
                print_title "creating deployment s3 bucket=$bucket_name in Acct=$account_id, in Region=$region"

                if [[ $region == "us-east-1" ]]; then
                        aws s3api create-bucket --bucket ${bucket_name} --region ${region} --no-cli-pager >/dev/null || echo "bucket opetation failed"
                else
                        aws s3api create-bucket --bucket ${bucket_name} --region ${region} --create-bucket-configuration LocationConstraint=${region} --no-cli-pager >/dev/null || echo "bucket opetation failed"
                fi
                aws s3api wait bucket-exists --bucket ${bucket_name}

        else
                print_message "Deployment bucket exists, Skipped bucket creation"

        fi
}

function help() {
        self=$(basename $0)
        echo "AWS resources for managment-system-api"
        echo "Usage:"
        echo "   ./deploy.sh <region>"
        echo
        echo "This script setup deploys lambdas for managment-system-api"
        echo ""
        echo "  region - A valid AWS region. e.g. us-east-2. "
        echo
}

if [[ $# != 1 ]]; then
        help
        exit 0
fi

region=$1

if [[ -z $region ]]; then

        print_error "aws region not given "
        exit -1

fi

account_id=$(aws sts get-caller-identity --region $region --query "Account" --output text) # get aws caller account ID

print_title "Deploying AWS resources for management-system-api  in $account_id at $region"

mkdir -p ./pkgs
template_1="./management-system-api/template.yaml"
template_2="./pkgs/template_$region.yaml"

stack_name="management-system-api-$region"
s3_bucket="management-system-api-deployments-$account_id-$region"

print_title "Creating $s3_bucket in $region"

create_s3_bucket_if_not_exist $s3_bucket

sam package --template-file $template_1 --region $region --s3-bucket $s3_bucket --output-template-file $template_2
print_title "management-system-api packages are published to $s3_bucket for $region"

sam deploy --region $region --template-file $template_2 --stack-name $stack_name \
        --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --no-fail-on-empty-changeset

rm -rf pkgs
