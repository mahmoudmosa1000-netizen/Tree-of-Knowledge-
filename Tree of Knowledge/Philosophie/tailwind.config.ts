import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#03050A",
        "bg-raised": "#0A0F1A",
        ink: "#DCE9FF",
        muted: "#9FC3E8",
        // Eisblau — durchgängige Leitfarbe (~72%, wie im Tunnel-Partikelfeld)
        violet: {
          DEFAULT: "#96CDFF",
          bright: "#C8E1FF",
          deep: "#4A7BA8",
        },
        // Gold/Orange — seltener Glanzpunkt (~28%, wie der Vortex-Kern-Glührand)
        gold: {
          DEFAULT: "#FFBE78",
          bright: "#FFB95F",
          dim: "#FF8C3C",
        },
        sage: "#FFBE78",
        ember: "#C36348",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Typografie-Skala — jede Rolle hat genau eine feste Größe/Zeilenhöhe/Tracking-Kombination.
      // Damit verwendet jede Komponente dieselben Werte statt Einzelentscheidungen.
      fontSize: {
        // Mono-Eyebrows/Labels: "IDEEN", Epochen, Zeitangaben
        label: ["10px", { lineHeight: "1.4", letterSpacing: "0.22em" }],
        // Meta-Text: Lebensdaten, Zähler, Hilfetexte
        meta: ["11px", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        // UI-Fließtext: Buttons, Inputs, Chat, Tags
        body: ["13.5px", { lineHeight: "1.55", letterSpacing: "0" }],
        // Lesetext: Zitate, Biografien, Werke (Fraunces italic)
        lede: ["15px", { lineHeight: "1.72", letterSpacing: "0" }],
        // Unterüberschriften: Epochen-Trenner, Modal-Titel
        h3: ["18px", { lineHeight: "1.3", letterSpacing: "0" }],
        // Listen-/Quiz-Namen
        h2: ["22px", { lineHeight: "1.15", letterSpacing: "-0.005em" }],
        // Sidebar-Philosophenname
        h1: ["26px", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        // Illuminierte Initiale
        initial: ["48px", { lineHeight: "0.85", letterSpacing: "0" }],
        // Intro-/Hero-Titel
        display: ["clamp(28px,5vw,52px)", { lineHeight: "1.1", letterSpacing: "0.01em" }],
      },
      backgroundImage: {
        constellation:
          "radial-gradient(1px 1px at 20% 30%, rgba(150,205,255,0.4) 0, transparent 100%), radial-gradient(1px 1px at 70% 60%, rgba(220,233,255,0.2) 0, transparent 100%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(150,205,255,0.28) 0, transparent 100%), radial-gradient(1px 1px at 85% 15%, rgba(220,233,255,0.16) 0, transparent 100%), radial-gradient(1.5px 1.5px at 55% 45%, rgba(255,190,120,0.2) 0, transparent 100%)",
        vignette:
          "radial-gradient(ellipse at 50% 40%, rgba(10,15,26,0) 0%, rgba(3,5,10,0.92) 78%)",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
        pulseCorrect: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.035)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        kineticWord: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.4s ease-out both",
        sway: "sway 4.5s ease-in-out infinite",
        "pulse-correct": "pulseCorrect 0.4s ease-out",
        shake: "shake 0.4s ease-in-out",
        "pop-in": "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        "kinetic-word": "kineticWord 0.45s ease-out both",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
