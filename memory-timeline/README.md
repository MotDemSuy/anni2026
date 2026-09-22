# Our Story — Memory Timeline 💞

Một cuốn **album kỷ niệm tình yêu tự chạy**: 8 ảnh theo năm (2022 → 2026), chuyển trang đều nhau theo giai điệu *Bốn Năm*. Không cần bấm hay lật — bấm *Bắt đầu* là album tự chạy đến hết bài. Không cần backend — chạy qua HTTP server bất kỳ là chạy ngay.

## Chạy thử

```bash
cd memory-timeline
python -m http.server 8123
# → mở http://localhost:8123
```

(Hoặc dùng Live Server của VS Code. Cần chạy qua HTTP để nhạc + ảnh load đúng, mở file trực tiếp qua `file://` sẽ bị chặn audio.)

## Điều khiển

Album tự chạy — chỉ còn 1 nút:

| Hành động | Cách |
|---|---|
| Bắt đầu | Nút *Bắt đầu* (hoặc Enter/Space) |
| Bật/tắt nhạc | Nút ♫ |

8 trang được chia **đều** thời lượng bài hát (duration ÷ 8 ≈ 32s/trang) — đổi bài hát khác thì album tự chia lại, không cần sửa gì.

## Chỉnh nội dung — chỉ cần sửa `script.js`

### 1. Đổi ảnh / ngày / tiêu đề / mô tả

Sửa mảng `memories` ở đầu file:

```js
{
  year: "2022",                    // số năm hiển thị góc trái
  title: "Ngày mình gặp nhau",
  description: "Một ngày rất bình thường…",
  image: "images/2022.jpg",        // đặt ảnh vào images/ rồi trỏ tới
  transition: "left",              // kiểu chuyển trang (xem bảng dưới)
  mood: "verse",                   // intro | verse | prechorus | chorus | bridge | final | outro
  layout: "split",                 // để trống | split | lyric | gilded | keepsake
  size: "lg",                      // (tuỳ chọn) ảnh phóng to hơn — đang dùng cho 2022 & 2023
}
```

Thêm/bớt object = thêm/bớt trang — thời gian mỗi trang tự chia lại đều theo số trang mới.

### 2. Thời gian từng trang — tự chia đều

Không cần sửa gì: engine lấy `audio.duration ÷ 9` làm chiều dài mỗi trang. Trang cuối (keepsake polaroid) giữ đến hết bài. Muốn lệch nhịp theo ý thì sửa hàm `pageForTime` trong `script.js`.

### 3. Kiểu chuyển trang (`transition`)

| Giá trị | Hiệu ứng |
|---|---|
| `left` | Trượt sang trái (mặc định) |
| `right` | Trượt sang phải |
| `push` | Trang mới đẩy trang cũ ra hoàn toàn |
| `fade` | Trượt nhẹ + fade |
| `zoom` | Trượt + zoom 94% → 100% (dùng cho chorus) |
| `dissolve` | Fade chậm thuần (intro / outro) |

### 4. `mood` điều chỉnh cảm xúc

- `final` / `outro` → bật hiệu ứng bokeh nền
- `intro` / `outro` → background mờ đậm hơn
- `mood` cũng quyết định hướng chuyển khi đi lùi

### 5. `layout` biến thể bố cục

- `""` — chuẩn: năm + ảnh full + caption (khung bám tỉ lệ ảnh, không cắt)
- `split` — caption căn phải, ảnh bo góc lệch
- `quote` — ảnh lệch trái, nhiều khoảng trắng
- `lyric` — ★ trang lời bài hát: không ảnh, chữ lớn giữa trang (ghi lời thật vào `title`)
- `gilded` — ★ ảnh khung vàng hai vòng, căn giữa (khoảnh khắc đắt giá)
- `keepsake` — ★ polaroid giấy nghiêng, lời cảm ơn viết tay dưới ô trắng (dùng cho trang cuối)

## Đổi bài hát

1. Copy file mp3 mới vào `music/`
2. Sửa dòng `MUSIC_SRC` trong `script.js`
3. Sửa lại `audioTimeline` theo bài mới
4. Đổi tên bài trong `index.html` (dòng intro "♫ …")

## Đổi ảnh

Kéo ảnh vào `images/`, rồi sửa `image:` trong `memories`. Ảnh đầu tiên được preload sẵn để trang 1 hiện tức thì.

## Cấu trúc

```
memory-timeline/
├── index.html      # khung trang: intro, stage, timeline, player
├── style.css       # toàn bộ giao diện + 6 kiểu transition
├── script.js       # DATA (memories, audioTimeline) + engine
├── images/         # ảnh kỷ niệm
└── music/          # bài hát
```

Trong `script.js`, code tách thành các phần đánh số: **DATA → RENDER → TRANSITION → AUDIO → INPUT → START → INIT** — sửa phần nào thì kéo tới đúng mục đó.
