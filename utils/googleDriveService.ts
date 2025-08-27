/**
 * googleDriveService.ts
 * Lightweight wrapper for uploading files to Google Drive using a service account.
 * This will run ONLY on the server (never bundle into client) via API route.
 */
import { google } from 'googleapis';

export interface DriveUploadResult {
  success: boolean;
  fileId?: string;
  webViewLink?: string;
  webContentLink?: string;
  error?: string;
}

interface UploadParams {
  fileName: string;
  mimeType: string | null | undefined;
  buffer: Buffer;
  orderId: string; // Used to group files into per-order folder
}

// Environment variables expected (configure in deployment environment):
// GOOGLE_SERVICE_ACCOUNT_EMAIL
// GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (replace \n with newlines)
// GOOGLE_DRIVE_PARENT_FOLDER_ID (optional root folder to contain order subfolders)

function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error('Missing Google service account credentials');
  }
  const privateKey = rawKey.replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
}

async function ensureOrderFolder(drive: any, orderId: string): Promise<string> {
  const parent = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  const folderName = orderId;
  // Search for existing folder
  const qParts = [`name='${folderName.replace(/'/g, "\\'")}'`, "mimeType='application/vnd.google-apps.folder'", 'trashed=false'];
  if (parent) qParts.push(`'${parent}' in parents`);
  const res = await drive.files.list({ q: qParts.join(' and '), fields: 'files(id,name)' });
  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id as string;
  }
  // Create new folder
  const fileMetadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parent ? [parent] : undefined,
  };
  const createRes = await drive.files.create({ requestBody: fileMetadata, fields: 'id' });
  return createRes.data.id as string;
}

export async function uploadFileToDrive(params: UploadParams): Promise<DriveUploadResult> {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    // Ensure order folder exists
    const folderId = await ensureOrderFolder(drive, params.orderId);

    const fileMetadata: any = {
      name: params.fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: params.mimeType || 'application/octet-stream',
      body: Buffer.isBuffer(params.buffer) ? ReadableFromBuffer(params.buffer) : params.buffer,
    } as any;

    const createRes = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

      const rawData: any = createRes.data || {};
      const fileId = typeof rawData.id === 'string' ? rawData.id : undefined;
      const webViewLink = typeof rawData.webViewLink === 'string' ? rawData.webViewLink : undefined;
      const webContentLink = typeof rawData.webContentLink === 'string' ? rawData.webContentLink : undefined;
      return {
        success: true,
        fileId,
        webViewLink,
        webContentLink,
      };
  } catch (error: any) {
    console.error('Drive upload error', error);
    return { success: false, error: error?.message || 'Upload failed' };
  }
}

// Helper: convert Buffer to readable stream for googleapis client
import { Readable } from 'stream';
function ReadableFromBuffer(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
