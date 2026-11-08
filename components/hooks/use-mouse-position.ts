"use client";

import { useEffect, useRef, useState } from "react";

export function useMousePosition(ref?: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: -100, y: -100, isVisible: false });

  useEffect(() => {
    // Check if pointer is coarse / touch device
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return;
    }

    const update = (clientX: number, clientY: number) => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPos({
          x: clientX - rect.left,
          y: clientY - rect.top,
          isVisible: true,
        });
      } else {
        setPos({
          x: clientX,
          y: clientY,
          isVisible: true,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      update(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setPos((prev) => ({ ...prev, isVisible: false }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return pos;
}

export function useMousePositionRef(ref?: React.RefObject<HTMLElement | null>) {
  const posRef = useRef({ x: 0, y: 0, isVisible: false });

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return;
    }

    const update = (clientX: number, clientY: number) => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        posRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
          isVisible: true,
        };
      } else {
        posRef.current = {
          x: clientX,
          y: clientY,
          isVisible: true,
        };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      update(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      posRef.current.isVisible = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return posRef;
}
