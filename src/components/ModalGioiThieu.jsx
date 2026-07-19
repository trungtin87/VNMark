import React from "react";
import { THONG_TIN_UNG_DUNG } from "../tien-ich/thongTinUngDung.js";

/**
 * Hộp thoại "Giới thiệu" — hiển thị thông tin ứng dụng và tác giả.
 * Nội dung lấy từ src/tien-ich/thongTinUngDung.js, sửa file đó để
 * thay bằng thông tin thật của bạn.
 */
export default function ModalGioiThieu({ onDongModal }) {
  const tt = THONG_TIN_UNG_DUNG;

  return (
    <div className="lop-phu-modal" onClick={(sk) => sk.target === sk.currentTarget && onDongModal()}>
      <div className="modal-gioi-thieu" style={{ position: "relative" }}>
        <button className="nut-dong-modal" onClick={onDongModal}>✕</button>

        <div className="modal-gioi-thieu__huy-hieu">M</div>
        <h2 className="modal-gioi-thieu__ten">{tt.ten}</h2>
        <p className="modal-gioi-thieu__khau-hieu">{tt.khauHieu}</p>

        <p className="modal-gioi-thieu__mo-ta">{tt.moTa}</p>

        <div className="modal-gioi-thieu__hang-thong-tin">
          <span>Phiên bản</span>
          <span>{tt.phienBan}</span>
        </div>
        <div className="modal-gioi-thieu__hang-thong-tin">
          <span>Tác giả</span>
          <span>{tt.tacGia}</span>
        </div>
        <div className="modal-gioi-thieu__hang-thong-tin">
          <span>Liên hệ</span>
          <span>{tt.lienHe}</span>
        </div>
        <div className="modal-gioi-thieu__hang-thong-tin">
          <span>Năm phát hành</span>
          <span>{tt.namPhatHanh}</span>
        </div>

        <p className="modal-gioi-thieu__ghi-chu">
          © {tt.namPhatHanh} {tt.tacGia}. Xây dựng bằng Tauri, React và Tiptap.
        </p>
      </div>
    </div>
  );
}
