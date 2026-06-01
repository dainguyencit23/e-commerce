# TechShop — Frontend

React 18 + Vite + Tailwind CSS v4 + Ant Design

## Chạy local

```bash
npm install
npm run dev
```

Truy cập: http://localhost:5173

Yêu cầu file `.env`:
```
VITE_API_URL=https://localhost:7270/api
```

## Chạy với Docker

Từ thư mục **root** của project (không phải thư mục này):

```bash
docker-compose up --build
```

Frontend sẽ chạy tại http://localhost:5173 và tự kết nối backend tại `http://localhost:5000/api`.

> Xem hướng dẫn đầy đủ tại `README-DETAIL.md` — mục **16. Chạy với Docker**.
