import { startNavigationProgress } from "./lib/loading/navigationProgress";

export function onRouterTransitionStart(url, navigationType) {
  try {
    startNavigationProgress(url, navigationType);
  } catch {
    // Progress is visual only. A failure here must not block navigation.
  }
}
