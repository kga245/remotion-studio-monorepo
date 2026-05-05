import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serifFont } = loadPlayfair("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const { fontFamily: sansFont } = loadInter("normal", {
  weights: ["300", "400", "500"],
  subsets: ["latin"],
});

export { serifFont, sansFont };
