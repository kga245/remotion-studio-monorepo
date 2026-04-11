/**
 * Re-export of the canonical `EasingFunction` from `@studio/easings`.
 * Kept here so consumers of `@studio/core-types` don't need a direct
 * dependency on `@studio/easings` when they only want the type.
 */
export type { EasingFunction } from "@studio/easings";
import type { EasingFunction } from "@studio/easings";

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: EasingFunction | string;
}

/**
 * Spring animation configuration
 */
export interface SpringConfig {
  fps: number;
  frame: number;
  config?: {
    mass?: number;
    damping?: number;
    stiffness?: number;
    overshootClamping?: boolean;
  };
}

/**
 * Transition types
 */
export type TransitionType =
  | "fade"
  | "slide"
  | "zoom"
  | "wipe"
  | "dissolve"
  | "none";

/**
 * Transition configuration
 */
export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  easing?: EasingFunction | string;
}

/**
 * Animation direction
 */
export type AnimationDirection =
  | "normal"
  | "reverse"
  | "alternate"
  | "alternate-reverse";

/**
 * Animation state
 */
export type AnimationState = "idle" | "running" | "paused" | "finished";
