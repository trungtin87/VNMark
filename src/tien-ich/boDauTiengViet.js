// Tiện ích xử lý chuỗi tiếng Việt: bỏ dấu, sinh slug, sinh tên file tự động.

/**
 * Bỏ dấu tiếng Việt khỏi một chuỗi.
 * @param {string} chuoiCoDau
 * @returns {string} chuỗi không dấu
 */
export function boDauTiengViet(chuoiCoDau) {
  if (!chuoiCoDau) return "";
  let ketQua = chuoiCoDau.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  ketQua = ketQua.replace(/đ/g, "d").replace(/Đ/g, "D");
  return ketQua;
}

/**
 * Chuyển một chuỗi tiêu đề thành slug: chữ thường, không dấu,
 * khoảng trắng và ký tự đặc biệt thay bằng dấu gạch ngang.
 * @param {string} tieuDe
 * @returns {string} slug, ví dụ "huong-dan-su-dung-vnmark"
 */
export function taoSlugTuTieuDe(tieuDe) {
  const khongDau = boDauTiengViet(tieuDe || "").toLowerCase();
  return khongDau
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sinh tên file .md theo quy tắc: [YYYY-MM-DD]-[tieu-de-khong-dau].md
 * @param {string} tieuDe
 * @param {Date} ngay
 * @returns {string} tên file gợi ý
 */
export function taoTenFileTuDong(tieuDe, ngay = new Date()) {
  const namThangNgay = dinhDangNgayISO(ngay);
  const slug = taoSlugTuTieuDe(tieuDe) || "bai-viet-moi";
  return `${namThangNgay}-${slug}.md`;
}

/**
 * Định dạng một đối tượng Date thành chuỗi YYYY-MM-DD.
 * @param {Date} ngay
 * @returns {string}
 */
export function dinhDangNgayISO(ngay = new Date()) {
  const nam = ngay.getFullYear();
  const thang = String(ngay.getMonth() + 1).padStart(2, "0");
  const ngayTrongThang = String(ngay.getDate()).padStart(2, "0");
  return `${nam}-${thang}-${ngayTrongThang}`;
}
