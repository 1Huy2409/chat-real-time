# 💬 Chat Real-time Application

Ứng dụng chat real-time được xây dựng với Node.js, Express, Socket.IO và MongoDB. Hỗ trợ nhắn tin trực tiếp, quản lý bạn bè, phòng chat nhóm và nhiều tính năng khác.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ Tính năng

### 👤 Quản lý người dùng

- ✅ Đăng ký / Đăng nhập / Đăng xuất
- ✅ Quên mật khẩu với OTP qua email
- ✅ Cập nhật thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ Hiển thị trạng thái online/offline

### 👥 Quản lý bạn bè

- ✅ Tìm kiếm và gửi lời mời kết bạn
- ✅ Chấp nhận / Từ chối lời mời
- ✅ Hủy lời mời đã gửi
- ✅ Xem danh sách bạn bè
- ✅ Xem danh sách lời mời đã gửi
- ✅ Xem danh sách lời mời nhận được

### 💬 Chat real-time

- ✅ Nhắn tin 1-1 với bạn bè
- ✅ Tạo và quản lý phòng chat nhóm
- ✅ Gửi tin nhắn với emoji picker
- ✅ Hiển thị tên người gửi tin nhắn
- ✅ Scroll tự động đến tin nhắn mới
- ✅ Tin nhắn real-time qua Socket.IO

### 🔔 Thông báo

- ✅ Thông báo lời mời kết bạn mới
- ✅ Flash messages cho các hành động
- ✅ Badge hiển thị số lượng lời mời

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Frontend

- **Pug** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Emoji Picker Element** - Emoji selector

### Khác

- **express-session** - Session management
- **connect-mongo** - MongoDB session store
- **nodemailer** - Email sending
- **MD5** - Password hashing
- **dotenv** - Environment variables
- **compression** - Response compression

## 📁 Cấu trúc thư mục

```
chat-realtime/
├── config/                 # Cấu hình database
│   └── database.js
├── controller/            # Controllers xử lý logic
│   ├── admin/
│   └── client/
│       ├── auth.controller.js
│       ├── chat.controller.js
│       ├── home.controller.js
│       ├── rooms-chat.controller.js
│       └── users.controller.js
├── helper/                # Helper functions
│   ├── generate.js
│   └── sendMailHelper.js
├── middlewares/           # Middlewares
│   ├── admin/
│   └── client/
│       ├── auth.middleware.js
│       ├── room.middleware.js
│       └── user.middleware.js
├── models/                # Mongoose models
│   ├── chat.model.js
│   ├── forgot-password.model.js
│   ├── rooms-chat.model.js
│   └── user.model.js
├── public/                # Static files
│   ├── css/
│   │   └── style.css
│   ├── images/
│   └── js/
│       ├── chat.js
│       ├── script.js
│       ├── socket.js
│       └── users.js
├── routes/                # Routes
│   ├── admin/
│   └── client/
│       ├── auth.route.js
│       ├── chat.route.js
│       ├── home.route.js
│       ├── index.route.js
│       ├── rooms-chat.route.js
│       └── users.route.js
├── socket/                # Socket.IO handlers
│   └── client/
│       ├── chat.socket.js
│       └── users.socket.js
├── validates/             # Validation
│   └── client/
│       └── auth.validate.js
├── views/                 # Pug templates
│   ├── admin/
│   └── client/
│       ├── layouts/
│       ├── mixins/
│       ├── pages/
│       └── partials/
├── .env                   # Environment variables
├── .gitignore
├── index.js              # Entry point
├── package.json
└── README.md
```

## 🚀 Cài đặt và Chạy

### Yêu cầu

- Node.js >= 14.x
- MongoDB Atlas account hoặc MongoDB local
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd chat-realtime
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục root:

```env
# Server
PORT=3000

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# Session
SESSION_SECRET=your_session_secret_key_here
COOKIE_SECRET=your_cookie_secret_key_here

# Email (cho chức năng quên mật khẩu)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Bước 4: Chạy ứng dụng

**Development mode (với nodemon):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Truy cập: `http://localhost:3000`

## 🔐 Biến môi trường

| Biến             | Mô tả                     | Bắt buộc                    |
| ---------------- | ------------------------- | --------------------------- |
| `PORT`           | Port chạy server          | Không (mặc định: 3000)      |
| `MONGO_URL`      | MongoDB connection string | Có                          |
| `SESSION_SECRET` | Secret key cho session    | Có                          |
| `COOKIE_SECRET`  | Secret key cho cookie     | Có                          |
| `EMAIL_USER`     | Email để gửi OTP          | Có (nếu dùng quên mật khẩu) |
| `EMAIL_PASSWORD` | App password của email    | Có (nếu dùng quên mật khẩu) |

## 📦 Deploy lên Railway

### Bước 1: Chuẩn bị

1. Đăng ký tài khoản tại [Railway.app](https://railway.app)
2. Cài đặt Railway CLI (optional):

```bash
npm i -g @railway/cli
```

### Bước 2: Sửa package.json

Đảm bảo script start dùng `node` thay vì `nodemon`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon --inspect index.js"
}
```

### Bước 3: Deploy qua GitHub

1. Push code lên GitHub repository
2. Vào Railway Dashboard → New Project → Deploy from GitHub
3. Chọn repository của bạn
4. Railway sẽ tự động detect và deploy

### Bước 4: Thêm MongoDB

1. Trong Railway project → Add Service → Database → Add MongoDB
2. Copy MongoDB connection string
3. Thêm vào biến môi trường

### Bước 5: Cấu hình biến môi trường

Trong Railway Dashboard → Variables → Add:

- `MONGO_URL`
- `SESSION_SECRET`
- `COOKIE_SECRET`
- `EMAIL_USER` (optional)
- `EMAIL_PASSWORD` (optional)

### Bước 6: Deploy

Railway sẽ tự động deploy sau khi thêm biến môi trường.

## 🎯 Sử dụng

1. **Đăng ký tài khoản mới** tại `/user/register`
2. **Đăng nhập** tại `/user/login`
3. **Tìm kiếm người dùng** và gửi lời mời kết bạn
4. **Chấp nhận lời mời** để trở thành bạn bè
5. **Nhắn tin** trực tiếp với bạn bè
6. **Tạo phòng chat nhóm** để chat với nhiều người

## 🐛 Troubleshooting

### Lỗi "MongoStore.create is not a function"

Đảm bảo import connect-mongo đúng cách:

```javascript
const MongoStore = require("connect-mongo").default;
```

### Lỗi kết nối MongoDB

- Kiểm tra MongoDB connection string trong `.env`
- Đảm bảo IP của bạn được whitelist trong MongoDB Atlas
- Kiểm tra username/password

### Socket.IO không hoạt động

- Đảm bảo `my-user-id` attribute được set đúng trong body tag
- Kiểm tra socket.js được load trước các file khác
- Kiểm tra console log để xem kết nối socket

## 📝 License

ISC

## 👨‍💻 Author

Nguyễn Hữu Nhất Huy

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

Made with ❤️ using Node.js and Socket.IO
