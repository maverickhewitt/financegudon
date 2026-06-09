/**
 * Compresses an image file natively using HTML5 Canvas.
 * Drops file size significantly while retaining text readability.
 */
export const compressReceipt = (file, maxWidth = 1000, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    // If it's a PDF or not an image, bypass compression
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while constraining width
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas output to a lightweight JPEG blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                },
              );
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original if blob generation fails
            }
          },
          "image/jpeg",
          quality,
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};
