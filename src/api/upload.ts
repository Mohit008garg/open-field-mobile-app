import type { PickedImage } from '@mohit008garg/open-field-common-components';
import { API_BASE_URL } from './config';
import { getTokens } from './tokenStore';

/**
 * Upload a picked image via XMLHttpRequest so we get real upload progress
 * (fetch can't report it). Resolves with the stored `photoUrl`.
 */
export async function uploadImage(
  path: string,
  image: PickedImage,
  onProgress: (fraction: number) => void,
): Promise<string> {
  const token = (await getTokens())?.accessToken;
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    if (image.kind === 'native') {
      fd.append('photo', { uri: image.uri, name: image.name, type: image.type } as never);
    } else {
      fd.append('photo', image.file);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}${path}`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText);
          resolve((body.data ?? body).photoUrl as string);
        } catch {
          reject(new Error('Upload succeeded but the response was invalid.'));
        }
      } else {
        let message = 'Upload failed.';
        try {
          message = JSON.parse(xhr.responseText).message ?? message;
        } catch {
          /* keep default */
        }
        reject(new Error(message));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.send(fd);
  });
}
