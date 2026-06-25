export function scrollToSection(id, behavior = "smooth") {
  if (!id) {
    return;
  }

  const element = document.getElementById(id);

  if (!element) {
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
