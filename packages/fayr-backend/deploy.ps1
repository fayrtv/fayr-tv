param (
    [Parameter(Mandatory=$True, HelpMessage="The AWS region to deploy to")]
    [ValidateNotNullOrEmpty()]
    [string]$region = "eu-central-1",

    [Parameter(Mandatory=$True, HelpMessage="The bucket to use for uploading")]
    [ValidateNotNullOrEmpty()]
    [string]$name
)

if (Test-Path -Path compiled)
{
    Remove-Item -Recurse compiled
}
yarn run compile

$ErrorActionPreference = "Stop";

Write-Output "Don't forget to run 'aws configure' with the 'eu-central-1' region first."

Write-Output "Creating S3 bucket..."
aws s3api create-bucket --bucket $name --region $region --create-bucket-configuration LocationConstraint=$region

Write-Output "Packaging..."
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $name

Write-Output "Deploying..."
sam deploy --template-file .\packaged.yaml --stack-name $name --capabilities CAPABILITY_IAM
