// Điểm vào cho bản desktop: chỉ gọi hàm run() thật sự nằm trong lib.rs
// (thư viện vnmark_lib) — đúng khuôn mẫu chính thức của Tauri 2.0 để một
// codebase Rust duy nhất dùng được cho cả desktop lẫn mobile.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    vnmark_lib::run();
}
