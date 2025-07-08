export const createEmptyImageFile = (): File => {
  return new File([], "empty.jpg", { type: "image/jpeg" });
};
