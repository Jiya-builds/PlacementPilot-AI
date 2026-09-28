"use client";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";
import type { Engine } from "tsparticles-engine";

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="particles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },

        background: {
          color: "#ffffff",
        },

        particles: {
          number: {
            value: 60,
          },

          color: {
            value: ["#f97316", "#fb923c", "#f59e0b"],
          },

          links: {
            enable: true,
            color: "#f97316",
            distance: 150,
            opacity: 0.2,
          },

          move: {
            enable: true,
            speed: 1,
          },

          opacity: {
            value: 0.4,
          },

          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
        },
      }}
    />
  );
}