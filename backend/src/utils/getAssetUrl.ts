import { BACKEND_URL } from ".";

export const getAssetUrl = (filename: string) => {
  return `${BACKEND_URL}/assets/${filename}`;
};
