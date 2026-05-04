# HTML-in-canvas 対応

このリポジトリは Remotion の実験的な HTML-in-canvas API を使える構成にしています。

## 前提

- Remotion `4.0.455` 以上。
- Studio プレビュー: Chrome Canary 149+ で `chrome://flags/#canvas-draw-element` を有効化。
- レンダリング: 通常の Remotion CLI render を使います。Remotion 4.0.455+ では render 用の Chromium と flag が Remotion 側で用意されます。

## サンプル

```bash
pnpm -C apps/examples/html-in-canvas dev
pnpm -C apps/examples/html-in-canvas render
```

サンプルでは `HtmlInCanvas.isSupported()` を使い、未対応ブラウザの Studio でも fatal error ではなくフォールバック表示にします。

## 設定

HTML-in-canvas で動画や GPU post-processing を扱う project では `remotion.config.ts` に ANGLE を設定します。

```ts
import { Config } from "@remotion/cli/config";

Config.setChromiumOpenGlRenderer("angle");
```

`<HtmlInCanvas>` の入れ子は非対応です。複数効果が必要な場合は、できるだけ 1 つの `onPaint` callback にまとめてください。

公式ガイド: https://www.remotion.dev/docs/html-in-canvas
