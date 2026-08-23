const handleSectionScroll = (event) => {
  event.preventDefault();

  const targetId = event.currentTarget.getAttribute("href");
  const target = targetId ? document.querySelector(targetId) : null;

  target?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
};

export default handleSectionScroll;
