// Lớp bọc (wrapper) toàn bộ tương tác với lõi hệ thống Tauri: hộp thoại mở/lưu
// file gốc hệ điều hành, đọc/ghi file thật, và lưu trữ cấu hình mẫu bền vững.
// Khi chạy bằng `npm run dev` (không có tiến trình Rust), tự động chuyển sang
// chế độ mô phỏng trên trình duyệt để vẫn kiểm thử được giao diện.

const dangChayTrongTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

async function napPluginDialog() {
  return import("@tauri-apps/plugin-dialog");
}
async function napPluginFs() {
  return import("@tauri-apps/plugin-fs");
}
async function napPluginStore() {
  return import("@tauri-apps/plugin-store");
}

/**
 * Mở hộp thoại chọn file .md/.markdown và trả về { duongDan, noiDung } hoặc null nếu huỷ.
 */
export async function moFileMd() {
  if (!dangChayTrongTauri()) {
    return moFileQuaTrinhDuyet();
  }
  const { open } = await napPluginDialog();
  const { readTextFile } = await napPluginFs();
  const duongDan = await open({
    multiple: false,
    filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
  });
  if (!duongDan) return null;
  const noiDung = await readTextFile(duongDan);
  return { duongDan, noiDung };
}

/** Ghi đè nội dung vào một đường dẫn đã biết (Ctrl+S trên file đang mở). */
export async function ghiDeFile(duongDan, noiDung) {
  if (!dangChayTrongTauri()) return taiXuongQuaTrinhDuyet(noiDung, duongDan.split("/").pop());
  const { writeTextFile } = await napPluginFs();
  await writeTextFile(duongDan, noiDung);
}

/** Mở hộp thoại "Lưu thành", trả về đường dẫn đã lưu hoặc null nếu huỷ. */
export async function luuFileMoi(noiDung, tenGoiY) {
  if (!dangChayTrongTauri()) {
    taiXuongQuaTrinhDuyet(noiDung, tenGoiY);
    return tenGoiY;
  }
  const { save } = await napPluginDialog();
  const { writeTextFile } = await napPluginFs();
  const duongDan = await save({
    defaultPath: tenGoiY,
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });
  if (!duongDan) return null;
  await writeTextFile(duongDan, noiDung);
  return duongDan;
}

/**
 * Sao chép một file ảnh (từ input/kéo-thả/clipboard) vào thư mục con
 * `assets/` cạnh file .md đang mở, trả về đường dẫn TƯƠNG ĐỐI để chèn vào
 * Markdown, vd "assets/anh-minh-hoa.png".
 * @param {string|null} duongDanFileMd đường dẫn file .md hiện tại (null nếu tài liệu chưa lưu lần nào)
 * @param {File} fileAnh
 */
export async function luuAnhVaoAssets(duongDanFileMd, fileAnh) {
  const tenAnh = `${Date.now()}-${fileAnh.name.replace(/\s+/g, "-")}`;
  if (!dangChayTrongTauri() || !duongDanFileMd) {
    // Chưa lưu file .md lần nào (hoặc đang ở chế độ mô phỏng trình duyệt):
    // dùng ảnh dạng data URL tạm để vẫn xem trước được, sẽ nhắc lưu file trước khi chèn ảnh thật.
    const dataUrl = await docFileThanhDataUrl(fileAnh);
    return { duongDanTuongDoi: `assets/${tenAnh}`, urlHienThi: dataUrl, laTamThoi: true };
  }
  const { mkdir, writeFile } = await napPluginFs();
  const { dirname, join } = await import("@tauri-apps/api/path");
  const { convertFileSrc } = await import("@tauri-apps/api/core");
  const thuMucGoc = await dirname(duongDanFileMd);
  const thuMucAssets = await join(thuMucGoc, "assets");
  await mkdir(thuMucAssets, { recursive: true }).catch(() => {});
  const duongDanDayDu = await join(thuMucAssets, tenAnh);
  const bytes = new Uint8Array(await fileAnh.arrayBuffer());
  await writeFile(duongDanDayDu, bytes);
  return { duongDanTuongDoi: `assets/${tenAnh}`, urlHienThi: convertFileSrc(duongDanDayDu), laTamThoi: false };
}

/**
 * Khi mở lại một file .md có sẵn, ảnh trong Markdown chỉ có đường dẫn
 * tương đối (vd "assets/anh.png"). Hàm này quy đổi thành URL webview có
 * thể tải được (asset://) dựa trên đường dẫn của file .md đang mở.
 */
export async function duongDanHienThiAnh(duongDanFileMd, duongDanTuongDoi) {
  if (!dangChayTrongTauri() || !duongDanFileMd) return duongDanTuongDoi;
  const { dirname, join } = await import("@tauri-apps/api/path");
  const { convertFileSrc } = await import("@tauri-apps/api/core");
  const thuMucGoc = await dirname(duongDanFileMd);
  const duongDanTuyetDoi = await join(thuMucGoc, duongDanTuongDoi);
  return convertFileSrc(duongDanTuyetDoi);
}

/** Đọc toàn bộ mẫu Front Matter đã lưu bền vững (Tauri plugin `store`). */
export async function taiCauHinhMau() {
  if (!dangChayTrongTauri()) {
    const chuoiLuu = window.localStorage.getItem("vnmark:mau");
    return chuoiLuu ? JSON.parse(chuoiLuu) : null;
  }
  const { load } = await napPluginStore();
  const kho = await load("cau-hinh-mau.json", { autoSave: true });
  return (await kho.get("danhSachMau")) || null;
}

/** Ghi đè toàn bộ danh sách mẫu Front Matter. */
export async function luuCauHinhMau(danhSachMau) {
  if (!dangChayTrongTauri()) {
    window.localStorage.setItem("vnmark:mau", JSON.stringify(danhSachMau));
    return;
  }
  const { load } = await napPluginStore();
  const kho = await load("cau-hinh-mau.json", { autoSave: true });
  await kho.set("danhSachMau", danhSachMau);
  await kho.save();
}

// ---------- Mô phỏng trên trình duyệt thường (chỉ dùng khi `npm run dev`) ----------

function moFileQuaTrinhDuyet() {
  return new Promise((giaiQuyet, tuChoi) => {
    const oInput = document.createElement("input");
    oInput.type = "file";
    oInput.accept = ".md,.markdown,text/markdown,text/plain";
    // Ẩn nhưng vẫn gắn vào DOM: một số trình duyệt (đặc biệt Firefox/Safari
    // cũ) không mở được hộp thoại chọn file nếu input chưa từng được gắn
    // vào cây DOM trước khi gọi .click().
    oInput.style.display = "none";
    document.body.appendChild(oInput);

    const donDep = () => oInput.remove();

    oInput.onchange = async () => {
      try {
        const file = oInput.files?.[0];
        if (!file) return giaiQuyet(null);
        const noiDung = await file.text();
        giaiQuyet({ duongDan: file.name, noiDung });
      } catch (loi) {
        tuChoi(loi);
      } finally {
        donDep();
      }
    };
    // Nếu người dùng bấm Huỷ, hầu hết trình duyệt hiện đại bắn sự kiện
    // "cancel" trên input; ta coi như không chọn file nào (trả về null).
    oInput.oncancel = () => {
      donDep();
      giaiQuyet(null);
    };
    oInput.click();
  });
}

function taiXuongQuaTrinhDuyet(noiDung, tenFile) {
  const blob = new Blob([noiDung], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const the_a = document.createElement("a");
  the_a.href = url;
  the_a.download = tenFile || "bai-viet.md";
  the_a.click();
  URL.revokeObjectURL(url);
}

function docFileThanhDataUrl(file) {
  return new Promise((giaiQuyet, tuChoi) => {
    const doc = new FileReader();
    doc.onload = () => giaiQuyet(String(doc.result));
    doc.onerror = tuChoi;
    doc.readAsDataURL(file);
  });
}

export { dangChayTrongTauri };
