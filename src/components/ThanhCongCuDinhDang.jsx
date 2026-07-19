import React from "react";

/**
 * Thanh công cụ định dạng — đúng bảng 2.1 trong đặc tả.
 * Toàn bộ thao tác gọi thẳng lệnh Tiptap qua `editor.chain()`, không
 * hiển thị ký tự Markdown thô cho người dùng.
 */
export default function ThanhCongCuDinhDang({ editor, onYeuCauChonAnh, onBatTapTrung, onMoPhieuTrenDienThoai }) {
  if (!editor) return null;

  const nutDangBat = (kiemTra) => (kiemTra ? "dang-bat" : "");

  const doiKhoiVanBan = (giaTri) => {
    if (giaTri === "doan-van") {
      editor.chain().focus().setParagraph().run();
    } else {
      const cap = Number(giaTri.replace("tieu-de-", ""));
      editor.chain().focus().toggleHeading({ level: cap }).run();
    }
  };

  const khoiDangChon = () => {
    for (let cap = 1; cap <= 6; cap++) {
      if (editor.isActive("heading", { level: cap })) return `tieu-de-${cap}`;
    }
    return "doan-van";
  };

  const chenBang = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

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
    <div className="thanh-cong-cu">
      <select className="chon-khoi-van-ban" value={khoiDangChon()} onChange={(sk) => doiKhoiVanBan(sk.target.value)}>
        <option value="doan-van">Đoạn văn</option>
        <option value="tieu-de-1">Tiêu đề 1</option>
        <option value="tieu-de-2">Tiêu đề 2</option>
        <option value="tieu-de-3">Tiêu đề 3</option>
        <option value="tieu-de-4">Tiêu đề 4</option>
        <option value="tieu-de-5">Tiêu đề 5</option>
        <option value="tieu-de-6">Tiêu đề 6</option>
      </select>

      <div className="nhom-cong-cu">
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("bold"))}`} title="Đậm (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("italic"))}`} title="Nghiêng (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("underline"))}`} title="Gạch chân (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("strike"))}`} title="Gạch ngang (Ctrl+Shift+X)" onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("code"))}`} title="Mã nội dòng (Ctrl+E)" onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</button>
      </div>

      <div className="gach-phan-cach" />

      <div className="nhom-cong-cu">
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive({ textAlign: "left" }))}`} title="Căn trái" onClick={() => editor.chain().focus().setTextAlign("left").run()}>≡←</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive({ textAlign: "center" }))}`} title="Căn giữa" onClick={() => editor.chain().focus().setTextAlign("center").run()}>≡</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive({ textAlign: "right" }))}`} title="Căn phải" onClick={() => editor.chain().focus().setTextAlign("right").run()}>→≡</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive({ textAlign: "justify" }))}`} title="Căn đều" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>☰</button>
      </div>

      <div className="gach-phan-cach" />

      <div className="nhom-cong-cu">
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("bulletList"))}`} title="Danh sách chấm (Ctrl+Shift+8)" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("orderedList"))}`} title="Danh sách số (Ctrl+Shift+7)" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("taskList"))}`} title="Việc cần làm (Ctrl+Shift+9)" onClick={() => editor.chain().focus().toggleTaskList().run()}>☐</button>
      </div>

      <div className="gach-phan-cach" />

      <div className="nhom-cong-cu">
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("blockquote"))}`} title="Trích dẫn (Ctrl+Shift+.)" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("codeBlock"))}`} title="Khối mã (Ctrl+Alt+C)" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>⌗</button>
        <button className="nut-cong-cu" title="Đường kẻ ngang (Ctrl+Shift+-)" onClick={() => editor.chain().focus().setHorizontalRule().run()}>─</button>
        <button className="nut-cong-cu" title="Chèn bảng" onClick={chenBang}>▦</button>
      </div>

      <div className="gach-phan-cach" />

      <div className="nhom-cong-cu">
        <button className={`nut-cong-cu ${nutDangBat(editor.isActive("link"))}`} title="Liên kết (Ctrl+K)" onClick={datLienKet}>🔗</button>
        <button className="nut-cong-cu" title="Hình ảnh (Ctrl+Shift+I)" onClick={onYeuCauChonAnh}>🖼</button>
      </div>

      <div className="gach-phan-cach" />

      <div className="nhom-cong-cu">
        <button className="nut-cong-cu" title="Hoàn tác (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↶</button>
        <button className="nut-cong-cu" title="Làm lại (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↷</button>
        <button className="nut-cong-cu" title="Xoá định dạng (Ctrl+\\)" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>⌫</button>
      </div>

      <div className="gach-phan-cach" />
      <button className="nut-cong-cu" title="Chế độ tập trung viết" onClick={onBatTapTrung}>⛶</button>
      <button className="nut-cong-cu nut-mo-phieu-tren-dien-thoai" title="Front Matter" onClick={onMoPhieuTrenDienThoai}>▤</button>
    </div>
  );
}
