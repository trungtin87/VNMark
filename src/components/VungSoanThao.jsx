import React from "react";
import { EditorContent } from "@tiptap/react";
import MenuNoi from "./MenuNoi.jsx";

/**
 * Trang giấy A4 mô phỏng, chứa vùng soạn thảo Tiptap và menu nổi.
 * Kéo-thả / dán ảnh được xử lý ở đây rồi giao lại cho App.jsx (nơi có
 * quyền truy cập Tauri fs) qua onThaAnh / onDanAnh.
 */
export default function VungSoanThao({ editor, onThaAnh, onDanAnh }) {
  const xuLyKeoTha = (suKien) => {
    const cacFile = Array.from(suKien.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
    if (cacFile.length === 0) return;
    suKien.preventDefault();
    onThaAnh?.(cacFile);
  };

  const xuLyDan = (suKien) => {
    const cacFile = Array.from(suKien.clipboardData?.files || []).filter((f) => f.type.startsWith("image/"));
    if (cacFile.length === 0) return;
    suKien.preventDefault();
    onDanAnh?.(cacFile);
  };

  return (
    <div className="vung-cuon-trang">
      <div className="trang-giay" onDrop={xuLyKeoTha} onDragOver={(sk) => sk.preventDefault()} onPaste={xuLyDan}>
        {editor && <MenuNoi editor={editor} />}
        <EditorContent editor={editor} className="khung-noi-dung-tiptap" />
      </div>
    </div>
  );
}
