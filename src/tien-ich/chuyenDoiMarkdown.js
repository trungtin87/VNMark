import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import yaml from "js-yaml";

// ---- Cấu hình marked: Markdown --> HTML sạch để nạp vào Tiptap ----
marked.setOptions({
  gfm: true, // bật bảng, gạch ngang, task list theo chuẩn GitHub Flavored Markdown
  breaks: false,
});

/**
 * Chuyển nội dung Markdown thuần (không kèm Front Matter) thành HTML sạch
 * để nạp thẳng vào Tiptap.
 * @param {string} markdown
 * @returns {string} html
 */
export function markdownSangHtml(markdown) {
  if (!markdown) return "<p></p>";
  return marked.parse(markdown);
}

// ---- Cấu hình turndown: HTML (Tiptap) --> Markdown chuẩn ----
const boChuyenDoi = new TurndownService({
  headingStyle: "atx", // # Tiêu đề
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
});
boChuyenDoi.use(gfm); // thêm hỗ trợ bảng, gạch ngang ~~, task list - [ ]

// Tiptap xuất <u> cho gạch chân, Markdown chuẩn không có ký hiệu riêng
// nên ta giữ nguyên thẻ <u> (Jekyll/Hugo vẫn render HTML thô trong Markdown).
boChuyenDoi.addRule("gachChan", {
  filter: ["u"],
  replacement: (noiDung) => `<u>${noiDung}</u>`,
});

// Ảnh: ưu tiên đường dẫn tương đối trong thư mục assets/ (xem anhTuyChinh.js)
// thay vì URL asset://... chỉ dùng để hiển thị trong webview.
boChuyenDoi.addRule("anhTuongDoi", {
  filter: "img",
  replacement: (_noiDung, phanTu) => {
    const duongDanTuongDoi = phanTu.getAttribute("data-duong-dan-tuong-doi");
    const alt = phanTu.getAttribute("alt") || "";
    const src = duongDanTuongDoi || phanTu.getAttribute("src") || "";
    return `![${alt}](${src})`;
  },
});

/**
 * Chuyển HTML từ vùng soạn thảo Tiptap thành Markdown chuẩn.
 * @param {string} html
 * @returns {string} markdown
 */
export function htmlSangMarkdown(html) {
  if (!html) return "";
  return boChuyenDoi.turndown(html).trim() + "\n";
}

/**
 * Tách một file .md thô thành { duLieuYaml, noiDungMarkdown }.
 * Nhận diện khối Front Matter nằm giữa hai dòng "---" ở đầu file (chấp
 * nhận cả xuống dòng kiểu Windows \r\n lẫn Unix \n). Nếu file không có
 * Front Matter, trả về duLieuYaml rỗng và giữ nguyên toàn bộ nội dung.
 * @param {string} noiDungFileTho toàn bộ nội dung file .md đọc từ đĩa
 */
export function tachFrontMatter(noiDungFileTho) {
  const raw = noiDungFileTho || "";
  const khop = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/);
  if (!khop) {
    return { duLieuYaml: {}, noiDungMarkdown: raw };
  }
  let duLieuYaml = {};
  try {
    duLieuYaml = yaml.load(khop[1]) || {};
  } catch (loi) {
    console.error("VNMark — không đọc được khối YAML Front Matter, sẽ bỏ qua:", loi);
    duLieuYaml = {};
  }
  return { duLieuYaml, noiDungMarkdown: khop[2] };
}

/**
 * Ghép khối YAML (chuỗi đã có --- hai đầu) với nội dung Markdown thành
 * nội dung file .md hoàn chỉnh, sẵn sàng ghi ra đĩa.
 * @param {string} khoiYaml chuỗi trả về từ sinhKhoiYaml()
 * @param {string} noiDungMarkdown
 */
export function ghepFileMarkdown(khoiYaml, noiDungMarkdown) {
  const noiDungSach = (noiDungMarkdown || "").trim();
  return `${khoiYaml}\n${noiDungSach}\n`;
}
