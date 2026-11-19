import { useSyncExternalStore } from "react";
import { fromHash } from "../routes";

const sub = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
export function usePathname() {
  return useSyncExternalStore(sub, () => fromHash(window.location.hash), () => "/");
}
export function notFound(): never {
  throw new Error("not found");
}
