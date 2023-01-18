#!/bin/bash

function print_title() {
        echo -e "\033[1;34m$1\033[0m"
}

function print_message() {
        echo -e "\033[0;35m $1\033[0m"
}

function print_error() {
        echo -e "\033[0;31mERROR: $1\033[0m"
}

function print_warning() {
        echo -e "\033[0;33mWARNING: $1\033[0m"
}

function help() {
        self=$(basename $0)
        print_title "smart contract complie & upload script"
        echo ""
        echo "upload.sh <AWS-region> <filename>"
        echo
        echo "This script uploads complied smart contracts byte codes into a s3 bucket using **currently logged in** AWS account"
        echo
        echo "                AWS region                - A valid AWS region where system is deployed. e.g. us-east-2. "
        echo "                filename[Optional]        - Sepecify the file name to upload only that file. Filename must contains the extension"
        echo ""
        echo
        echo
}

function create_s3_bucket_if_not_exist() {
        bucket_name=$1

        bucket_status=$(aws s3api head-bucket --bucket $bucket_name 2>&1 || true)
        if [[ ! -z "$bucket_status" ]]; then
                print_message "Creating a bucket..."
                aws s3api create-bucket --bucket ${bucket_name} --region ${region} --no-cli-pager >/dev/null || echo "bucket opetation failed"
                aws s3api put-bucket-versioning --region ${region} --bucket ${bucket_name} --versioning-configuration Status=Enabled --no-cli-pager >/dev/null
                sleep 2
                aws s3api put-bucket-tagging --region ${region} --bucket ${bucket_name} --no-cli-pager >/dev/null
                sleep 2

                aws s3api put-bucket-encryption \
                        --bucket ${bucket_name} \
                        --region ${region} \
                        --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]}' --no-cli-pager >/dev/null
                sleep 5
                print_message "Done!"
        else
                print_message "Deployment bucket exists, Skipped bucket creation"

        fi
}

function compileAndUpload() {
        fileNameWithOutExtension="$(basename -s .sol $1)"
        # Compile
        npx solcjs --bin $1 --include-path node_modules/ --base-path . --output-dir ../etc/${fileNameWithOutExtension}/bin
        npx solcjs --abi $1 --include-path node_modules/ --base-path . --output-dir ../etc/${fileNameWithOutExtension}/abi
        # Upload
        aws s3 cp ../etc/${fileNameWithOutExtension}/bin/${fileNameWithOutExtension}* s3://${Bucket_name}/contracts/${fileNameWithOutExtension}/${fileNameWithOutExtension}.bin
        aws s3 cp ../etc/${fileNameWithOutExtension}/abi/${fileNameWithOutExtension}* s3://${Bucket_name}/contracts/${fileNameWithOutExtension}/${fileNameWithOutExtension}.abi
}

#
print_title "Start compiling and uploading to S3"
echo ""

if [[ $# < 1 ]]; then
        help
        exit -1
fi

region=$1
filename=$2

##
Bucket_name="license-contract-management-system-$region"
##

cd ./solidity

cwd=$(pwd)
solFolder="$cwd/*.sol"

# Bucket creation
create_s3_bucket_if_not_exist $Bucket_name

# Compile
npm install

rm -rf ../etc

if [ -z "$filename" ]; then
        for file in $solFolder; do
                fileName="$(basename $file)"
                compileAndUpload $fileName
        done
else
        compileAndUpload $filename
fi

print_message "Susscessfully uploaded"
