import { NextRequest } from 'next/server';
import { uploadFileToDrive } from '@/utils/googleDriveService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Expected multipart/form-data' }), { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const orderId = (formData.get('orderId') as string) || 'UNASSIGNED';
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await uploadFileToDrive({
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      buffer,
      orderId,
    });

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || 'Upload failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      fileId: result.fileId,
      webViewLink: result.webViewLink,
      webContentLink: result.webContentLink,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('Upload route error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Internal error' }), { status: 500 });
  }
}
