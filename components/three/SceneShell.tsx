"use client";
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react";

/** Check WebGL support (cached). */
let webglCache: boolean | null = null;
export function hasWebGL() {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

export function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    setM(q.matches);
    const on = () => setM(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return m;
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    console.warn("[3D] scene disabled, showing fallback", e);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type Props = {
  className?: string;
  fallback: ReactNode;
  /** Render function: receives `active` (visible on screen) to pause the render loop. */
  children: (active: boolean) => ReactNode;
  label: string;
  eager?: boolean;
};

/**
 * Container for a 3D scene:
 * - mounts the canvas only near the viewport (lazy, code-split by the scenes)
 * - signals visibility so the frameloop can be paused
 * - static fallback if WebGL is missing or the scene fails to load
 * The canvas is decorative: every piece of information is also in the HTML around it.
 */
export function SceneShell({ className = "", fallback, children, label, eager }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(!!eager);
  const [active, setActive] = useState(!!eager);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    setGl(hasWebGL());
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: "600px 0px" });
    const vis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "80px 0px" });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} ${className}`} role="img" aria-label={label}>
      {gl === false || !mounted ? (
        <div className="absolute inset-0">{fallback}</div>
      ) : gl ? (
        <Boundary fallback={<div className="absolute inset-0">{fallback}</div>}>
          <Suspense fallback={<div className="absolute inset-0">{fallback}</div>}>{children(active)}</Suspense>
        </Boundary>
      ) : null}
    </div>
  );
}
