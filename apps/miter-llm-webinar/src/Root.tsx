import "./index.css";
import { Composition, Folder } from "remotion";
import { SegmentedCaptions } from "./SegmentedCaptions";
import { brand } from "./theme";
import { Stat85 } from "./compositions/Stat85";
import { Studio54Bouncer } from "./compositions/Studio54Bouncer";
import { ThreeBouncers } from "./compositions/ThreeBouncers";
import { CTRDrop59 } from "./compositions/CTRDrop59";
import { ZeroClick } from "./compositions/ZeroClick";
import { Growth35 } from "./compositions/Growth35";
import { LowesCase } from "./compositions/LowesCase";
import { TrainingVsAgentic } from "./compositions/TrainingVsAgentic";
import { MultiChannel } from "./compositions/MultiChannel";
import { PassageVsPage } from "./compositions/PassageVsPage";
import { QueryFanOuts } from "./compositions/QueryFanOuts";
import { CosineSimilarity } from "./compositions/CosineSimilarity";
import { ContentPerLLM } from "./compositions/ContentPerLLM";
import { CapstoneAtomization } from "./compositions/CapstoneAtomization";
import { MilgardAudit } from "./compositions/MilgardAudit";
import { PGTAudit } from "./compositions/PGTAudit";
import { DarkFunnel } from "./compositions/DarkFunnel";
import { KPIs } from "./compositions/KPIs";
import { Tsunami } from "./compositions/Tsunami";
import { TwoChoices } from "./compositions/TwoChoices";

// Webinar: 22:32 = 1352s at 30fps
// 45 segments, each ~30 seconds

const SEGMENTS: [number, number][] = [
  [1020, 30862], // Segment 01
  [30062, 63297], // Segment 02
  [62677, 94202], // Segment 03
  [93902, 122682], // Segment 04
  [122032, 151597], // Segment 05
  [151007, 182749], // Segment 06
  [181949, 212369], // Segment 07
  [211569, 244509], // Segment 08
  [243709, 274434], // Segment 09
  [273634, 304024], // Segment 10
  [303224, 331984], // Segment 11
  [331184, 362774], // Segment 12
  [362244, 395054], // Segment 13
  [394254, 421159], // Segment 14
  [420689, 451749], // Segment 15
  [452299, 481644], // Segment 16
  [481654, 511929], // Segment 17
  [511129, 544599], // Segment 18
  [544369, 574134], // Segment 19
  [573334, 602359], // Segment 20
  [602009, 631594], // Segment 21
  [631844, 663409], // Segment 22
  [662879, 694439], // Segment 23
  [694919, 722884], // Segment 24
  [722474, 753424], // Segment 25
  [752654, 786094], // Segment 26
  [785564, 812049], // Segment 27
  [811249, 844326], // Segment 28
  [843526, 876801], // Segment 29
  [876001, 904146], // Segment 30
  [903376, 934771], // Segment 31
  [934056, 965531], // Segment 32
  [964731, 992521], // Segment 33
  [991721, 1025069], // Segment 34
  [1024269, 1052849], // Segment 35
  [1052049, 1082564], // Segment 36
  [1082964, 1117029], // Segment 37
  [1116499, 1146189], // Segment 38
  [1145389, 1173779], // Segment 39
  [1172979, 1206474], // Segment 40
  [1205674, 1234719], // Segment 41
  [1233919, 1262484], // Segment 42
  [1261984, 1293454], // Segment 43
  [1293044, 1323119], // Segment 44
  [1322319, 1352039], // Segment 45
];

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Captions">
        {SEGMENTS.map(([startMs, endMs], i) => {
          const durationInFrames = Math.max(
            1,
            Math.round(((endMs - startMs) / 1000) * FPS),
          );
          const id = `Segment-${String(i + 1).padStart(2, "0")}`;

          return (
            <Composition
              key={id}
              id={id}
              component={SegmentedCaptions}
              defaultProps={{ brand, srtFile: "captions.srt", startMs, endMs }}
              durationInFrames={durationInFrames}
              fps={FPS}
              width={1280}
              height={720}
            />
          );
        })}
      </Folder>

      <Folder name="Animations">
        {/* Batch 1 — Stats & Metaphors */}
        <Composition
          id="Stat85"
          component={Stat85}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Studio54Bouncer"
          component={Studio54Bouncer}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ThreeBouncers"
          component={ThreeBouncers}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CTRDrop59"
          component={CTRDrop59}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ZeroClick"
          component={ZeroClick}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Batch 2 — Data & Frameworks */}
        <Composition
          id="Growth35"
          component={Growth35}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LowesCase"
          component={LowesCase}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="TrainingVsAgentic"
          component={TrainingVsAgentic}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MultiChannel"
          component={MultiChannel}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PassageVsPage"
          component={PassageVsPage}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Batch 3 — Deep Mechanics */}
        <Composition
          id="QueryFanOuts"
          component={QueryFanOuts}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CosineSimilarity"
          component={CosineSimilarity}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ContentPerLLM"
          component={ContentPerLLM}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CapstoneAtomization"
          component={CapstoneAtomization}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MilgardAudit"
          component={MilgardAudit}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Batch 4 — Impact & Decision */}
        <Composition
          id="PGTAudit"
          component={PGTAudit}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DarkFunnel"
          component={DarkFunnel}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KPIs"
          component={KPIs}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Tsunami"
          component={Tsunami}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="TwoChoices"
          component={TwoChoices}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
