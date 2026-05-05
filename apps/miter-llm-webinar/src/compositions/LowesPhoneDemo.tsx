import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── LowesPhoneDemo ────────────────────────────────────────────────────────────
//
// Clean phone mockup showing the Lowe's Pocket Contractor AI chat.
// Just the device — no side panels, no analysis copy.
// Messages animate in sequentially, mirroring how the product actually works.
//
// Duration: 12s (360 frames @ 30fps)
//
// ─────────────────────────────────────────────────────────────────────────────

// Lowe's brand blue
const LOWES_BLUE = "#004990";
const LOWES_ORANGE = "#F96302";

// ─── Chat bubble components ───────────────────────────────────────────────────

const UserBubble: React.FC<{ text: string; progress: number }> = ({
  text,
  progress,
}) => (
  <div
    style={{
      alignSelf: "flex-end",
      maxWidth: "75%",
      background: LOWES_ORANGE,
      borderRadius: "18px 18px 4px 18px",
      padding: "12px 16px",
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
    }}
  >
    <div
      style={{
        fontFamily,
        fontSize: 18,
        fontWeight: 500,
        color: "#fff",
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  </div>
);

const AIBubble: React.FC<{ children: React.ReactNode; progress: number }> = ({
  children,
  progress,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
    }}
  >
    {/* Lowe's "L" avatar */}
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: LOWES_BLUE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
        fontFamily,
        fontSize: 16,
        fontWeight: 900,
        color: "#fff",
      }}
    >
      L
    </div>
    <div
      style={{
        maxWidth: "80%",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "18px 18px 18px 4px",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: 17,
          fontWeight: 400,
          color: "rgba(255,255,255,0.85)",
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const ProductCard: React.FC<{
  name: string;
  sub: string;
  progress: number;
}> = ({ name, sub, progress }) => (
  <div
    style={{
      flex: 1,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 10,
      padding: "12px 14px",
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [8, 0])}px)`,
    }}
  >
    <div
      style={{
        fontFamily,
        fontSize: 16,
        fontWeight: 700,
        color: "#fff",
        marginBottom: 3,
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontFamily,
        fontSize: 14,
        fontWeight: 400,
        color: "rgba(255,255,255,0.50)",
      }}
    >
      {sub}
    </div>
  </div>
);

// ─── Main composition ─────────────────────────────────────────────────────────

export const LowesPhoneDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  // Phone slides up on entry
  const phoneP = s(0.1, { damping: 18, stiffness: 80 });
  const phoneY = interpolate(phoneP, [0, 1], [60, 0]);

  // Chat messages
  const msg1P = s(0.6); // user: window question
  const msg2P = s(1.4); // AI: response
  const msg3P = s(2.6); // user: humidity follow-up
  const productsP = s(3.4); // suggested products header
  const prod1P = s(3.7);
  const prod2P = s(3.95);

  // Label above phone
  const labelP = s(0.05);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* Subtle glow behind phone */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 700,
              background: `radial-gradient(ellipse, ${LOWES_BLUE}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* Label above */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              opacity: labelP,
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: 26,
                fontWeight: 400,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Lowe's Pocket Contractor — Powered by OpenAI
            </div>
          </div>

          {/* Phone */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, calc(-50% + ${phoneY}px))`,
              opacity: phoneP,
              width: 480,
              background: "#141420",
              borderRadius: 40,
              overflow: "hidden",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* App header */}
            <div
              style={{
                background: LOWES_BLUE,
                padding: "20px 20px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily,
                    fontSize: 20,
                    fontWeight: 900,
                    color: LOWES_BLUE,
                  }}
                >
                  L
                </div>
                <div>
                  <div
                    style={{
                      fontFamily,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Lowe's Pocket Contractor
                  </div>
                  <div
                    style={{
                      fontFamily,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    Powered by OpenAI · Lowe's Home Improvement
                  </div>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div
              style={{
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 520,
              }}
            >
              <UserBubble
                text="I'm replacing all windows in my 1980s home. Where do I start?"
                progress={msg1P}
              />

              <AIBubble progress={msg2P}>
                Great project! For a 1980s home, start with:
                <br />
                1. Check for single-pane glass — major energy loss
                <br />
                2. Measure rough openings before ordering
                <br />
                3. Look for windows with U-factor ≤ 0.27
              </AIBubble>

              <UserBubble
                text="Which brands handle high-humidity climates best?"
                progress={msg3P}
              />

              {/* Suggested products */}
              <div style={{ opacity: productsP }}>
                <div
                  style={{
                    fontFamily,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Suggested Products
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <ProductCard
                    name="Milgard Ultra Series"
                    sub="Fiberglass · High humidity"
                    progress={prod1P}
                  />
                  <ProductCard
                    name="PGT WinGuard"
                    sub="Impact + moisture resistance"
                    progress={prod2P}
                  />
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
