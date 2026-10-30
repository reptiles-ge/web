const INSECURE_TOP_GE = /^http:\/\/(?:www\.)?top\.ge\//i;

export function secureTopGeLinks(container: HTMLElement) {
  for (const link of container.querySelectorAll("a")) {
    const href = link.getAttribute("href");
    if (href && INSECURE_TOP_GE.test(href)) {
      link.setAttribute("href", href.replace(/^http:/i, "https:"));
    }
    if (link.getAttribute("rel") !== "nofollow noopener") {
      link.setAttribute("rel", "nofollow noopener");
    }
  }
}
