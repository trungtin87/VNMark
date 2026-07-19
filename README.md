# VNMark — Trình soạn thảo văn bản Markdown dành cho người VIỆT NAM

Ứng dụng soạn thảo WYSIWYG cho Markdown + Front Matter YAML, xây dựng theo
`dac-ta-mdvn-tauri.md` (bản đặc tả 2.0), dùng **Tauri 2.0 + React + Tiptap**.

Tác giả: **Bùi Trung Tín**

## Đã hoàn thành theo đặc tả

- **Phân hệ 1 — Mở & đọc file**: `Ctrl/Cmd+O` mở hộp thoại hệ điều hành, tự
  tách Front Matter bằng `js-yaml`, tự nhận diện mẫu khớp hoặc gợi ý tạo mẫu
  mới, ghi nhớ đường dẫn gốc, cảnh báo (•) khi có thay đổi chưa lưu.
- **Phân hệ 2 — Soạn thảo WYSIWYG**: thanh công cụ đầy đủ icon + phím tắt
  (`src/components/ThanhCongCuDinhDang.jsx`), menu nổi khi bôi đen
  (`MenuNoi.jsx`), menu lệnh nhanh gõ `/` kiểu Notion
  (`src/tien-ich/lenhNhanh.js`), chèn ảnh vào thư mục `assets/` cạnh file
  `.md` (`cauNoiTauri.js` → `luuAnhVaoAssets`), chế độ Tập trung viết.
- **Phân hệ 3 — Quản lý mẫu Front Matter**: 3 mẫu dựng sẵn (Blog, Tài liệu,
  Sản phẩm) trong `mauMacDinh.js`, đủ 5 loại trường (cố định / tự động-ngày /
  tự động-tên file / nhập nhanh-chữ / nhập nhanh-danh sách), CRUD mẫu ngay
  trong ứng dụng (`ModalQuanLyMau.jsx`), lưu bền vững qua Tauri `store`.
- **Xuất file**: `Ctrl+S` ghi đè, `Ctrl+Shift+S` lưu thành, tên file tự sinh
  `YYYY-MM-DD-tieu-de-khong-dau.md` (`boDauTiengViet.js`), chuyển đổi hai
  chiều HTML ⇄ Markdown chuẩn (`chuyenDoiMarkdown.js`, dùng `turndown` +
  `marked`).

## Cấu trúc thư mục

Đúng theo mục II.3 của đặc tả — xem cây thư mục trong `src/` và `src-tauri/`.

## Chạy thử nhanh trên trình duyệt (không cần Rust/Tauri)

```bash
npm install
npm run dev
```

Ở chế độ này, `src/tien-ich/cauNoiTauri.js` tự động chuyển sang mô phỏng:
mở file qua `<input type=file>`, lưu file bằng tải xuống, mẫu lưu tạm ở
`localStorage`. Dùng để kiểm thử nhanh giao diện và logic soạn thảo.

## Chạy bản Tauri thật (desktop)

Cần cài Rust (`rustup`) và các thư viện hệ thống theo hướng dẫn chính thức
của Tauri 2.0 cho từng hệ điều hành (trên Linux cần `webkit2gtk`, trên
Windows cần WebView2, macOS dùng sẵn WebKit).

```bash
npm install
npm run tauri dev      # chạy thử desktop
npm run tauri build    # đóng gói bản cài đặt (msi/dmg/deb/AppImage...)
```

Trước khi build phát hành, sinh bộ icon thật từ một ảnh vuông:

```bash
npm run tauri icon duong-dan-anh-logo.png
```

## Đóng gói di động (giai đoạn 4–5 trong lộ trình đặc tả)

```bash
# Android — cần Android Studio + SDK/NDK
npm run tauri android init
npm run tauri android dev

# iOS — bắt buộc máy macOS + Xcode
npm run tauri ios init
npm run tauri ios dev
```

## Đưa lên GitHub Pages (chế độ trình duyệt)

Được — vì `cauNoiTauri.js` đã có sẵn lớp mô phỏng cho trình duyệt (mở file
bằng `<input type=file>`, lưu bằng tải xuống, mẫu Front Matter lưu ở
`localStorage`), bản build tĩnh chạy tốt trên GitHub Pages, chỉ là không có
hộp thoại hệ điều hành gốc như bản desktop.

**Cách 1 — tự động bằng GitHub Actions (khuyên dùng):**
1. Đẩy code lên GitHub, vào **Settings → Pages → Source**, chọn **GitHub
   Actions**.
2. Workflow có sẵn ở `.github/workflows/deploy-gh-pages.yml` sẽ tự build và
   deploy mỗi khi push lên nhánh `main`.
3. Trang sẽ có địa chỉ `https://<ten-tai-khoan>.github.io/<ten-repo>/`.

**Cách 2 — build tay rồi đẩy nhánh `gh-pages`:**
```bash
npm install
VITE_BASE_PATH=/ten-repo-cua-ban/ npm run build
npx gh-pages -d dist   # cần `npm install -D gh-pages` trước
```

Nếu bạn deploy ở dạng `username.github.io` (repo gốc, không phải project
page) thì để `VITE_BASE_PATH` trống (mặc định `/`) vì không cần tiền tố.

## Đã sửa/thêm (phản hồi các lần kiểm thử)

- **Đổi tên ứng dụng** từ MDVN sang **VNMark** — cập nhật xuyên suốt: header
  giao diện, `index.html`, `package.json`, `Cargo.toml` (kể cả tên thư viện
  Rust `vnmark_lib`), `tauri.conf.json` (`productName`, `identifier`). Tiêu
  đề cửa sổ khi build ứng dụng desktop là **"VNMark-VIỆT NAM THỊNH VƯỢNG"**
  (`src-tauri/tauri.conf.json` → `app.windows[0].title`).
- **Bỏ ngắt trang ảo**: đã gỡ hoàn toàn extension mô phỏng ngắt trang kiểu
  Word (từng nằm ở `src/tien-ich/phanTrang.js`) theo yêu cầu — trang giấy
  giờ chỉ là một khối A4 liền mạch, cuộn dài tự nhiên khi nội dung dài hơn
  một trang.
- **Tắt kiểm tra chính tả của trình duyệt**: vùng soạn thảo và toàn bộ ô
  nhập Front Matter/mẫu giờ đặt `spellcheck="false"` — không còn bị trình
  duyệt gạch chân đỏ các từ tiếng Việt tưởng là lỗi chính tả tiếng Anh.
- **Ẩn Phiếu Front Matter trên điện thoại**: mặc định ẩn ở màn hình
  ≤768px, có nút "▤" trên thanh công cụ để mở dạng lớp phủ toàn màn hình
  kèm nút "✕ Đóng" riêng.
- **Giới thiệu ứng dụng**: nút "ℹ" ở góc trái thanh tiêu đề mở hộp thoại
  thông tin ứng dụng/tác giả — sửa `src/tien-ich/thongTinUngDung.js` nếu
  muốn đổi lại tên, liên hệ, mô tả.
- **Deploy GitHub Pages**: xem mục ngay phía trên.

## Đã sửa (phản hồi lần kiểm thử trước)

1. **Lỗi Rust "thiếu vnmark_lib"**: `Cargo.toml` khai báo `[lib] name = "vnmark_lib"`
   nhưng thiếu file `src/lib.rs`. Đã tách logic sang `src-tauri/src/lib.rs`
   (hàm `run()`), `main.rs` giờ chỉ gọi `vnmark_lib::run()` — đúng khuôn mẫu
   chính thức Tauri 2.0 (cũng là điểm vào dùng chung cho Android/iOS sau
   này).
2. **Vùng soạn thảo quá nhỏ**: viết lại CSS trang giấy dùng đơn vị `cm`
   (`21cm × 29.7cm` — đúng khổ A4 như Word) thay vì `min-height: 100%` phụ
   thuộc chiều cao phần tử cha; vùng gõ chữ (`.ProseMirror`) giờ `flex: 1`
   để lấp đầy toàn bộ trang, không còn co lại theo nội dung ngắn.
3. **Mở file .md không load được**: bọc `try/catch` quanh toàn bộ thao tác
   mở/lưu/chèn ảnh — lỗi giờ hiện ra bằng hộp thoại rõ ràng thay vì âm thầm
   biến mất; hộp thoại chọn file trên trình duyệt (`vite dev`, không phải
   Tauri) được gắn vào DOM và dùng `file.text()` để tương thích tốt hơn với
   Firefox/Safari; thay `gray-matter` (dùng `eval` nội bộ, có thể bị chặn
   hoặc lỗi âm thầm trong webview) bằng cách tự tách khối YAML với
   `js-yaml` — đã kiểm thử với file có/không có Front Matter và xuống dòng
   kiểu Windows (CRLF); mở rộng `fs:scope` trong `capabilities/default.json`
   để không bị từ chối quyền âm thầm khi mở file ngoài `$HOME`.

## Giới hạn/ghi chú kỹ thuật đã biết

- Ảnh dán/kéo-thả khi tài liệu **chưa từng lưu lần nào** sẽ được chèn tạm
  bằng `data:` URL; nên lưu file (`Ctrl+S`) trước khi chèn nhiều ảnh để
  chúng được sao chép đúng vào `assets/` ngay từ đầu.
- `capabilities/default.json` cấp quyền đọc/ghi trong `$HOME`, `$DOCUMENT`,
  `$DOWNLOAD`, `$DESKTOP` — thu hẹp lại nếu muốn giới hạn chặt hơn theo mục
  V (Bảo mật) của đặc tả.
- Bộ icon (`src-tauri/icons/`) chưa có sẵn — cần chạy `tauri icon` trước khi
  `tauri build` để tránh lỗi thiếu icon.
- Đã build thử `npm run build` (Vite) thành công để xác nhận toàn bộ mã
  nguồn React không có lỗi cú pháp/import; bước `tauri build` cần môi trường
  có Rust + thư viện hệ thống nên chưa build kiểm chứng trong môi trường này.
