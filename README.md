# Video-Transcorder
A self developed program that takes a video and then transcodes it using AWS services.

Note:
You will need IAM permissions to run this code because it uses AWS, so you can contact me on Linkedin or Instagram if you want access tp it
The Java Worker in EC2 runs temporarily, that is when a request has been sent to the worker and it processes it, the java program stops, so you need to run it again if you want to upload another file.
The SQS ,S3 Buckets and one lambda function linkin the two are initialised in us-east-1(North Virginia) while the other functions and seruices are initialised in eu-west-2(London).
In the EC2 you gotta run the code from vscode because eclipse ide is not well setup, if you can through console then you do you.
Currently there are still some minor bugs at the Java Worker stage due to timing of SQS receipts but i'll fix it eventually.

This was a pretty hard and frustrating project to work with because its my first time using Javascript,Java,HTML,AWS,Ffmpeg,DynamoDB etc. So I did use AI to guide me through the processes, but obviously most of the things were done by me (i did not use AWS CLI so Copilot cannot write the AWS code for me). 
