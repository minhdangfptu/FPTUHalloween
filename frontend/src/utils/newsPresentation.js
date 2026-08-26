const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

export const getNewsPresentation = (item = {}) => {
  const rawTitle = normalizeText(item.title);
  const titleMatch = rawTitle.match(/^\[([^\]]+)\]\s*:?\s*(.*)$/);
  const tag = titleMatch ? normalizeText(titleMatch[1]) : "";
  const title = normalizeText(titleMatch?.[2] || rawTitle);
  const rawContent = normalizeText(item.content);
  const content = tag
    ? rawContent.replace(
      new RegExp(`^\\[${escapeRegExp(tag)}\\]\\s*:?\\s*`, "i"),
      "",
    )
    : rawContent;

  return { tag, title, content };
};
