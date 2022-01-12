param (
	[string] $bucket,
	[string] $stack
)

tsc

Write-Output "Packaging..."
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $bucket

Write-Output "Deploying..."
sam deploy --template-file .\packaged.yaml --stack-name $stack --capabilities CAPABILITY_IAM