"use client";

import dynamic from "next/dynamic";

const PrecisionCrosshairCursor = dynamic(
  () =>
    import("@/components/ui/variable-font-and-cursor").then(
      (mod) => mod.PrecisionCrosshairCursor
    ),
  { ssr: false }
);

export function CustomCursor() {
  return <PrecisionCrosshairCursor showCrosshairs={true} showCoordinates={true} />;
}
