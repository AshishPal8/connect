import type { GenderEnum } from "../generated/prisma";
import { getAssetUrl } from "./getAssetUrl";

const BOY_COUNT = 5;
const GIRL_COUNT = 5;

function pickRandom(n: number) {
  return Math.floor(Math.random() * n) + 1;
}

export function getRandomAvatarUrl(gender: GenderEnum | undefined) {
  if (gender === "MALE") {
    const idx = pickRandom(BOY_COUNT);
    return getAssetUrl(`profile/boy_${idx}.png`);
  }
  if (gender === "FEMALE") {
    const idx = pickRandom(GIRL_COUNT);
    return getAssetUrl(`profile/girl_${idx}.png`);
  }
  // OTHER or undefined -> neutral pick
  return getAssetUrl(`profile/defult.jpg`);
}
