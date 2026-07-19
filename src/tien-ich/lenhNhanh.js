import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import DanhSachLenhNhanh from "../components/DanhSachLenhNhanh.jsx";

/**
 * Danh mục lệnh nhanh: gõ "/" ở đầu dòng để mở, theo mục 2.3 đặc tả.
 * Mỗi lệnh biết cách tự chèn khối tương ứng vào editor.
 */
export function danhSachLenh() {
  return [
    {
      tieuDe: "Tiêu đề 1",
      icon: "H1",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
    },
    {
      tieuDe: "Tiêu đề 2",
      icon: "H2",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
    },
    {
      tieuDe: "Danh sách chấm",
      icon: "•",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      tieuDe: "Danh sách số",
      icon: "1.",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      tieuDe: "Việc cần làm",
      icon: "☐",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    },
    {
      tieuDe: "Bảng",
      icon: "▦",
      thucThi: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      tieuDe: "Ảnh",
      icon: "🖼",
      thucThi: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        // App.jsx lắng nghe sự kiện này để mở hộp thoại chọn ảnh thật
        window.dispatchEvent(new CustomEvent("vnmark:yeu-cau-chon-anh"));
      },
    },
    {
      tieuDe: "Trích dẫn",
      icon: "❝",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
      tieuDe: "Khối mã",
      icon: "⌗",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      tieuDe: "Đường kẻ ngang",
      icon: "─",
      thucThi: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
    },
  ];
}

export const LenhNhanh = Extension.create({
  name: "lenhNhanh",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        command: ({ editor, range, props }) => props.thucThi({ editor, range }),
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }) =>
          danhSachLenh()
            .filter((lenh) => lenh.tieuDe.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10),
        render: () => {
          let thanhPhanReact;
          let popupTippy;

          return {
            onStart: (props) => {
              thanhPhanReact = new ReactRenderer(DanhSachLenhNhanh, { props, editor: props.editor });
              if (!props.clientRect) return;
              popupTippy = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: thanhPhanReact.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props) {
              thanhPhanReact.updateProps(props);
              if (!props.clientRect) return;
              popupTippy?.[0]?.setProps({ getReferenceClientRect: props.clientRect });
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popupTippy?.[0]?.hide();
                return true;
              }
              return thanhPhanReact?.ref?.onKeyDown?.(props) ?? false;
            },
            onExit() {
              popupTippy?.[0]?.destroy();
              thanhPhanReact?.destroy();
            },
          };
        },
      }),
    ];
  },
});
