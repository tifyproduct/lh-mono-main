import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_ACCESS_KEY_ID, S3_SECRET_KEY, S3_ENDPOINT, S3_CDN_BUCKET } from '$env/static/private';
import { Upload } from '@aws-sdk/lib-storage';


const s3Client = new S3Client({
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_KEY,
	},
	region: 'auto',
	endpoint: S3_ENDPOINT
});

export function getBucket(): string {
    return S3_CDN_BUCKET;
}

export function getObjectCommandS3(key: string): GetObjectCommand{
    return new GetObjectCommand({
        Bucket: S3_CDN_BUCKET,
        Key: key
    });
}

export async function signedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = getObjectCommandS3(key)
 
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
    return signedUrl
}

export async function uploadFile(file: File, key: string): Promise<void> {
    if (file.size > 0) {
        const fileStream = file.stream();
        const upload = new Upload({
            client: s3Client,
            params: {
                Key: key,
                Bucket: S3_CDN_BUCKET,
                Body: fileStream,
                ContentType: file.type
            }
        });

        try {
            await upload.done();
        } catch (e) {
            console.error(e);
            throw new Error('Failed to upload image');
        }
    }
}