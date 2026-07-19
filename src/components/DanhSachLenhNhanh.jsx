import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

/**
 * Danh sách lệnh hiển thị khi người dùng gõ "/" đầu dòng (menu Notion-style).
 * Điều khiển bằng bàn phím: mũi tên lên/xuống để chọn, Enter để thực thi.
 */
const DanhSachLenhNhanh = forwardRef((props, ref) => {
  const [chiSoDangChon, datChiSoDangChon] = useState(0);

  useEffect(() => datChiSoDangChon(0), [props.items]);

  const chonMuc = (chiSo) => {
    const lenh = props.items[chiSo];
    if (lenh) props.command(lenh);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        datChiSoDangChon((truoc) => (truoc + props.items.length - 1) % props.items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        datChiSoDangChon((truoc) => (truoc + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        chonMuc(chiSoDangChon);
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) return null;

  return (
    <div className="menu-lenh-nhanh">
      {props.items.map((lenh, chiSo) => (
        <div
          key={lenh.tieuDe}
          className={`menu-lenh-nhanh__muc ${chiSo === chiSoDangChon ? "dang-chon" : ""}`}
          onMouseEnter={() => datChiSoDangChon(chiSo)}
          onClick={() => chonMuc(chiSo)}
        >
          <span className="menu-lenh-nhanh__icon">{lenh.icon}</span>
          <span>{lenh.tieuDe}</span>
        </div>
      ))}
    </div>
  );
});

DanhSachLenhNhanh.displayName = "DanhSachLenhNhanh";
export default DanhSachLenhNhanh;
