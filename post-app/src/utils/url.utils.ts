export const getStoragePathFromUrl = (url: string): string | null => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+?)\?/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
};

export const getFileNameFromUrl = (url: string): string  => {
  try {
    const path = getStoragePathFromUrl(url);
    return path ? path.split("/").pop() || "" : "";
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return "";
  }
};
