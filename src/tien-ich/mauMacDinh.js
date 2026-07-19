import { LOAI_TRUONG } from "./taoYaml";

/** 3 mẫu dựng sẵn theo mục III.3 đặc tả — người dùng có thể sửa/xoá tự do. */
export function taoMauMacDinh() {
  return [
    {
      id: "mau_blog",
      ten: "Mẫu Blog",
      cacTruong: [
        { id: "t1", khoa: "layout", nhan: "Layout", loai: LOAI_TRUONG.CO_DINH, giaTriMacDinh: "post" },
        { id: "t2", khoa: "title", nhan: "Tiêu đề", loai: LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh: "" },
        { id: "t3", khoa: "date", nhan: "Ngày đăng", loai: LOAI_TRUONG.TU_DONG_NGAY, giaTriMacDinh: "" },
        { id: "t4", khoa: "categories", nhan: "Chuyên mục", loai: LOAI_TRUONG.NHAP_NHANH_DANH_SACH, giaTriMacDinh: "" },
        { id: "t5", khoa: "tags", nhan: "Thẻ", loai: LOAI_TRUONG.NHAP_NHANH_DANH_SACH, giaTriMacDinh: "" },
      ],
    },
    {
      id: "mau_tai_lieu",
      ten: "Mẫu Tài liệu",
      cacTruong: [
        { id: "t1", khoa: "layout", nhan: "Layout", loai: LOAI_TRUONG.CO_DINH, giaTriMacDinh: "doc" },
        { id: "t2", khoa: "title", nhan: "Tiêu đề", loai: LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh: "" },
        { id: "t3", khoa: "slug", nhan: "Đường dẫn (slug)", loai: LOAI_TRUONG.TU_DONG_TEN_FILE, giaTriMacDinh: "" },
        { id: "t4", khoa: "version", nhan: "Phiên bản", loai: LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh: "1.0" },
      ],
    },
    {
      id: "mau_san_pham",
      ten: "Mẫu Sản phẩm",
      cacTruong: [
        { id: "t1", khoa: "layout", nhan: "Layout", loai: LOAI_TRUONG.CO_DINH, giaTriMacDinh: "product" },
        { id: "t2", khoa: "title", nhan: "Tên sản phẩm", loai: LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh: "" },
        { id: "t3", khoa: "price", nhan: "Giá", loai: LOAI_TRUONG.NHAP_NHANH_CHU, giaTriMacDinh: "" },
        { id: "t4", khoa: "date", nhan: "Ngày cập nhật", loai: LOAI_TRUONG.TU_DONG_NGAY, giaTriMacDinh: "" },
        { id: "t5", khoa: "categories", nhan: "Danh mục", loai: LOAI_TRUONG.NHAP_NHANH_DANH_SACH, giaTriMacDinh: "" },
      ],
    },
  ];
}
