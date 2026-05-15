const ALLOWED_TAGS = ["strong", "em", "u", "br"] as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeAllowedTags(value: string) {
  return value
    .replace(/&lt;(\/?)(strong|b)&gt;/gi, (_, closing) =>
      closing ? "</strong>" : "<strong>",
    )
    .replace(/&lt;(\/?)(em|i)&gt;/gi, (_, closing) => (closing ? "</em>" : "<em>"))
    .replace(/&lt;(\/?)u&gt;/gi, (_, closing) => (closing ? "</u>" : "<u>"))
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />");
}

export function renderLimitedRichText(value: string) {
  return normalizeAllowedTags(escapeHtml(value).replace(/\r?\n/g, "<br />"));
}

export function stripLimitedRichText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(strong|b|em|i|u)>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function getLimitedRichTextNotes() {
  return [
    "Gunakan tag terbatas untuk format teks: <strong>teks tebal</strong>, <em>teks miring</em>, <u>teks garis bawah</u>.",
    "Baris baru otomatis akan tampil sebagai pindah baris.",
    "Tag lain di luar bold, italic, underline, dan line break akan diabaikan demi keamanan.",
  ];
}

export { ALLOWED_TAGS };
