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
