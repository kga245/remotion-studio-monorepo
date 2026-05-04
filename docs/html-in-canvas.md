# HTML-in-canvas Support

This repository is configured for Remotion's experimental HTML-in-canvas API.

## Requirements

- Remotion `4.0.455` or newer.
- For Studio preview: Chrome Canary 149+ with `chrome://flags/#canvas-draw-element` enabled.
- For rendering: use the normal Remotion CLI render path. Remotion 4.0.455+ provides the supported Chromium build and flag for render jobs.

## Example

```bash
pnpm -C apps/examples/html-in-canvas dev
pnpm -C apps/examples/html-in-canvas render
```

The example uses `HtmlInCanvas.isSupported()` so unsupported Studio browsers get a fallback instead of a fatal preview error.

## Config

Set ANGLE in `remotion.config.ts` for projects that use HTML-in-canvas with video or GPU post-processing:

```ts
import { Config } from "@remotion/cli/config";

Config.setChromiumOpenGlRenderer("angle");
```

Do not nest `<HtmlInCanvas>` components. Combine effects into one `onPaint` callback when possible.

Official guide: https://www.remotion.dev/docs/html-in-canvas
