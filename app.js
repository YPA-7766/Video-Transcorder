// Browser-side JavaScript for video upload
const API_ENDPOINT = 'https://n66p2s3u97.execute-api.eu-west-2.amazonaws.com'; // Replace with your API Gateway URL

async function uploadVideo() {
    const fileInput = document.getElementById('videoInput');
    const statusDiv = document.getElementById('status');
    const progressDiv = document.getElementById('progress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const file = fileInput.files[0];
    
    if (!file) {
        statusDiv.textContent = 'Please select a video file first!';
        statusDiv.className = 'status-section error';
        return;
    }
    
    if (!file.type.startsWith('video/')) {
        statusDiv.textContent = 'Please select a valid video file!';
        statusDiv.className = 'status-section error';
        return;
    }
    
    try {
        statusDiv.textContent = 'Getting upload URL...';
        statusDiv.className = 'status-section';
        progressDiv.style.display = 'none';
        
        // Step 1: Get presigned URL from Lambda
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get upload URL');
        }
        
        const data = await response.json();
        const uploadUrl = data.uploadUrl;
        
        // Step 2: Upload file to S3 using presigned URL
        statusDiv.textContent = 'Uploading video...';
        progressDiv.style.display = 'block';
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressFill.style.width = percentComplete + '%';
                progressText.textContent = Math.round(percentComplete) + '%';
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                statusDiv.textContent = 'Video uploaded successfully!';
                statusDiv.className = 'status-section success';
                progressFill.style.width = '100%';
                progressText.textContent = '100%';
            } else {
                throw new Error('Upload failed');
            }
        });
        
        xhr.addEventListener('error', () => {
            statusDiv.textContent = 'Upload failed. Please try again.';
            statusDiv.className = 'status-section error';
            progressDiv.style.display = 'none';
        });
        
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
        
    } catch (error) {
        console.error('Error:', error);
        statusDiv.textContent = 'Error: ' + error.message;
        statusDiv.className = 'status-section error';
        progressDiv.style.display = 'none';
    }
}