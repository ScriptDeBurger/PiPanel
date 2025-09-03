import { FastAverageColor } from "fast-average-color";

/**
 * Returns the average color (hex code) of an image given its URL
 *
 * @param imageUrl - The URL of the image
 * @returns The average color as a hex string (e.g. #aabbcc)
 */
export async function getAverageColor(imageUrl: string): Promise<string> {
  const fac = new FastAverageColor();
  const color = await fac.getColorAsync(imageUrl);
  fac.destroy();
  return color.hex;
}