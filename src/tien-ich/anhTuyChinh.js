import Image from "@tiptap/extension-image";

/**
 * Ảnh trong VNMark luôn cần 2 thông tin song song:
 * - `src`: URL mà webview có thể tải để HIỂN THỊ (asset://... hoặc data:...)
 * - `duongDanTuongDoi`: đường dẫn tương đối vd "assets/anh.png" để GHI ra Markdown
 * Tách hai giá trị này giúp ảnh hiển thị đúng ngay trong Tiptap mà file .md
 * xuất ra vẫn gọn, tương thích Jekyll/Hugo (mục 2.4 đặc tả).
 */
const AnhTuyChinh = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      duongDanTuongDoi: {
        default: null,
        parseHTML: (phanTu) =>
          phanTu.getAttribute("data-duong-dan-tuong-doi") ||
          (phanTu.getAttribute("src")?.startsWith("assets/") ? phanTu.getAttribute("src") : null),
        renderHTML: (thuocTinh) =>
          thuocTinh.duongDanTuongDoi ? { "data-duong-dan-tuong-doi": thuocTinh.duongDanTuongDoi } : {},
      },
    };
  },
});

export default AnhTuyChinh;
