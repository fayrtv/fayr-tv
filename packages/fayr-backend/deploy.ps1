param (
    [Parameter(Mandatory=$True, HelpMessage="The AWS region to deploy to")]
    [ValidateNotNullOrEmpty()]
    [string]$region = "us-east-1",

    [Parameter(Mandatory=$True, HelpMessage="The bucket to use for uploading")]
    [ValidateNotNullOrEmpty()]
    [string]$bucket,

    [Parameter(Mandatory=$True, HelpMessage="The name of this stack")]
    [ValidateNotNullOrEmpty()]
    [string]$stack
)

if (Test-Path -Path compiled)
{
    Remove-Item -Recurse compiled
}
yarn run compile

$ErrorActionPreference = "Stop";

Write-Output "Don't forget to run `aws configure` with the 'us-east-1' region first."

Write-Output "Creating S3 bucket..."
aws s3api create-bucket --bucket $bucket --region $region

Write-Output "Packaging..."
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $bucket

Write-Output "Deploying..."
sam deploy --template-file .\packaged.yaml --stack-name $stack --capabilities CAPABILITY_IAM
