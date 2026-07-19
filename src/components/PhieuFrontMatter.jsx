import React from "react";
import { LOAI_TRUONG } from "../tien-ich/taoYaml";
import { dinhDangNgayISO, taoSlugTuTieuDe } from "../tien-ich/boDauTiengViet";

const NHAN_LOAI_TRUONG = {
  [LOAI_TRUONG.CO_DINH]: "cố định",
  [LOAI_TRUONG.TU_DONG_NGAY]: "tự động · ngày",
  [LOAI_TRUONG.TU_DONG_TEN_FILE]: "tự động · từ tiêu đề",
  [LOAI_TRUONG.NHAP_NHANH_CHU]: "chữ",
  [LOAI_TRUONG.NHAP_NHANH_DANH_SACH]: "danh sách",
};

/**
 * Phiếu nhập Front Matter hiển thị bên phải trang giấy (mục III.3).
 * @param {object[]} danhSachMau tất cả mẫu đã lưu
 * @param {object} mauDangChon mẫu hiện tại
 * @param {(id:string)=>void} onChonMau
 * @param {object} giaTriCacTruong { [truongId]: string }
 * @param {(truongId:string, giaTri:string)=>void} onDoiGiaTri
 * @param {string} tieuDeBaiViet dùng để hiển thị giá trị xem trước cho trường tự động
 */
export default function PhieuFrontMatter({
  danhSachMau,
  mauDangChon,
  onChonMau,
  giaTriCacTruong,
  onDoiGiaTri,
  tieuDeBaiViet,
  onMoQuanLyMau,
  onDongTrenDienThoai,
  className = "",
}) {
  const giaTriXemTruoc = (truong) => {
    switch (truong.loai) {
      case LOAI_TRUONG.CO_DINH:
        return truong.giaTriMacDinh;
      case LOAI_TRUONG.TU_DONG_NGAY:
        return dinhDangNgayISO(new Date());
      case LOAI_TRUONG.TU_DONG_TEN_FILE:
        return taoSlugTuTieuDe(tieuDeBaiViet || "") || "(sinh từ tiêu đề)";
      default:
        return null;
    }
  };

  return (
    <aside className={`phieu-front-matter ${className}`}>
      <button className="nut-phu nut-dong-phieu-tren-dien-thoai" onClick={onDongTrenDienThoai}>✕ Đóng</button>
      <div className="phieu-front-matter__tieu-de">
        <span>Front Matter</span>
        <button className="nut-phu" style={{ padding: "0.15rem 0.5rem", fontSize: "0.7rem" }} onClick={onMoQuanLyMau}>
          Quản lý mẫu
        </button>
      </div>

      <select className="chon-mau" value={mauDangChon?.id || ""} onChange={(sk) => onChonMau(sk.target.value)}>
        {danhSachMau.length === 0 && <option value="">Chưa có mẫu nào</option>}
        {danhSachMau.map((mau) => (
          <option key={mau.id} value={mau.id}>
            {mau.ten}
          </option>
        ))}
      </select>

      {mauDangChon?.cacTruong.map((truong) => {
        const laTuDong = truong.loai === LOAI_TRUONG.CO_DINH || truong.loai === LOAI_TRUONG.TU_DONG_NGAY || truong.loai === LOAI_TRUONG.TU_DONG_TEN_FILE;
        return (
          <div className={`truong-nhap ${laTuDong ? "truong-nhap--tu-dong" : ""}`} key={truong.id}>
            <label>
              {truong.nhan || truong.khoa}
              <span className="truong-nhap__the-loai">({NHAN_LOAI_TRUONG[truong.loai]})</span>
            </label>
            {laTuDong ? (
              <input spellCheck="false" type="text" value={giaTriXemTruoc(truong)} disabled readOnly />
            ) : truong.loai === LOAI_TRUONG.NHAP_NHANH_DANH_SACH ? (
              <input
                spellCheck="false"
                type="text"
                placeholder="vd: react, tauri, markdown"
                value={giaTriCacTruong[truong.id] ?? truong.giaTriMacDinh ?? ""}
                onChange={(sk) => onDoiGiaTri(truong.id, sk.target.value)}
              />
            ) : (
              <input
                spellCheck="false"
                type="text"
                value={giaTriCacTruong[truong.id] ?? truong.giaTriMacDinh ?? ""}
                onChange={(sk) => onDoiGiaTri(truong.id, sk.target.value)}
              />
            )}
          </div>
        );
      })}

      {!mauDangChon && (
        <p style={{ fontSize: "0.8rem", color: "var(--mau-muc-nhat)" }}>
          Chọn hoặc tạo một mẫu Front Matter trong "Quản lý mẫu" để bắt đầu.
        </p>
      )}
    </aside>
  );
}
