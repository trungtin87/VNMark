// Đây là thư viện lõi `vnmark_lib` được khai báo trong Cargo.toml ([lib] name = "vnmark_lib").
// main.rs (điểm vào cho desktop) chỉ gọi run() ở đây; #[cfg_attr(mobile, ...)]
// cho phép cùng một hàm này cũng là điểm vào khi build cho Android/iOS.
//
// Theo triết lý "đơn giản là tối thượng" của đặc tả: không có nghiệp vụ
// phức tạp ở tầng Rust. Toàn bộ logic soạn thảo, chuyển đổi Markdown và
// sinh YAML nằm ở tầng React (src/tien-ich/). Rust chỉ cấp 3 năng lực gốc
// của hệ điều hành mà trình duyệt không thể tự làm:
//   - dialog: hộp thoại mở/lưu file gốc hệ điều hành
//   - fs:     đọc/ghi file thật trên đĩa (trong phạm vi quyền capabilities)
//   - store:  lưu cấu hình Mẫu Front Matter bền vững, không cần server/DB

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("VNMark: lỗi khi khởi chạy ứng dụng");
}
