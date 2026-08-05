"use client";

import { useCallback, useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1,
      },

      background: {
        color: "#050816",
      },

      particles: {
        number: {
          value: 60,
        },

        color: {
          value: ["#8b5cf6", "#3b82f6", "#06b6d4"],
        },

        links: {
          enable: true,
          color: "#8b5cf6",
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
    }),
    []
  );

  return (
    <ParticlesProvider init={particlesInit}>
      <Particles id="particles" options={options} />
    </ParticlesProvider>
  );
}
