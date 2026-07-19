# Hướng dẫn: Đẩy VNMark lên GitHub, cấu hình Vite, build & phát hành (Release)

Tài liệu này có 3 phần độc lập, đọc phần nào cần thì dùng phần đó:

- **Phần A** — cấu hình Vite (bạn cần đọc kỹ phần này).
- **Phần B** — deploy bản web (chạy trong trình duyệt) lên GitHub Pages.
- **Phần C** — build & phát hành bản cài đặt desktop (.msi/.dmg/.deb/.AppImage) lên GitHub Releases.

---

## Phần A — Cấu hình Vite (quan trọng nhất)

### A.1. Vì sao cần quan tâm đến `base` trong Vite?

Khi bạn chạy `npm run dev`, trang chạy ở `http://localhost:1420/` — mọi
file JS/CSS đều nằm ngay dưới gốc `/`, nên không có vấn đề gì.

Nhưng khi build (`npm run build`) rồi đưa lên **GitHub Pages dạng project
page** (tức là `https://<tai-khoan>.github.io/<ten-repo>/`), trang web của
bạn **không nằm ở gốc tên miền** mà nằm trong một thư mục con
`/<ten-repo>/`. Nếu Vite vẫn build các đường dẫn asset là `/assets/...`
(gốc `/`), trình duyệt sẽ tìm nhầm sang
`https://<tai-khoan>.github.io/assets/...` (sai, thiếu `/ten-repo/`) →
trang trắng, mở Console sẽ thấy lỗi 404 hàng loạt cho file `.js`/`.css`.

Đây là lỗi phổ biến nhất khi đưa app Vite lên GitHub Pages, và lý do luôn
là **thiếu cấu hình `base`**.

### A.2. Cách VNMark đã cấu hình sẵn

Mở `vite.config.js`, bạn sẽ thấy dòng:

```js
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  base: process.env.VITE_BASE_PATH || "/",
  // ...
});
```

Dòng `base: process.env.VITE_BASE_PATH || "/"` nghĩa là:

- Nếu có biến môi trường `VITE_BASE_PATH` lúc build → dùng giá trị đó.
- Nếu không có → mặc định `"/"` (dùng cho `npm run dev` và cho trường hợp
  deploy ở gốc tên miền).

Nhờ vậy bạn **không cần sửa code** mỗi lần build cho môi trường khác nhau,
chỉ cần truyền biến môi trường khác nhau lúc chạy lệnh build.

### A.3. Build tay với `base` đúng

```bash
# Ví dụ repo của bạn tên là "vnmark" trên GitHub:
#   https://buitrungtin.github.io/vnmark/
VITE_BASE_PATH=/vnmark/ npm run build
```

⚠️ Lưu ý 3 điểm dễ sai:
1. **Phải có dấu `/` ở đầu và ở cuối**: `/vnmark/`, không phải `vnmark` hay `/vnmark`.
2. Giá trị phải **đúng chính xác tên repo trên GitHub** (phân biệt hoa/thường).
3. Nếu bạn đổi tên repo sau này, phải build lại với `base` mới.

Trên Windows PowerShell, cú pháp đặt biến môi trường khác một chút:

```powershell
$env:VITE_BASE_PATH="/vnmark/"; npm run build
```

Trên Windows CMD:

```cmd
set VITE_BASE_PATH=/vnmark/ && npm run build
```

### A.4. Kiểm tra bản build trước khi deploy

Sau khi build, đừng mở thẳng file `dist/index.html` bằng trình duyệt
(`file://...`) — cách này **sẽ lỗi** vì trình duyệt không hiểu đường dẫn
tuyệt đối `/vnmark/assets/...` khi mở từ ổ đĩa. Hãy dùng lệnh preview có
sẵn của Vite, nó tự dựng một server nhỏ mô phỏng đúng môi trường thật:

```bash
npx vite preview --base=/vnmark/ --port 4173
```

Mở `http://localhost:4173/vnmark/` — nếu trang hiện đúng, ảnh/css/font
load đủ thì bản build đã sẵn sàng deploy.

### A.5. Trường hợp deploy ở gốc tên miền (không cần `base`)

Nếu bạn deploy theo kiểu **user/organization page** (repo tên đúng bằng
`<tai-khoan>.github.io`, ví dụ `buitrungtin.github.io`), trang sẽ nằm ở
gốc `https://buitrungtin.github.io/` — lúc này **không cần** `VITE_BASE_PATH`,
cứ để mặc định `"/"`:

```bash
npm run build   # không cần biến môi trường gì thêm
```

### A.6. Vite chỉ build ra web tĩnh — không có Tauri bên trong

Một điều quan trọng cần hiểu: `npm run build` (Vite) chỉ đóng gói phần
**React/HTML/CSS/JS**, hoàn toàn không đụng đến Rust/Tauri. Vì vậy bản
build này:

- Chạy được trên GitHub Pages (chỉ cần trình duyệt, không cần cài gì).
- **Không có** hộp thoại mở/lưu file gốc hệ điều hành — `src/tien-ich/cauNoiTauri.js`
  tự động chuyển sang chế độ mô phỏng trình duyệt (mở file bằng chọn tệp,
  lưu bằng tải xuống, mẫu Front Matter lưu ở `localStorage`). Đây là hành
  vi đúng như thiết kế, không phải lỗi.
- Muốn có bản desktop thật (hộp thoại gốc, ghi file trực tiếp...) → xem
  **Phần C** bên dưới, đó là một quy trình build khác (Tauri), không phải
  Vite build.

---

## Phần B — Deploy bản web lên GitHub Pages

### B.1. Đẩy code lên GitHub

```bash
cd vnmark
git init
git add .
git commit -m "Khoi tao VNMark"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
git push -u origin main
```

### B.2. Bật GitHub Pages chạy bằng Actions

1. Vào repo trên GitHub → **Settings** → **Pages** (menu bên trái).
2. Mục **Build and deployment → Source**, chọn **GitHub Actions** (không
   chọn "Deploy from a branch").
3. Xong — không cần cấu hình gì thêm, vì workflow đã có sẵn ở
   `.github/workflows/deploy-gh-pages.yml`.

### B.3. Workflow tự động làm gì?

Mở file `.github/workflows/deploy-gh-pages.yml`, phần quan trọng nhất:

```yaml
- name: Build (chế độ trình duyệt)
  run: npm run build
  env:
    VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

`${{ github.event.repository.name }}` GitHub Actions tự điền đúng bằng
tên repo của bạn — đây chính là biến `VITE_BASE_PATH` đã giải thích ở
**Phần A**, chỉ khác là được điền tự động thay vì bạn gõ tay.

### B.4. Chạy thử / theo dõi tiến trình

- Mỗi lần `git push` lên nhánh `main`, tab **Actions** trên GitHub sẽ tự
  chạy workflow "Deploy VNMark len GitHub Pages".
- Đợi workflow chạy xong (dấu ✔ xanh), vào lại **Settings → Pages** sẽ
  thấy dòng "Your site is live at https://...".
- Muốn chạy lại thủ công (không cần push code mới): vào tab **Actions** →
  chọn workflow → **Run workflow**.

### B.5. Lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|---|---|---|
| Trang trắng, Console báo 404 hàng loạt file `.js`/`.css` | Thiếu/sai `base` | Xem lại Phần A — với deploy tự động qua Actions thì lỗi này hiếm xảy ra vì đã tự điền tên repo |
| Trang hiện đúng nhưng ảnh/icon vỡ | Bạn có chỗ nào trong code trỏ ảnh bằng đường dẫn tuyệt đối `/anh.png` thay vì import qua Vite | Import ảnh qua `import anh from './anh.png'` hoặc để trong thư mục `public/` |
| Workflow báo lỗi ở bước "npm ci" | Thiếu `package-lock.json` hoặc không khớp `package.json` | Chạy `npm install` ở máy bạn, commit `package-lock.json` mới, push lại |
| Bấm vào link nhưng ra trang 404 của GitHub | Chưa bật Pages, hoặc chọn nhầm Source là "branch" thay vì "GitHub Actions" | Làm lại bước B.2 |

---

## Phần C — Build & phát hành bản desktop (Release) lên GitHub

Phần này build cả phần Rust/Tauri thật (không phải chỉ Vite), tạo ra file
cài đặt `.msi`/`.exe` (Windows), `.dmg` (macOS), `.deb`/`.AppImage` (Linux),
rồi tự động đính kèm vào một **GitHub Release**.

### C.1. Điều kiện cần

- Đã đẩy code lên GitHub (xem Phần B.1).
- Không cần cài Rust/Tauri trên máy bạn — toàn bộ build chạy trên máy chủ
  của GitHub Actions (`.github/workflows/release.yml` đã có sẵn).

### C.2. Đồng bộ số phiên bản trước khi phát hành

Trước khi tạo release, cập nhật **cùng một số phiên bản** ở 3 chỗ (để
tránh lệch version giữa web/app):

- `package.json` → `"version": "0.2.0"`
- `src-tauri/tauri.conf.json` → `"version": "0.2.0"`
- `src-tauri/Cargo.toml` → `version = "0.2.0"`

```bash
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "Nang phien ban len 0.2.0"
git push
```

### C.3. Tạo tag và đẩy lên — bước này kích hoạt build

Workflow `release.yml` được cấu hình để **chỉ chạy khi bạn đẩy một tag**
bắt đầu bằng chữ `v` (ví dụ `v0.2.0`):

```bash
git tag v0.2.0
git push origin v0.2.0
```

Sau lệnh này, vào tab **Actions** trên GitHub sẽ thấy workflow "Build &
Phat hanh VNMark" tự chạy song song trên 4 máy ảo (macOS Apple Silicon,
macOS Intel, Ubuntu, Windows) — mỗi máy build ra bản cài đặt riêng cho hệ
điều hành đó.

### C.4. Lấy bản cài đặt sau khi build xong

1. Build mất khoảng 10–20 phút (biên dịch Rust khá lâu, đặc biệt lần đầu).
2. Vào tab **Releases** của repo (hoặc trang chủ repo → cột phải → "Releases").
3. Sẽ thấy một **bản nháp (draft)** tên "VNMark v0.2.0" chứa đủ file:
   `VNMark_0.2.0_x64.msi`, `VNMark_0.2.0_x64.dmg` (Intel),
   `VNMark_0.2.0_aarch64.dmg` (Apple Silicon), `VNMark_0.2.0_amd64.deb`,
   `VNMark_0.2.0_amd64.AppImage`...
4. Bấm **Edit** bản nháp đó, viết mô tả (changelog) rồi bấm **Publish
   release** để công khai cho người dùng tải về.

> Vì `releaseDraft: true` trong `release.yml`, release luôn ở dạng nháp
> trước — tránh trường hợp workflow build lỗi giữa chừng mà người dùng đã
> thấy/tải nhầm bản thiếu file. Muốn tự động công khai luôn (không qua
> bước duyệt tay), đổi `releaseDraft: true` thành `false`.

### C.5. Icon ứng dụng — cần làm trước lần release đầu tiên

`tauri build` sẽ báo lỗi nếu thiếu icon. Ở máy bạn (không cần trên CI):

```bash
npm install
npm run tauri icon duong-dan-anh-logo-vuong.png
git add src-tauri/icons
git commit -m "Them icon VNMark"
git push
```

Ảnh gốc nên là ảnh vuông, tối thiểu 1024×1024px, nền trong suốt (PNG) để
đẹp trên mọi hệ điều hành.

### C.6. Lỗi thường gặp khi release

| Hiện tượng | Nguyên nhân | Cách sửa |
|---|---|---|
| Job Linux lỗi "webkit2gtk not found" | Thiếu thư viện hệ thống | Đã có sẵn bước cài `libwebkit2gtk-4.1-dev` trong `release.yml`; nếu vẫn lỗi, kiểm tra đúng version Ubuntu (`ubuntu-22.04`) |
| Lỗi "missing field `icon`" | Chưa có icon | Làm bước C.5 |
| Job macOS Apple Silicon lỗi "target not found" | Thiếu Rust target `aarch64-apple-darwin` | Đã cấu hình sẵn trong `release.yml` qua `dtolnay/rust-toolchain`; kiểm tra không sửa nhầm dòng đó |
| Không thấy tab Releases có gì mới | Tag chưa đúng định dạng `v*`, hoặc push tag vào nhánh khác | Kiểm tra `git tag` bằng `git tag -l`, đảm bảo tag bắt đầu bằng chữ `v` |
| Muốn xoá/làm lại 1 release | Tag cũ vẫn còn nên workflow không chạy lại | `git tag -d v0.2.0 && git push origin :refs/tags/v0.2.0` rồi tạo lại tag |

---

## Tóm tắt nhanh (cheat sheet)

```bash
# --- Web (GitHub Pages) ---
# Chỉ cần: Settings → Pages → Source → GitHub Actions, rồi push lên main.
git push origin main

# --- Desktop (GitHub Releases) ---
# 1. Đồng bộ version ở 3 file (package.json, tauri.conf.json, Cargo.toml)
# 2. Tạo tag rồi push:
git tag v0.2.0
git push origin v0.2.0
# 3. Đợi Actions build xong → vào tab Releases → sửa mô tả → Publish
```
