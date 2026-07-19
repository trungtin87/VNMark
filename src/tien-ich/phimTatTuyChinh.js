import { Extension } from "@tiptap/core";

/**
 * Gom toàn bộ phím tắt định dạng của bảng 2.1 vào một chỗ, tránh xung đột
 * hoặc chồng lấn với phím tắt mặc định của từng extension StarterKit.
 */
export const PhimTatTuyChinh = Extension.create({
  name: "phimTatTuyChinh",

  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.chain().focus().toggleCode().run(),
      "Mod-Shift-x": () => this.editor.chain().focus().toggleStrike().run(),
      "Mod-Shift-8": () => this.editor.chain().focus().toggleBulletList().run(),
      "Mod-Shift-7": () => this.editor.chain().focus().toggleOrderedList().run(),
      "Mod-Shift-9": () => this.editor.chain().focus().toggleTaskList().run(),
      "Mod-Shift-.": () => this.editor.chain().focus().toggleBlockquote().run(),
      "Mod-Alt-c": () => this.editor.chain().focus().toggleCodeBlock().run(),
      "Mod-Shift--": () => this.editor.chain().focus().setHorizontalRule().run(),
      "Mod-\\": () => this.editor.chain().focus().clearNodes().unsetAllMarks().run(),
      "Mod-Alt-1": () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      "Mod-Alt-2": () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      "Mod-Alt-3": () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      "Mod-Alt-4": () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
      "Mod-Alt-5": () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
      "Mod-Alt-6": () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
    };
  },
});
