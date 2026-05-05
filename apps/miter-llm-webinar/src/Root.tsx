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
import { BezosQuote } from "./compositions/BezosQuote";
import { LLMsAreRoom } from "./compositions/LLMsAreRoom";
import { CantBribe } from "./compositions/CantBribe";
import { AreSomebody } from "./compositions/AreSomebody";
import { ExistentialThreat } from "./compositions/ExistentialThreat";
import { FetchabilityTips } from "./compositions/FetchabilityTips";
import { AuthorityTips } from "./compositions/AuthorityTips";
import { ExtractabilityTips } from "./compositions/ExtractabilityTips";
import { GoodMarketing } from "./compositions/GoodMarketing";
import { TheSaysMITER } from "./compositions/TheSaysMITER";
import { EmbeddingViz } from "./compositions/EmbeddingViz";
import { FunnelCrumble } from "./compositions/FunnelCrumble";
import { LockOut } from "./compositions/LockOut";
import { ContentDivergence } from "./compositions/ContentDivergence";
import { KnowledgeGap } from "./compositions/KnowledgeGap";
import { InvisiblePath } from "./compositions/InvisiblePath";
import { Welcome } from "./compositions/Welcome";
import { Bridge } from "./compositions/Bridge";
import { Outro } from "./compositions/Outro";
import {
  MilgardAudit as MilgardAuditCard,
  PGTAudit as PGTAuditCard,
  MIWindowsAudit as MIWindowsAuditCard,
  AndersonWindowsAudit as AndersonWindowsAuditCard,
} from "./compositions/AuditOverlay";
import {
  KellyAbbottLowerThird,
  ThadKahlowLowerThird,
  JohnBattistiniLowerThird,
  EricDomeLowerThird,
  CatfishComstockLowerThird,
  SarahRockwoodLowerThird,
  MiterSpeakerLowerThird,
  GuestSpeakerLowerThird,
} from "./compositions/LowerThird";
import {
  ActOpen,
  Act1,
  Act2,
  Act3,
  Act4,
  Act5,
  ActClose,
} from "./compositions/NarrativeActCards";
import {
  Section01,
  Section02,
  Section03,
  Section04,
} from "./compositions/SectionDivider";
import {
  GEOLevelSettingIntro,
  MiterAuditIntro,
  WhatWeCanMeasureIntro,
} from "./compositions/SectionIntroSlide";
import {
  PullQuote01,
  PullQuote02,
  PullQuote03,
  PullQuote04,
} from "./compositions/PullQuote";
import {
  PartTwoCard,
  NextSessionTeaser,
  GettingTechnicallyCreative,
} from "./compositions/SessionCards";
import {
  KeyTakeaway01,
  KeyTakeaway02,
  KeyTakeaway03,
} from "./compositions/KeyTakeaway";
import { GEOStatement } from "./compositions/GEOStatement";
import { LowesPhoneDemo } from "./compositions/LowesPhoneDemo";
import {
  LLMEvalRoadmap,
  EvaluationQuestion,
  PageVsPassage,
} from "./compositions/PassageExplainer";
import {
  AttributionIntro,
  AttributionMemoryPath,
  AttributionArticlePath,
} from "./compositions/AttributionPath";
import { MiterGEOAudit } from "./compositions/GEOAuditIntro";
import {
  AuditSetup,
  AuditByNumbers,
  AuditPlatforms,
  AuditDefinitions,
} from "./compositions/AuditMethodology";
import {
  AIKnowsIntro,
  AIKnows1947,
  AIKnowsHistory,
  AIKnowsMilgard,
  AIKnowsEnergy,
  AIKnowsDealer,
  AIKnowsWarranty,
  AIDefaulting,
} from "./compositions/AIKnowledgeCards";
import {
  MilgardTopicTable,
  PGTTopicTable,
  MIWindowsTopicTable,
} from "./compositions/GEOTopicTable";

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

        {/* Batch 5 — Interstitials */}
        <Composition
          id="BezosQuote"
          component={BezosQuote}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LLMsAreRoom"
          component={LLMsAreRoom}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CantBribe"
          component={CantBribe}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AreSomebody"
          component={AreSomebody}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ExistentialThreat"
          component={ExistentialThreat}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="FetchabilityTips"
          component={FetchabilityTips}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AuthorityTips"
          component={AuthorityTips}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ExtractabilityTips"
          component={ExtractabilityTips}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GoodMarketing"
          component={GoodMarketing}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="TheSaysMITER"
          component={TheSaysMITER}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* Batch 7 — New Motion Graphics */}
      <Composition
        id="EmbeddingViz"
        component={EmbeddingViz}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FunnelCrumble"
        component={FunnelCrumble}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LockOut"
        component={LockOut}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ContentDivergence"
        component={ContentDivergence}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KnowledgeGap"
        component={KnowledgeGap}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InvisiblePath"
        component={InvisiblePath}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ─── Migrated from title-cards project ─── */}

      <Folder name="Title-Cards">
        <Composition
          id="Welcome"
          component={Welcome}
          durationInFrames={282}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Bridge"
          component={Bridge}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Outro"
          component={Outro}
          durationInFrames={25 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="GEO-Audit-Cards">
        <Composition
          id="AndersonWindowsAuditCard"
          component={AndersonWindowsAuditCard}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MilgardAuditCard"
          component={MilgardAuditCard}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PGTAuditCard"
          component={PGTAuditCard}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MIWindowsAuditCard"
          component={MIWindowsAuditCard}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Lower-Thirds">
        <Composition
          id="KellyAbbottLowerThird"
          component={KellyAbbottLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ThadKahlowLowerThird"
          component={ThadKahlowLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="JohnBattistiniLowerThird"
          component={JohnBattistiniLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EricDomeLowerThird"
          component={EricDomeLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CatfishComstockLowerThird"
          component={CatfishComstockLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SarahRockwoodLowerThird"
          component={SarahRockwoodLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MiterSpeakerLowerThird"
          component={MiterSpeakerLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GuestSpeakerLowerThird"
          component={GuestSpeakerLowerThird}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Narrative-Acts">
        <Composition
          id="ActOpen"
          component={ActOpen}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Act1"
          component={Act1}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Act2"
          component={Act2}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Act3"
          component={Act3}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Act4"
          component={Act4}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Act5"
          component={Act5}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ActClose"
          component={ActClose}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Section-Dividers">
        <Composition
          id="Section01"
          component={Section01}
          durationInFrames={5 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Section02"
          component={Section02}
          durationInFrames={5 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Section03"
          component={Section03}
          durationInFrames={5 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Section04"
          component={Section04}
          durationInFrames={5 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Section-Intros">
        <Composition
          id="GEOLevelSettingIntro"
          component={GEOLevelSettingIntro}
          durationInFrames={18 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MiterAuditIntro"
          component={MiterAuditIntro}
          durationInFrames={18 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="WhatWeCanMeasureIntro"
          component={WhatWeCanMeasureIntro}
          durationInFrames={18 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Pull-Quotes">
        <Composition
          id="PullQuote01"
          component={PullQuote01}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PullQuote02"
          component={PullQuote02}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PullQuote03"
          component={PullQuote03}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PullQuote04"
          component={PullQuote04}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PartTwoCard"
          component={PartTwoCard}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="NextSessionTeaser"
          component={NextSessionTeaser}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GettingTechnicallyCreative"
          component={GettingTechnicallyCreative}
          durationInFrames={5 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Key-Takeaways">
        <Composition
          id="KeyTakeaway01"
          component={KeyTakeaway01}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KeyTakeaway02"
          component={KeyTakeaway02}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="KeyTakeaway03"
          component={KeyTakeaway03}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GEOStatement"
          component={GEOStatement}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LowesPhoneDemo"
          component={LowesPhoneDemo}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LLMEvalRoadmap"
          component={LLMEvalRoadmap}
          durationInFrames={16 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EvaluationQuestion"
          component={EvaluationQuestion}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PageVsPassage"
          component={PageVsPassage}
          durationInFrames={14 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AttributionIntro"
          component={AttributionIntro}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AttributionMemoryPath"
          component={AttributionMemoryPath}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AttributionArticlePath"
          component={AttributionArticlePath}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MiterGEOAudit"
          component={MiterGEOAudit}
          durationInFrames={12 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AuditSetup"
          component={AuditSetup}
          durationInFrames={6 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AuditByNumbers"
          component={AuditByNumbers}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AuditPlatforms"
          component={AuditPlatforms}
          durationInFrames={8 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AuditDefinitions"
          component={AuditDefinitions}
          durationInFrames={10 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Folder name="AI-Knowledge-Cards">
          <Composition
            id="AIKnowsIntro"
            component={AIKnowsIntro}
            durationInFrames={90}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnows1947"
            component={AIKnows1947}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnowsHistory"
            component={AIKnowsHistory}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnowsMilgard"
            component={AIKnowsMilgard}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnowsEnergy"
            component={AIKnowsEnergy}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnowsDealer"
            component={AIKnowsDealer}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIKnowsWarranty"
            component={AIKnowsWarranty}
            durationInFrames={75}
            fps={30}
            width={1920}
            height={1080}
          />
          <Composition
            id="AIDefaulting"
            component={AIDefaulting}
            durationInFrames={90}
            fps={30}
            width={1920}
            height={1080}
          />
        </Folder>
      </Folder>

      <Folder name="GEO-Topic-Tables">
        <Composition
          id="MilgardTopicTable"
          component={MilgardTopicTable}
          durationInFrames={20 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PGTTopicTable"
          component={PGTTopicTable}
          durationInFrames={20 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="MIWindowsTopicTable"
          component={MIWindowsTopicTable}
          durationInFrames={20 * 30}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
