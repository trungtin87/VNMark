import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import ThanhCongCuDinhDang from "./components/ThanhCongCuDinhDang.jsx";
import VungSoanThao from "./components/VungSoanThao.jsx";
import PhieuFrontMatter from "./components/PhieuFrontMatter.jsx";
import ModalQuanLyMau from "./components/ModalQuanLyMau.jsx";
import ModalGioiThieu from "./components/ModalGioiThieu.jsx";

import AnhTuyChinh from "./tien-ich/anhTuyChinh.js";
import { LenhNhanh } from "./tien-ich/lenhNhanh.js";
import { PhimTatTuyChinh } from "./tien-ich/phimTatTuyChinh.js";
import { markdownSangHtml, htmlSangMarkdown, tachFrontMatter, ghepFileMarkdown } from "./tien-ich/chuyenDoiMarkdown.js";
import { sinhKhoiYaml, timMauKhopVoiFrontMatter, taoMauRong, taoTruongMoi, LOAI_TRUONG } from "./tien-ich/taoYaml.js";
import { taoTenFileTuDong } from "./tien-ich/boDauTiengViet.js";
import { taoMauMacDinh } from "./tien-ich/mauMacDinh.js";
import {
  moFileMd,
  ghiDeFile,
  luuFileMoi,
  luuAnhVaoAssets,
  duongDanHienThiAnh,
  taiCauHinhMau,
  luuCauHinhMau,
} from "./tien-ich/cauNoiTauri.js";

export default function App() {
  const [danhSachMau, datDanhSachMau] = useState([]);
  const [idMauDangChon, datIdMauDangChon] = useState(null);
  const [giaTriCacTruong, datGiaTriCacTruong] = useState({});
  const [duongDanFile, datDuongDanFile] = useState(null);
  const [coThayDoiChuaLuu, datCoThayDoiChuaLuu] = useState(false);
  const [moModalMau, datMoModalMau] = useState(false);
  const [moModalGioiThieu, datMoModalGioiThieu] = useState(false);
  const [cheDoTapTrung, datCheDoTapTrung] = useState(false);
  const [phieuMoTrenDienThoai, datPhieuMoTrenDienThoai] = useState(false);
  const [thongBao, datThongBao] = useState(null);
  const [dangTai, datDangTai] = useState(true);

  const mauDangChon = useMemo(() => danhSachMau.find((m) => m.id === idMauDangChon) || null, [danhSachMau, idMauDangChon]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Viết điều gì đó tuyệt vời... gõ “/” để chèn khối nhanh" }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      AnhTuyChinh,
      LenhNhanh,
      PhimTatTuyChinh,
    ],
    content: "<p></p>",
    // Tắt gạch chân đỏ kiểm tra chính tả của trình duyệt: đây là trình
    // soạn Markdown đa ngôn ngữ, gạch đỏ chính tả tiếng Anh mặc định của
    // trình duyệt chỉ gây nhiễu chứ không hữu ích.
    editorProps: {
      attributes: {
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
      },
    },
    onUpdate: () => datCoThayDoiChuaLuu(true),
  });

  // ---------- Nạp cấu hình mẫu Front Matter lúc khởi động ----------
  useEffect(() => {
    let daXongChuaLoi = false;

    (async () => {
      try {
        let ds = await taiCauHinhMau();
        if (!ds || ds.length === 0) {
          ds = taoMauMacDinh();
          await luuCauHinhMau(ds);
        }
        datDanhSachMau(ds);
        datIdMauDangChon(ds[0]?.id || null);
      } catch (loi) {
        // Không để một lỗi khi đọc cấu hình (vd plugin store gặp trục trặc)
        // khiến toàn bộ ứng dụng treo ở màn hình trắng mãi mãi — dùng tạm
        // 3 mẫu mặc định trong bộ nhớ để người dùng vẫn viết được ngay.
        console.error("VNMark — lỗi khi nạp cấu hình mẫu, dùng mẫu mặc định tạm thời:", loi);
        const dsMacDinh = taoMauMacDinh();
        datDanhSachMau(dsMacDinh);
        datIdMauDangChon(dsMacDinh[0]?.id || null);
      } finally {
        daXongChuaLoi = true;
        datDangTai(false);
      }
    })();

    // Dự phòng cuối cùng: nếu vì lý do gì đó promise trên không bao giờ
    // settle (ví dụ lệnh gọi Tauri bị treo thay vì lỗi ngay), vẫn ép hiện
    // giao diện sau 4 giây thay vì trắng màn hình vĩnh viễn.
    const henGioDuPhong = setTimeout(() => {
      if (!daXongChuaLoi) {
        console.warn("VNMark — nạp cấu hình mẫu quá lâu, hiển thị giao diện với mẫu mặc định.");
        const dsDuPhong = taoMauMacDinh();
        datDanhSachMau((truoc) => (truoc.length ? truoc : dsDuPhong));
        datIdMauDangChon((truoc) => truoc || dsDuPhong[0]?.id || null);
        datDangTai(false);
      }
    }, 4000);

    return () => clearTimeout(henGioDuPhong);
  }, []);

  const hienThiThongBao = useCallback((noiDung) => {
    datThongBao(noiDung);
    setTimeout(() => datThongBao(null), 2800);
  }, []);

  // ---------- Tiêu đề bài viết hiện tại (dùng để sinh slug/tên file) ----------
  const truongTieuDe = mauDangChon?.cacTruong.find((t) => t.khoa === "title");
  const tieuDeBaiViet = truongTieuDe ? giaTriCacTruong[truongTieuDe.id] || "" : "";

  // ---------- Mở file ----------
  const xacNhanBoQuaThayDoi = () => !coThayDoiChuaLuu || window.confirm("Tài liệu có thay đổi chưa lưu. Vẫn tiếp tục?");

  const moFile = useCallback(async () => {
    if (!xacNhanBoQuaThayDoi()) return;
    try {
      const ketQua = await moFileMd();
      if (!ketQua || !editor) return;
      const { duongDan, noiDung } = ketQua;

      if (typeof noiDung !== "string") {
        throw new Error("Nội dung file đọc được không phải văn bản (có thể file bị hỏng hoặc không phải .md).");
      }

      const { duLieuYaml, noiDungMarkdown } = tachFrontMatter(noiDung);

      editor.commands.setContent(markdownSangHtml(noiDungMarkdown));
      await phanGiaiTatCaAnh(editor, duongDan);

      const mauKhop = timMauKhopVoiFrontMatter(duLieuYaml, danhSachMau);
      if (mauKhop) {
        datIdMauDangChon(mauKhop.id);
        const giaTriMoi = {};
        for (const truong of mauKhop.cacTruong) {
          const giaTriDoc = duLieuYaml[truong.khoa];
          giaTriMoi[truong.id] = Array.isArray(giaTriDoc) ? giaTriDoc.join(", ") : giaTriDoc ?? truong.giaTriMacDinh;
        }
        datGiaTriCacTruong(giaTriMoi);
      } else if (Object.keys(duLieuYaml).length > 0) {
        const taoMoi = window.confirm(
          "Không tìm thấy mẫu Front Matter khớp với file này. Tạo mẫu mới từ chính file đang mở?"
        );
        if (taoMoi) {
          const mauMoi = taoMauRong(`Mẫu từ ${duongDan.split(/[/\\]/).pop()}`);
          const giaTriMoi = {};
          for (const [khoa, giaTri] of Object.entries(duLieuYaml)) {
            const truongMoi = taoTruongMoi({
              khoa,
              nhan: khoa,
              loai: Array.isArray(giaTri) ? LOAI_TRUONG.NHAP_NHANH_DANH_SACH : LOAI_TRUONG.NHAP_NHANH_CHU,
            });
            mauMoi.cacTruong.push(truongMoi);
            giaTriMoi[truongMoi.id] = Array.isArray(giaTri) ? giaTri.join(", ") : String(giaTri ?? "");
          }
          const dsMoi = [...danhSachMau, mauMoi];
          datDanhSachMau(dsMoi);
          await luuCauHinhMau(dsMoi);
          datIdMauDangChon(mauMoi.id);
          datGiaTriCacTruong(giaTriMoi);
        }
      }

      datDuongDanFile(duongDan);
      datCoThayDoiChuaLuu(false);
      hienThiThongBao(`Đã mở: ${duongDan.split(/[/\\]/).pop()}`);
    } catch (loi) {
      console.error("VNMark — lỗi khi mở file:", loi);
      window.alert(
        `Không mở được file.\n\nChi tiết lỗi: ${loi?.message || loi}\n\n` +
          "Nguyên nhân thường gặp: thiếu quyền đọc file trong capabilities/default.json (bản Tauri), " +
          "hoặc file không đúng định dạng văn bản UTF-8."
      );
    }
  }, [editor, danhSachMau, hienThiThongBao]);

  // ---------- Lưu file ----------
  const sinhNoiDungFileHoanChinh = useCallback(() => {
    const khoiYaml = mauDangChon ? sinhKhoiYaml(mauDangChon, giaTriCacTruong, { tieuDe: tieuDeBaiViet, ngay: new Date() }) : "---\n---\n";
    const markdown = htmlSangMarkdown(editor?.getHTML() || "");
    return ghepFileMarkdown(khoiYaml, markdown);
  }, [editor, mauDangChon, giaTriCacTruong, tieuDeBaiViet]);

  const luuFile = useCallback(async () => {
    if (!editor) return;
    try {
      const noiDung = sinhNoiDungFileHoanChinh();
      if (duongDanFile) {
        await ghiDeFile(duongDanFile, noiDung);
        hienThiThongBao(`Đã lưu: ${duongDanFile.split(/[/\\]/).pop()}`);
      } else {
        const tenGoiY = taoTenFileTuDong(tieuDeBaiViet || "bai-viet-moi");
        const duongDanMoi = await luuFileMoi(noiDung, tenGoiY);
        if (duongDanMoi) {
          datDuongDanFile(duongDanMoi);
          hienThiThongBao(`Đã lưu: ${tenGoiY}`);
        }
      }
      datCoThayDoiChuaLuu(false);
    } catch (loi) {
      console.error("VNMark — lỗi khi lưu file:", loi);
      window.alert(`Không lưu được file.\n\nChi tiết lỗi: ${loi?.message || loi}`);
    }
  }, [editor, duongDanFile, sinhNoiDungFileHoanChinh, tieuDeBaiViet, hienThiThongBao]);

  const luuFileThanh = useCallback(async () => {
    if (!editor) return;
    try {
      const noiDung = sinhNoiDungFileHoanChinh();
      const tenGoiY = taoTenFileTuDong(tieuDeBaiViet || "bai-viet-moi");
      const duongDanMoi = await luuFileMoi(noiDung, tenGoiY);
      if (duongDanMoi) {
        datDuongDanFile(duongDanMoi);
        datCoThayDoiChuaLuu(false);
        hienThiThongBao(`Đã lưu: ${tenGoiY}`);
      }
    } catch (loi) {
      console.error("VNMark — lỗi khi lưu file:", loi);
      window.alert(`Không lưu được file.\n\nChi tiết lỗi: ${loi?.message || loi}`);
    }
  }, [editor, sinhNoiDungFileHoanChinh, tieuDeBaiViet, hienThiThongBao]);

  // ---------- Chèn ảnh ----------
  const chenAnh = useCallback(
    async (danhSachFile) => {
      if (!editor || !danhSachFile?.length) return;
      if (!duongDanFile) {
        hienThiThongBao("Mẹo: lưu file trước để ảnh được sao chép đúng vào thư mục assets/");
      }
      for (const file of danhSachFile) {
        try {
          const { duongDanTuongDoi, urlHienThi } = await luuAnhVaoAssets(duongDanFile, file);
          editor
            .chain()
            .focus()
            .insertContent({
              type: "image",
              attrs: { src: urlHienThi, duongDanTuongDoi, alt: file.name.replace(/\.[^.]+$/, "") },
            })
            .run();
        } catch (loi) {
          console.error("VNMark — lỗi khi chèn ảnh:", loi);
          window.alert(`Không chèn được ảnh "${file.name}".\n\nChi tiết lỗi: ${loi?.message || loi}`);
        }
      }
    },
    [editor, duongDanFile, hienThiThongBao]
  );

  const moHopThoaiChonAnh = useCallback(() => {
    const oInput = document.createElement("input");
    oInput.type = "file";
    oInput.accept = "image/*";
    oInput.multiple = true;
    oInput.onchange = () => chenAnh(Array.from(oInput.files || []));
    oInput.click();
  }, [chenAnh]);

  useEffect(() => {
    const trinhXuLy = () => moHopThoaiChonAnh();
    window.addEventListener("vnmark:yeu-cau-chon-anh", trinhXuLy);
    return () => window.removeEventListener("vnmark:yeu-cau-chon-anh", trinhXuLy);
  }, [moHopThoaiChonAnh]);

  // ---------- Phím tắt cấp ứng dụng: mở / lưu / lưu thành / chèn ảnh ----------
  useEffect(() => {
    const xuLyPhimTat = (suKien) => {
      const phimDieuKhien = suKien.ctrlKey || suKien.metaKey;
      if (!phimDieuKhien) return;
      if (suKien.key.toLowerCase() === "o") {
        suKien.preventDefault();
        moFile();
      } else if (suKien.shiftKey && suKien.key.toLowerCase() === "s") {
        suKien.preventDefault();
        luuFileThanh();
      } else if (suKien.key.toLowerCase() === "s") {
        suKien.preventDefault();
        luuFile();
      } else if (suKien.shiftKey && suKien.key.toLowerCase() === "i") {
        suKien.preventDefault();
        moHopThoaiChonAnh();
      }
    };
    window.addEventListener("keydown", xuLyPhimTat);
    return () => window.removeEventListener("keydown", xuLyPhimTat);
  }, [moFile, luuFile, luuFileThanh, moHopThoaiChonAnh]);

  // Cảnh báo khi đóng cửa sổ nếu còn thay đổi chưa lưu
  useEffect(() => {
    const truocKhiDong = (sk) => {
      if (coThayDoiChuaLuu) {
        sk.preventDefault();
        sk.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", truocKhiDong);
    return () => window.removeEventListener("beforeunload", truocKhiDong);
  }, [coThayDoiChuaLuu]);

  // ---------- Quản lý mẫu ----------
  const luuTatCaMau = async (dsMoi) => {
    datDanhSachMau(dsMoi);
    await luuCauHinhMau(dsMoi);
    if (!dsMoi.find((m) => m.id === idMauDangChon)) {
      datIdMauDangChon(dsMoi[0]?.id || null);
      datGiaTriCacTruong({});
    }
  };

  const doiMauDangChon = (id) => {
    datIdMauDangChon(id);
    datGiaTriCacTruong({});
  };

  const doiGiaTriTruong = (truongId, giaTri) => {
    datGiaTriCacTruong((truoc) => ({ ...truoc, [truongId]: giaTri }));
    datCoThayDoiChuaLuu(true);
  };

  const taiLieuMoi = () => {
    if (!xacNhanBoQuaThayDoi()) return;
    editor?.commands.setContent("<p></p>");
    datDuongDanFile(null);
    datGiaTriCacTruong({});
    datCoThayDoiChuaLuu(false);
  };

  if (dangTai) return null;

  return (
    <div className={`khung-ung-dung ${cheDoTapTrung ? "che-do-tap-trung" : ""}`}>
      {cheDoTapTrung && (
        <button className="nut-phu nut-thoat-tap-trung" onClick={() => datCheDoTapTrung(false)}>
          Thoát chế độ tập trung
        </button>
      )}

      <header className="thanh-tieu-de">
        <div className="thanh-tieu-de__logo">
          VNMark <small>Trình soạn thảo văn bản Markdown dành cho người VIỆT NAM</small>
        </div>
        <div className="thanh-tieu-de__ten-file">
          {coThayDoiChuaLuu && <span className="cham-chua-luu">•</span>}
          {duongDanFile ? duongDanFile.split(/[/\\]/).pop() : "Tài liệu chưa đặt tên"}
        </div>
        <div className="thanh-tieu-de__nut-nhom">
          <button className="nut-phu" onClick={() => datMoModalGioiThieu(true)} title="Giới thiệu ứng dụng">ℹ</button>
          <button className="nut-phu" onClick={taiLieuMoi}>Mới</button>
          <button className="nut-phu" onClick={moFile}>Mở file</button>
          <button className="nut-phu" onClick={luuFileThanh}>Lưu thành</button>
          <button className="nut-chinh" onClick={luuFile}>Lưu</button>
        </div>
      </header>

      <div className="than-ung-dung">
        <div className="cot-soan-thao">
          <ThanhCongCuDinhDang
            editor={editor}
            onYeuCauChonAnh={moHopThoaiChonAnh}
            onBatTapTrung={() => datCheDoTapTrung(true)}
            onMoPhieuTrenDienThoai={() => datPhieuMoTrenDienThoai(true)}
          />
          <VungSoanThao editor={editor} onThaAnh={chenAnh} onDanAnh={chenAnh} />
        </div>

        {!cheDoTapTrung && (
          <PhieuFrontMatter
            className={phieuMoTrenDienThoai ? "hien-tren-dien-thoai" : ""}
            danhSachMau={danhSachMau}
            mauDangChon={mauDangChon}
            onChonMau={doiMauDangChon}
            giaTriCacTruong={giaTriCacTruong}
            onDoiGiaTri={doiGiaTriTruong}
            tieuDeBaiViet={tieuDeBaiViet}
            onMoQuanLyMau={() => datMoModalMau(true)}
            onDongTrenDienThoai={() => datPhieuMoTrenDienThoai(false)}
          />
        )}
      </div>

      {moModalMau && (
        <ModalQuanLyMau danhSachMau={danhSachMau} onDongModal={() => datMoModalMau(false)} onLuuTatCaMau={luuTatCaMau} />
      )}

      {moModalGioiThieu && <ModalGioiThieu onDongModal={() => datMoModalGioiThieu(false)} />}

      {thongBao && (
        <div style={{ position: "fixed", bottom: "1.2rem", right: "1.2rem", background: "var(--mau-muc)", color: "#fff", padding: "0.6rem 1rem", borderRadius: "8px", fontSize: "0.85rem", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>
          {thongBao}
        </div>
      )}
    </div>
  );
}

/** Quy đổi mọi ảnh có đường dẫn tương đối (mở từ file cũ) sang URL hiển thị được. */
async function phanGiaiTatCaAnh(editor, duongDanFileMd) {
  const viTriCanCapNhat = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "image" && node.attrs.duongDanTuongDoi && node.attrs.src?.startsWith("assets/")) {
      viTriCanCapNhat.push({ pos, duongDanTuongDoi: node.attrs.duongDanTuongDoi });
    }
  });
  for (const { pos, duongDanTuongDoi } of viTriCanCapNhat) {
    const srcHienThi = await duongDanHienThiAnh(duongDanFileMd, duongDanTuongDoi);
    editor.chain().command(({ tr }) => {
      tr.setNodeAttribute(pos, "src", srcHienThi);
      return true;
    }).run();
  }
}
