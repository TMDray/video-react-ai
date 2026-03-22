import { describe, it, expect } from "vitest";
import {
  fadeIn,
  fadeOut,
  fadeInOut,
  glowPulse,
  typewriter,
  loadingDots,
  spinnerRotation,
  SPRING,
} from "../animations";

describe("SPRING presets", () => {
  it("expose les 4 presets", () => {
    expect(Object.keys(SPRING)).toEqual(["gentle", "snappy", "bouncy", "heavy"]);
  });
});

describe("fadeIn", () => {
  it("retourne 0 au début", () => expect(fadeIn(0)).toBe(0));
  it("retourne 1 après duration", () => expect(fadeIn(10)).toBe(1));
  it("clamp à 0 avant startAt", () => expect(fadeIn(5, 10)).toBe(0));
  it("clamp à 1 après startAt+duration", () => expect(fadeIn(30, 10, 15)).toBe(1));
});

describe("fadeOut", () => {
  it("retourne 1 avant le fade", () => expect(fadeOut(0, 20)).toBe(1));
  it("retourne 0 à endAt", () => expect(fadeOut(20, 20)).toBe(0));
  it("clamp à 1 avant", () => expect(fadeOut(-5, 20)).toBe(1));
});

describe("fadeInOut", () => {
  it("commence à 0", () => expect(fadeInOut(0, 60)).toBe(0));
  it("monte à 1 après le fade in", () => expect(fadeInOut(10, 60)).toBe(1));
  it("retombe à 0 à la fin", () => expect(fadeInOut(60, 60)).toBe(0));
});

describe("glowPulse", () => {
  it("reste dans [min, max]", () => {
    for (let i = 0; i < 200; i++) {
      const v = glowPulse(i);
      expect(v).toBeGreaterThanOrEqual(20);
      expect(v).toBeLessThanOrEqual(40);
    }
  });
});

describe("typewriter", () => {
  it("retourne 0 avant startAt", () => expect(typewriter(0, "hello", 10)).toBe(0));
  it("ne dépasse pas la longueur du texte", () => expect(typewriter(1000, "hi", 0, 10)).toBe(2));
  it("avance progressivement", () => {
    const frame = Math.ceil(3 / 0.8); // ~4 frames pour 3 chars à 0.8 chars/frame
    expect(typewriter(frame, "hello world", 0)).toBe(3);
  });
});

describe("loadingDots", () => {
  it("retourne 1 point à frame 0", () => expect(loadingDots(0)).toBe("."));
  it("retourne 2 points à frame 8", () => expect(loadingDots(8)).toBe(".."));
  it("retourne 3 points à frame 16", () => expect(loadingDots(16)).toBe("..."));
  it("revient à 1 après 3", () => expect(loadingDots(24)).toBe("."));
});

describe("spinnerRotation", () => {
  it("retourne 0 à frame 0", () => expect(spinnerRotation(0)).toBe(0));
  it("multiplie frame × speed", () => expect(spinnerRotation(10, 6)).toBe(60));
  it("utilise speed=12 par défaut", () => expect(spinnerRotation(5)).toBe(60));
});
