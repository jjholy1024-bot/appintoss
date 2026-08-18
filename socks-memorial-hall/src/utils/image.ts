/**
 * 업로드한 사진을 리사이즈 + JPEG 압축해서 data URL로 반환해요.
 * 원본 폰 사진(수 MB)을 그대로 저장하면 localStorage 용량을 금방 채우고
 * 친구 공유 시 Redis 저장에도 실패할 수 있어서, 저장 전에 줄여둬요.
 */
export function compressImage(file: File, maxDimension = 640, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 불러올 수 없어요.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스를 사용할 수 없어요.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
