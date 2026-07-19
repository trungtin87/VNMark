import yaml from "js-yaml";
import { dinhDangNgayISO, taoSlugTuTieuDe } from "./boDauTiengViet";

// Các loại trường mà một Mẫu Front Matter có thể có, theo đúng mục III.3 đặc tả.
export const LOAI_TRUONG = {
  CO_DINH: "co_dinh", // giá trị không đổi, vd layout: post
  TU_DONG_NGAY: "tu_dong_ngay", // lấy ngày hệ thống lúc lưu
  TU_DONG_TEN_FILE: "tu_dong_ten_file", // sinh từ Tiêu đề
  NHAP_NHANH_CHU: "nhap_nhanh_chu", // vd title
  NHAP_NHANH_DANH_SACH: "nhap_nhanh_danh_sach", // vd tags, categories
};

/**
 * Tạo một mẫu (template) Front Matter rỗng.
 * @param {string} ten
 * @returns {{id:string, ten:string, cacTruong:Array}}
 */
export function taoMauRong(ten = "Mẫu mới") {
  return {
    id: `mau_${Date.now()}`,
    ten,
    cacTruong: [],
  };
}

/**
 * Tạo một trường mới cho mẫu.
 */
export function taoTruongMoi({ khoa = "", nhan = "", loai = LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh = "" } = {}) {
  return { id: `truong_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, khoa, nhan, loai, giaTriMacDinh };
}

/**
 * Từ giá trị người dùng nhập trong Phiếu Front Matter, sinh ra một đối tượng
 * JS thuần (khoá -> giá trị) đúng thứ tự trường của mẫu, sẵn sàng để yaml.dump.
 *
 * @param {object} mau mẫu Front Matter đang chọn
 * @param {object} giaTriCacTruong { [truongId]: giá trị nhập tay }
 * @param {{tieuDe?:string, ngay?:Date}} ngữCanh
 */
export function xayDoiTuongYaml(mau, giaTriCacTruong = {}, ngucanh = {}) {
  const doiTuong = {};
  const ngay = ngucanh.ngay || new Date();

  for (const truong of mau.cacTruong) {
    if (!truong.khoa) continue;
    switch (truong.loai) {
      case LOAI_TRUONG.CO_DINH:
        doiTuong[truong.khoa] = truong.giaTriMacDinh;
        break;
      case LOAI_TRUONG.TU_DONG_NGAY:
        doiTuong[truong.khoa] = dinhDangNgayISO(ngay);
        break;
      case LOAI_TRUONG.TU_DONG_TEN_FILE:
        doiTuong[truong.khoa] = taoSlugTuTieuDe(ngucanh.tieuDe || "");
        break;
      case LOAI_TRUONG.NHAP_NHANH_DANH_SACH: {
        const chuoiNhap = giaTriCacTruong[truong.id] ?? truong.giaTriMacDinh ?? "";
        doiTuong[truong.khoa] = chuoiNhap
          .split(",")
          .map((phanTu) => phanTu.trim())
          .filter(Boolean);
        break;
      }
      case LOAI_TRUONG.NHAP_NHANH_CHU:
      default:
        doiTuong[truong.khoa] = giaTriCacTruong[truong.id] ?? truong.giaTriMacDinh ?? "";
        break;
    }
  }
  return doiTuong;
}

/**
 * Sinh chuỗi YAML hoàn chỉnh (kèm --- hai đầu) từ mẫu và giá trị đã nhập.
 * @returns {string}
 */
export function sinhKhoiYaml(mau, giaTriCacTruong, ngucanh) {
  const doiTuong = xayDoiTuongYaml(mau, giaTriCacTruong, ngucanh);
  const noiDungYaml = yaml.dump(doiTuong, { lineWidth: -1, quotingType: '"' });
  return `---\n${noiDungYaml}---\n`;
}

/**
 * Từ một đối tượng Front Matter đã đọc được (bằng gray-matter) và danh sách
 * mẫu đang có, cố gắng tìm mẫu khớp nhất (khớp toàn bộ tập khoá YAML).
 * @returns {object|null} mẫu khớp, hoặc null nếu không khớp mẫu nào
 */
export function timMauKhopVoiFrontMatter(frontMatterData, danhSachMau) {
  const khoaDocDuoc = Object.keys(frontMatterData || {}).sort().join(",");
  if (!khoaDocDuoc) return null;
  return (
    danhSachMau.find((mau) => {
      const khoaCuaMau = mau.cacTruong.map((t) => t.khoa).filter(Boolean).sort().join(",");
      return khoaCuaMau === khoaDocDuoc;
    }) || null
  );
}
