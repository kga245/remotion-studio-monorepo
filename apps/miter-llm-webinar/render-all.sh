#!/bin/bash
set -e
cd "$(dirname "$0")"

NODE="/opt/homebrew/opt/node@24/bin/node"
REMOTION="$NODE node_modules/@remotion/cli/remotion-cli.js"
RENDER="$REMOTION render src/index.ts"
OUT="out"

render_mp4() {
  local id="$1"
  local file="$OUT/$id.mp4"
  if [ -f "$file" ]; then
    echo "SKIP $id (already exists)"
  else
    echo "RENDER $id → $file"
    $RENDER "$id" "$file"
  fi
}

render_prores() {
  local id="$1"
  local file="$2"
  local out_path="$OUT/$file"
  if [ -f "$out_path" ]; then
    echo "SKIP $id (already exists)"
  else
    echo "RENDER $id → $out_path (ProRes 4444)"
    $RENDER "$id" "$out_path" --codec prores --prores-profile 4444 --pixel-format yuva444p10le --image-format png
  fi
}

echo "=== Title Cards ==="
render_mp4 Welcome
render_mp4 Bridge
render_mp4 Outro

echo "=== Narrative Act Cards ==="
render_mp4 ActOpen
render_mp4 Act1
render_mp4 Act2
render_mp4 Act3
render_mp4 Act4
render_mp4 Act5
render_mp4 ActClose

echo "=== Section Dividers ==="
render_mp4 Section01
render_mp4 Section02
render_mp4 Section03
render_mp4 Section04

echo "=== Section Intro Slides ==="
render_mp4 GEOLevelSettingIntro
render_mp4 MiterAuditIntro
render_mp4 WhatWeCanMeasureIntro

echo "=== Stats ==="
render_mp4 Stat85

echo "=== Act 1 Motion Graphics ==="
render_mp4 FunnelCrumble
render_mp4 LLMsAreRoom
render_mp4 BezosQuote
render_mp4 Studio54Bouncer
render_mp4 CantBribe
render_mp4 AreSomebody
render_mp4 KnowledgeGap
render_mp4 ExistentialThreat
render_mp4 ThreeBouncers

echo "=== Act 2 Motion Graphics ==="
render_mp4 Growth35
render_mp4 LowesCase

echo "=== Act 3 Motion Graphics ==="
render_mp4 TrainingVsAgentic
render_mp4 CTRDrop59
render_mp4 ZeroClick
render_mp4 MultiChannel

echo "=== Act 4 Motion Graphics ==="
render_mp4 PassageVsPage
render_mp4 QueryFanOuts
render_mp4 CosineSimilarity
render_mp4 EmbeddingViz
render_mp4 ContentDivergence
render_mp4 FetchabilityTips
render_mp4 AuthorityTips
render_mp4 ExtractabilityTips
render_mp4 CapstoneAtomization
render_mp4 GoodMarketing

echo "=== Act 5 Motion Graphics ==="
render_mp4 MilgardAudit
render_mp4 PGTAudit
render_mp4 MilgardTopicTable
render_mp4 PGTTopicTable
render_mp4 MIWindowsTopicTable
render_mp4 InvisiblePath
render_mp4 DarkFunnel
render_mp4 KPIs
render_mp4 Tsunami
render_mp4 TwoChoices
render_mp4 LockOut
render_mp4 TheSaysMITER

echo "=== Pull Quotes ==="
render_mp4 PullQuote01
render_mp4 PullQuote02
render_mp4 PullQuote03

echo "=== Key Takeaways ==="
render_mp4 KeyTakeaway01
render_mp4 KeyTakeaway02
render_mp4 KeyTakeaway03

echo "=== Lower Thirds (ProRes 4444 transparent) ==="
render_prores KellyAbbottLowerThird    lt-kelly-abbott.mov
render_prores ThadKahlowLowerThird     lt-thad-kahlow.mov
render_prores JohnBattistiniLowerThird lt-john-battistini.mov
render_prores EricDomeLowerThird       lt-eric-dome.mov
render_prores CatfishComstockLowerThird lt-catfish-comstock.mov
render_prores SarahRockwoodLowerThird  lt-sarah-rockwood.mov

echo "=== GEO Audit Overlays (ProRes 4444 transparent) ==="
render_prores MilgardAuditCard         MilgardAuditCard.mov
render_prores PGTAuditCard             PGTAuditCard.mov
render_prores MIWindowsAuditCard       MIWindowsAuditCard.mov
render_prores AndersonWindowsAuditCard AndersonWindowsAuditCard.mov

echo ""
echo "=== ALL RENDERS COMPLETE ==="
ls -lh out/*.mp4 out/*.mov 2>/dev/null | awk '{print $5, $9}'
