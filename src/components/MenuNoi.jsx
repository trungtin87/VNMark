import React from "react";
import { BubbleMenu } from "@tiptap/react";

/**
 * Menu nổi phía trên vùng văn bản được chọn (mục 2.2 đặc tả):
 * Đậm, Nghiêng, Gạch chân, Liên kết, chuyển nhanh sang Tiêu đề.
 */
export default function MenuNoi({ editor }) {
  if (!editor) return null;

  const datLienKet = () => {
    const urlHienTai = editor.getAttributes("link").href;
    const url = window.prompt("Nhập địa chỉ liên kết:", urlHienTai || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 120 }} className="menu-noi">
      <button
        className={`nut-cong-cu ${editor.isActive("bold") ? "dang-bat" : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Đậm"
      >
        B
      </button>
      <button
        className={`nut-cong-cu ${editor.isActive("italic") ? "dang-bat" : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Nghiêng"
      >
        I
      </button>
      <button
        className={`nut-cong-cu ${editor.isActive("underline") ? "dang-bat" : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Gạch chân"
      >
        U
      </button>
      <button
        className={`nut-cong-cu ${editor.isActive("link") ? "dang-bat" : ""}`}
        onClick={datLienKet}
        title="Liên kết"
      >
        🔗
      </button>
      <button
        className={`nut-cong-cu ${editor.isActive("heading", { level: 2 }) ? "dang-bat" : ""}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Chuyển thành Tiêu đề"
      >
        H
      </button>
    </BubbleMenu>
  );
}
