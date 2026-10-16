# 💐 WEBSITE THIỆP CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10

Trang web thiệp chúc mừng 20/10 tương tác được xây dựng hoàn toàn bằng **HTML, CSS và JavaScript thuần (Vanilla JS)**, chạy **100% Offline**, không cần cài đặt thêm server hay thư viện bên ngoài.

---

## ✨ CÁC TÍNH NĂNG NỔI BẬT

1. **Trang 1 — Nhập tên người nhận**:
   - Thiết kế mở đầu tối giản, lãng mạn với phong cách Glassmorphism và hiệu ứng ánh sáng.
   - Kiểm tra nhập tên (báo rung và hiển thị nhắc nhở nếu chưa nhập tên).
   - Có các thẻ gợi ý nhanh (*Mẹ yêu, Em yêu, Chị gái, Cô gái đáng yêu*).
   - Chuyển trang mượt mà bằng hiệu ứng Fade & Zoom.

2. **Trang 2 — Đóa hoa tương tác & Thiệp chúc mừng**:
   - Ở giữa là bó hoa nghệ thuật SVG chi tiết với giấy gói hồng pastel và nơ vàng sang trọng.
   - Bông hoa nổi bật ở trung tâm mời gọi người dùng rút hoa (hỗ trợ cả **Click chuột** và **Kéo/Chạm vuốt cảm ứng trên điện thoại**).
   - Khi rút hoa: Bông hoa vút lên, pháo hoa cánh hoa & ánh sáng bùng nổ 360 độ (Canvas Particles).
   - Bó hoa biến mất, một phong thư 3D xuất hiện và tự động mở nắp phong thư.
   - Tờ thiệp bên trong trượt lên trang trọng với nội dung chúc mừng được cá nhân hóa bằng tên người nhận:
     > *"Chúc mừng ngày Phụ nữ Việt Nam 20/10 💐*  
     > *Gửi [Tên người nhận] thân mến,*  
     > *Chúc bạn luôn vui vẻ, xinh đẹp, hạnh phúc và luôn được yêu thương.*  
     > *Mong rằng mỗi ngày của bạn đều có thật nhiều niềm vui và những điều tốt đẹp nhất.*  
     > *Happy Vietnamese Women's Day 20/10 ❤️"*
   - Hiệu ứng chữ xuất hiện tuần tự mượt mà.
   - Có nút *Xem lời chúc đặc biệt 🎥* để sang Trang 3 và nút *Cắm hoa lại 🌸*.

3. **Trang 3 — Video lời chúc đặc biệt**:
   - Tiêu đề cá nhân hóa: *"Một lời chúc dành riêng cho [Tên người nhận]"*.
   - Khung video lớn chuẩn tỉ lệ 16:9 với thanh điều khiển tùy chỉnh (Play/Pause, Tua tiến trình, Âm lượng, Toàn màn hình).
   - **Video hoạt hình tích hợp sẵn trong code**: JavaScript Canvas tự vẽ hoa hồng nở, ánh sáng và lời chúc; tự chạy khi mở Trang 3.
   - Không cần tải video lên hosting, không cần file `video.mp4` hay chọn video từ máy. Hoạt hình được tạo trực tiếp trong trình duyệt.
   - Khi video kết thúc: Tự động hiển thị màn hình chúc mừng rực rỡ *"Chúc [Tên] một ngày 20/10 thật vui vẻ và hạnh phúc! ❤️"* cùng pháo hoa giấy & tim bay.

4. **Trải nghiệm UX & Hiệu ứng âm thanh tổng thể**:
   - **Âm thanh tổng hợp (Web Audio API Synthesizer)**: Tiếng chuông thanh thoát, tiếng rít harp huyền diệu khi rút hoa, tiếng mở phong thư... tạo ra từ code JS mà không cần bất kỳ file mp3 ngoài nào, hoạt động 100% offline. Có nút bật/tắt âm thanh ở góc phải trên.
   - **Nền cánh hoa rơi**: Canvas 60fps mượt mà, nhẹ máy, không hao pin.
   - **Responsive**: Tối ưu hoàn hảo cho màn hình cảm ứng điện thoại (iPhone, Android) và hiển thị sắc nét trên iPad, Laptop, PC.
   - **Thanh tiến trình (Progress Indicator)**: Hiển thị rõ các bước 1/3, 2/3, 3/3 ở chân trang, cho phép click để quay lại các bước trước đó.

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### Cách 1: Mở xem trực tiếp (Cực kỳ đơn giản)
1. Mở thư mục:
   `C:\Users\cheem\.gemini\antigravity\scratch\thiep-20-10`
2. Nhấp đúp chuột vào file **`index.html`** để mở trên bất kỳ trình duyệt nào (Chrome, Edge, Cốc Cốc, Safari, Firefox).

### Trang video chạy như thế nào?
Trang 3 tự phát hoạt hình được tạo bằng JavaScript Canvas. Vì hình ảnh được vẽ ngay trong code, website không cần tải hay lưu trữ một file video riêng. Nếu muốn dùng một video quay thật của bạn, cần có file video đó để nhúng/đóng gói riêng.

---

## 📁 CẤU TRÚC THƯ MỤC
```text
thiep-20-10/
├── index.html       # Cấu trúc 3 trang, SVG bó hoa, phong thư và video player
├── style.css        # Thiết kế Glassmorphism, phong cách lãng mạn, animation mượt
├── script.js        # Xử lý logic 3 trang, rút hoa, mở thiệp, video, âm thanh Web Audio
├── README.md        # Hướng dẫn chi tiết
└── (không cần video.mp4 — hoạt hình được tạo trực tiếp bằng JavaScript Canvas)
```
# thiep-20-10
# thiep20-10nghung
