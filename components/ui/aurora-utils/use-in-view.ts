"use client";

import { useCallback, useEffect, useState } from "react";

export function useInView<T extends Element>({ rootMargin, threshold }: { rootMargin?: string; threshold?: number } = {}) {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin, threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin, threshold]);

  const observe = useCallback((element: T | null) => setNode(element), []);
  return [observe, inView] as const;
}
