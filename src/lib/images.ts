const MAP: Record<string, string> = {
  "images/food.jpg":
    "https://image.qwenlm.ai/generated-images/b3002354-368b-4690-bbb6-f8f117f1d573/_result.png",
  "images/hostel.jpg":
    "https://image.qwenlm.ai/generated-images/00542942-0917-4921-82ed-c6bc29de4ac5/_result.png",
  "images/freshers.jpg":
    "https://image.qwenlm.ai/generated-images/5b117e3b-a831-430b-b0c1-c2bd56dbed2f/_result.png",
  "images/laptop.jpg":
    "https://image.qwenlm.ai/generated-images/5979528a-399a-4c72-97aa-922dd537f392/_result.png",
  "images/sneakers.jpg":
    "https://image.qwenlm.ai/generated-images/d8f4c66d-7039-4110-90c6-4fc4a27a8ce3/_result.png",
  "images/phone.jpg":
    "https://image.qwenlm.ai/generated-images/3ecfab94-bcfd-448e-879c-5df4847d7ed4/_result.png",
};

export const resolveImg = (src?: string): string | undefined =>
  src ? (MAP[src] ?? src) : undefined;

/** Read a file into a data URL. */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

/** Downscale a data-URL image so previews & the feed stay light. */
export const downscale = (dataUrl: string, maxW = 1000): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      if (scale >= 1) return resolve(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

/** Validate + read + downscale an image file. Returns a data URL or an error message. */
export const readImageFile = async (
  file: File | undefined | null
): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> => {
  if (!file) return { ok: false, error: "No file selected." };
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "That isn't an image — JPG, PNG or WebP work best." };
  }
  try {
    const raw = await fileToDataUrl(file);
    return { ok: true, dataUrl: await downscale(raw) };
  } catch {
    return { ok: false, error: "Couldn't read that image. Try another one." };
  }
};
