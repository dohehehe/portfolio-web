function getDocumentTop(element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

export function scrollToSection(id, behavior = "smooth") {
  if (!id) {
    return;
  }

  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  const frame = element.hasAttribute("data-work-frame")
    ? element
    : element.closest("[data-work-frame]");
  const runway = frame?.nextElementSibling;

  if (
    frame &&
    runway?.hasAttribute("data-work-runway") &&
    getComputedStyle(frame).position === "sticky"
  ) {
    const stickyTop = Number.parseFloat(getComputedStyle(frame).top) || 0;
    const top = getDocumentTop(runway) - frame.offsetHeight - stickyTop;
    window.scrollTo({ top: Math.max(0, top), behavior });
    return;
  }

  element.scrollIntoView({ behavior, block: "start" });
}

export function getSectionHash() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.hash.replace(/^#/, "");
}
