# HTML-in-canvas Demo

This example demonstrates Remotion's `HtmlInCanvas` component.

```bash
pnpm -C apps/examples/html-in-canvas dev
pnpm -C apps/examples/html-in-canvas render
```

Studio preview requires Chrome Canary 149+ with `chrome://flags/#canvas-draw-element` enabled. The example shows a fallback in unsupported Studio browsers so the app can still open.

Rendering uses Remotion 4.0.455+ and `Config.setChromiumOpenGlRenderer("angle")`, which matches Remotion's recommendation for HTML-in-canvas effects that include video or GPU post-processing.
