export const NAVIGATION_START_EVENT = "portfolio:navigation-start";

export function startNavigationProgress(url, navigationType) {
  if (typeof window === "undefined") {
    return;
  }

  if (navigationType !== "traverse") {
    let nextUrl;

    try {
      nextUrl = new URL(url, window.location.href);
    } catch {
      return;
    }

    if (
      nextUrl.pathname === window.location.pathname &&
      nextUrl.search === window.location.search
    ) {
      return;
    }
  }

  window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
}
