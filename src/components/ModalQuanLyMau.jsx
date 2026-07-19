import React, { useState } from "react";
import { LOAI_TRUONG, taoMauRong, taoTruongMoi } from "../tien-ich/taoYaml";

const TUY_CHON_LOAI = [
  { gia_tri: LOAI_TRUONG.NHAP_NHANH_CHU, nhan: "Nhập nhanh — chữ" },
  { gia_tri: LOAI_TRUONG.NHAP_NHANH_DANH_SACH, nhan: "Nhập nhanh — danh sách" },
  { gia_tri: LOAI_TRUONG.CO_DINH, nhan: "Cố định" },
  { gia_tri: LOAI_TRUONG.TU_DONG_NGAY, nhan: "Tự động — ngày" },
  { gia_tri: LOAI_TRUONG.TU_DONG_TEN_FILE, nhan: "Tự động — tên file" },
];

/**
 * Modal quản lý toàn bộ Mẫu Front Matter: tạo/sửa/xoá mẫu, thêm/sửa/xoá
 * từng trường YAML ngay trong ứng dụng (mục III.3 đặc tả), không cần
 * sửa file cấu hình bằng tay.
 */
export default function ModalQuanLyMau({ danhSachMau, onDongModal, onLuuTatCaMau }) {
  const [dsMauNhap, datDsMauNhap] = useState(() => structuredClone(danhSachMau));
  const [idMauDangSua, datIdMauDangSua] = useState(danhSachMau[0]?.id || null);

  const mauDangSua = dsMauNhap.find((m) => m.id === idMauDangSua);

  const themMauMoi = () => {
    const mauMoi = taoMauRong("Mẫu chưa đặt tên");
    datDsMauNhap((truoc) => [...truoc, mauMoi]);
    datIdMauDangSua(mauMoi.id);
  };

  const xoaMau = (id) => {
    if (!window.confirm("Xoá mẫu này? Thao tác không thể hoàn tác sau khi lưu.")) return;
    const dsMoi = dsMauNhap.filter((m) => m.id !== id);
    datDsMauNhap(dsMoi);
    if (idMauDangSua === id) datIdMauDangSua(dsMoi[0]?.id || null);
  };

  const capNhatMau = (thayDoi) => {
    datDsMauNhap((truoc) => truoc.map((m) => (m.id === idMauDangSua ? { ...m, ...thayDoi } : m)));
  };

  const themTruong = () => {
    const truongMoi = taoTruongMoi({ khoa: "", nhan: "", loai: LOAI_TRUONG.NHAP_NHANH_CHU });
    capNhatMau({ cacTruong: [...mauDangSua.cacTruong, truongMoi] });
  };

  const capNhatTruong = (idTruong, thayDoi) => {
    capNhatMau({
      cacTruong: mauDangSua.cacTruong.map((t) => (t.id === idTruong ? { ...t, ...thayDoi } : t)),
    });
  };

  const xoaTruong = (idTruong) => {
    capNhatMau({ cacTruong: mauDangSua.cacTruong.filter((t) => t.id !== idTruong) });
  };

  const luuVaDong = () => {
    onLuuTatCaMau(dsMauNhap);
    onDongModal();
  };

  return (
    <div className="lop-phu-modal" onClick={(sk) => sk.target === sk.currentTarget && onDongModal()}>
      <div className="modal-quan-ly-mau" style={{ position: "relative" }}>
        <button className="nut-dong-modal" onClick={onDongModal}>✕</button>

        <div className="modal-quan-ly-mau__ds-mau">
          {dsMauNhap.map((mau) => (
            <div
              key={mau.id}
              className={`modal-quan-ly-mau__mau-item ${mau.id === idMauDangSua ? "dang-chon" : ""}`}
              onClick={() => datIdMauDangSua(mau.id)}
            >
              <span>{mau.ten || "(chưa đặt tên)"}</span>
              <button className="nut-xoa" onClick={(sk) => { sk.stopPropagation(); xoaMau(mau.id); }}>✕</button>
            </div>
          ))}
          <button className="nut-phu" style={{ width: "100%", marginTop: "0.5rem" }} onClick={themMauMoi}>
            + Mẫu mới
          </button>
        </div>

        <div className="modal-quan-ly-mau__noi-dung">
          {!mauDangSua ? (
            <p>Chưa có mẫu nào. Bấm "+ Mẫu mới" để bắt đầu.</p>
          ) : (
            <>
              <div className="truong-nhap">
                <label>Tên mẫu</label>
                <input spellCheck="false" type="text" value={mauDangSua.ten} onChange={(sk) => capNhatMau({ ten: sk.target.value })} />
              </div>

              <div className="phieu-front-matter__tieu-de" style={{ marginTop: "1.2rem" }}>
                <span>Các trường YAML</span>
              </div>

              {mauDangSua.cacTruong.map((truong) => (
                <div className="hang-truong" key={truong.id}>
                  <input
                    spellCheck="false"
                    placeholder="khoá (vd: title)"
                    value={truong.khoa}
                    onChange={(sk) => capNhatTruong(truong.id, { khoa: sk.target.value })}
                  />
                  <input
                    spellCheck="false"
                    placeholder="nhãn hiển thị"
                    value={truong.nhan}
                    onChange={(sk) => capNhatTruong(truong.id, { nhan: sk.target.value })}
                  />
                  <select value={truong.loai} onChange={(sk) => capNhatTruong(truong.id, { loai: sk.target.value })}>
                    {TUY_CHON_LOAI.map((tc) => (
                      <option key={tc.gia_tri} value={tc.gia_tri}>{tc.nhan}</option>
                    ))}
                  </select>
                  <input
                    spellCheck="false"
                    placeholder="giá trị mặc định"
                    value={truong.giaTriMacDinh}
                    onChange={(sk) => capNhatTruong(truong.id, { giaTriMacDinh: sk.target.value })}
                    disabled={truong.loai === LOAI_TRUONG.TU_DONG_NGAY || truong.loai === LOAI_TRUONG.TU_DONG_TEN_FILE}
                  />
                  <button className="nut-xoa" onClick={() => xoaTruong(truong.id)}>✕</button>
                </div>
              ))}

              <button className="nut-phu" onClick={themTruong}>+ Thêm trường</button>

              <div style={{ marginTop: "1.6rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button className="nut-phu" onClick={onDongModal}>Huỷ</button>
                <button className="nut-chinh" onClick={luuVaDong}>Lưu mẫu</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
