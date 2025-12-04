import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.requestContext?.http?.method === 'OPTIONS' || 
        event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: headers,
            body: ''
        };
    }

    try {
        // Parse request body
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (parseError) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const { fileName, fileType } = body;
        
        if (!fileName || !fileType) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'fileName and fileType are required' })
            };
        }
        
        // Generate unique key for S3
        const key = `uploads/${Date.now()}-${fileName}`;
        
        // Create S3 command
        const command = new PutObjectCommand({
            Bucket: "uploads-video-storage", 
            Key: key,
            ContentType: fileType
        });
        
        // Generate presigned URL
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ uploadUrl })
        };
    } catch (error) {
        console.error('Error generating upload URL:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ 
                error: 'Failed to generate upload URL',
                details: error.message 
            })
        };
    }
};
