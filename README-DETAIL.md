# E-Commerce Backend — Tài liệu chi tiết tính năng

> **Mục đích:** File này là bản ghi đầy đủ về kiến trúc và tính năng của backend. Đọc file này thay vì quét lại codebase.
> **Cập nhật lần cuối:** 2026-05-30

---

## 1. Technology Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | ASP.NET Core 8.0 (Web API) |
| ORM | Entity Framework Core 8.0 |
| Database | SQL Server (LocalDB) |
| Authentication | JWT (HS256, 60 phút) |
| Password Hashing | BCrypt.Net-Next v4.0.3 |
| Image Upload | Cloudinary (CloudinaryDotNet v1.29.1) |
| API Docs | Swagger / Swashbuckle v6.6.2 |
| Testing | xUnit |

---

## 2. Cấu trúc thư mục

```
Backend/
├── E-commerce/
│   ├── Controllers/       # API endpoints
│   ├── Models/            # Entity (DB models)
│   ├── DTOs/              # Request / Response objects
│   ├── Services/          # Business logic
│   ├── Repositories/      # Data access layer
│   ├── Data/              # AppDbContext
│   ├── MiddleWares/       # Global exception handler
│   ├── Helpers/           # Utility classes (BaseResponse, v.v.)
│   ├── Migrations/        # EF Core migrations
│   ├── appsettings.json
│   └── Program.cs
└── E-commerce.Tests/      # Unit test project
```

---

## 3. Database Schema

### User
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Name | string(100) | Tên đăng nhập |
| Email | string(100) | Unique (khi IsDeleted=false) |
| Password | string(100) | BCrypt hash |
| FullName | string(100)? | |
| PhoneNumber | string(10) | |
| Address | string? | |
| CreatedDate | DateTime | |
| totalSpend | decimal(18,2) | Tổng chi tiêu |
| RoleId | Guid | FK → Role |
| IsDeleted | bool | Soft delete |

### Role
| Id (seed) | Name |
|---|---|
| 00000000-0000-0000-0000-000000000001 | Admin |
| 00000000-0000-0000-0000-000000000002 | Staff |
| 00000000-0000-0000-0000-000000000003 | Customer |

### Product
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Name | string(100) | |
| Description | string(200)? | |
| Price | decimal(18,2) | Giá gốc |
| AverageRating | double | 0–5 |
| CategoryId | Guid | FK |
| BrandId | Guid | FK |
| IsDeleted | bool | Soft delete |
| → ProductVariants | 1:N | |
| → ProductImages | 1:N | |
| → Reviews | 1:N | |

### ProductVariant
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | ValueGeneratedNever |
| ProductId | Guid | FK |
| Name | string | Ví dụ: "Red-M", "Blue-L" |
| Price | decimal(18,2) | |
| Quantity | int | Stock |

### ProductImage
| Field | Type | Ghi chú |
|---|---|---|
| ProductImageId | Guid | ValueGeneratedNever |
| ProductId | Guid | FK |
| ImageUrl | string | Cloudinary URL |

### Category
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Name | string(100) | |
| IsDeleted | bool | |

### Brand
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Name | string(150) | |

### Cart
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| UserId | Guid | FK, Unique (1:1 với User) |
| CreatedAt | DateTime | |
| → CartItems | 1:N | Cascade delete |

### CartItem
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| CartId | Guid | FK |
| ProductVariantId | Guid | FK |
| Quantity | int | |

### Order
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| OrderDate | DateTime | UTC |
| SubTotal | decimal(18,2) | Tổng trước giảm |
| DiscountAmount | decimal(18,2) | |
| TotalAmount | decimal(18,2) | Tổng thanh toán |
| Status | OrderStatus enum | Pending / Processing / Shipped / Delivered / Cancelled |
| UserId | Guid | FK |
| ReceiverName | string(100) | Snapshot |
| ReceiverPhone | string(15) | Snapshot |
| ShippingAddress | string(500) | Snapshot "Street, Ward, District, Province" |
| PaymentMethodId | Guid | FK |
| VoucherId | Guid? | FK (nullable, SetNull khi xóa) |

### OrderDetail
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| OrderId | Guid | FK |
| ProductVariantId | Guid | FK |
| OrderQuantity | int | |
| UnitPrice | decimal(18,2) | Giá lúc order |

### Review
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| ProductId | Guid | FK |
| UserId | Guid | FK |
| OrderDetailId | Guid? | FK (nullable) |
| Rating | int | 1–5 |
| Comment | string(500)? | |
| CreatedDate | DateTime | UTC |
| Image | string? | URL ảnh review |

### Voucher
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Code | string(50) | Unique |
| DiscountType | enum | Percentage / FixedAmount |
| DiscountValue | decimal(18,2) | |
| MinOrderAmount | decimal(18,2) | Đơn tối thiểu |
| MaxDiscountAmount | decimal(18,2) | Giảm tối đa |
| TotalQuantity | int | |
| UsedCount | int | |
| StartDate | DateTime | |
| EndDate | DateTime | |
| IsActive | bool | |

### PaymentMethod
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| Name | string(100) | |
| Description | string(255)? | |
| IsActive | bool | |

### ShippingAddress
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| UserId | Guid | FK |
| FullName | string(100) | |
| PhoneNumber | string(15) | |
| Province | string(100) | Tỉnh/Thành phố |
| District | string(100) | Quận/Huyện |
| Ward | string(100) | Phường/Xã |
| Street | string(255) | Số nhà, tên đường |
| IsDefault | bool | |

### SupportRequest
| Field | Type | Ghi chú |
|---|---|---|
| Id | Guid | PK |
| UserId | Guid | FK |
| StaffId | Guid? | FK (Staff phụ trách) |
| OrderId | Guid? | FK (nullable) |
| Subject | string(150) | |
| Message | string(1000) | |
| Status | string(50) | Pending / InProgress / Resolved |
| CreatedDate | DateTime | |

---

## 4. API Endpoints

### Authentication — `api/auth`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | /api/auth/register | None | Đăng ký tài khoản Customer |
| POST | /api/auth/login | None | Đăng nhập, trả về JWT |

**Register validation:** Password ≥ 6 ký tự, 1 uppercase, 1 digit, 1 special char; Email hợp lệ; PhoneNumber 10 số.

---

### Products — `api/products`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/products | Anonymous | Danh sách sản phẩm (filter + phân trang) |
| GET | /api/products/{id} | Anonymous | Chi tiết sản phẩm |
| POST | /api/products | Admin | Tạo sản phẩm (kèm variants + images) |
| PUT | /api/products/{id} | Admin, Staff | Cập nhật sản phẩm |
| DELETE | /api/products/{id} | Admin | Soft delete sản phẩm |

---

### Product Variants — `api/products/{id}/variants`, `api/variants/{id}`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/products/{id}/variants | Anonymous | Danh sách variants |
| POST | /api/products/{id}/variants | Admin, Staff | Thêm variant |
| PUT | /api/variants/{id} | Admin, Staff | Cập nhật variant |
| DELETE | /api/variants/{id} | Admin, Staff | Xóa variant |

---

### Product Images — `api/products/{id}/images`, `api/images/**`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | /api/products/{id}/images | Admin, Staff | Thêm URL ảnh vào sản phẩm |
| DELETE | /api/images/{id} | Admin, Staff | Xóa ảnh |
| POST | /api/images/upload | Admin, Staff | Upload ảnh lên Cloudinary (multipart/form-data) |

---

### Categories — `api/categories`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/categories | Anonymous | Danh sách danh mục |
| POST | /api/categories | Admin | Tạo danh mục |
| PUT | /api/categories/{id} | Admin | Cập nhật |
| DELETE | /api/categories/{id} | Admin | Xóa |

---

### Brands — `api/brands`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/brands | Anonymous | Danh sách thương hiệu |
| POST | /api/brands | Admin | Tạo thương hiệu |
| PUT | /api/brands/{id} | Admin | Cập nhật |
| DELETE | /api/brands/{id} | Admin | Xóa |

---

### Cart — `api/cart`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/cart | Required | Xem giỏ hàng (kèm TotalPrice) |
| POST | /api/cart/add | Required | Thêm / tăng số lượng sản phẩm |
| PUT | /api/cart/update | Required | Cập nhật số lượng item |
| DELETE | /api/cart/remove?productVariantId= | Required | Xóa 1 item |
| DELETE | /api/cart | Required | Xóa toàn bộ giỏ |

---

### Orders — `api/orders`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | /api/orders | Customer | Tạo đơn từ giỏ hàng |
| GET | /api/orders | Admin, Staff | Tất cả đơn hàng |
| GET | /api/orders/my | Customer | Đơn của user hiện tại |
| GET | /api/orders/{id} | Required | Chi tiết đơn |
| PUT | /api/orders/{id}/status | Admin, Staff | Cập nhật trạng thái đơn |
| PUT | /api/orders/{id}/cancel | Customer | Hủy đơn (chỉ khi Pending/Processing) |

**Order Creation Flow:**
1. Validate ShippingAddress thuộc user
2. Kiểm tra giỏ không trống
3. Validate voucher (nếu có): active, chưa hết hạn, còn lượt, đơn đủ MinAmount
4. Kiểm tra tồn kho tất cả variants
5. Tính SubTotal → áp dụng voucher → tính TotalAmount
6. Snapshot thông tin giao hàng vào Order
7. Tạo OrderDetails, trừ kho, tăng UsedCount voucher
8. Xóa CartItems đã order

---

### Reviews — `api/products/{id}/reviews`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/products/{id}/reviews | Anonymous | Danh sách review |
| GET | /api/products/{id}/can-review | Customer | Kiểm tra có thể review không |
| POST | /api/products/{id}/reviews | Customer | Tạo review |
| PUT | /api/products/{id}/reviews/{reviewId} | Customer | Cập nhật review của mình |
| DELETE | /api/products/{id}/reviews/{reviewId} | Required | Xóa (chủ sở hữu hoặc Admin) |

**Điều kiện review:** Đã mua sản phẩm + chưa review sản phẩm đó.

---

### Vouchers — `api/vouchers`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/vouchers | None | Danh sách voucher |
| GET | /api/vouchers/{id} | None | Chi tiết voucher |
| POST | /api/vouchers/validate | None | Kiểm tra & tính chiết khấu |
| POST | /api/vouchers | Admin | Tạo voucher |
| PATCH | /api/vouchers/{id} | Admin | Cập nhật voucher |
| DELETE | /api/vouchers/{id} | Admin | Xóa voucher |

**Validate logic:** active → trong date range → còn UsedCount < TotalQuantity → OrderAmount ≥ MinOrderAmount → tính discount (cap MaxDiscountAmount).

---

### Shipping Addresses — `api/shipping-addresses`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/shipping-addresses | Customer | Danh sách địa chỉ của mình |
| POST | /api/shipping-addresses | Customer | Thêm địa chỉ |
| PUT | /api/shipping-addresses/{id} | Customer | Cập nhật địa chỉ (chỉ của mình) |
| DELETE | /api/shipping-addresses/{id} | Customer | Xóa địa chỉ |
| PATCH | /api/shipping-addresses/{id}/default | Customer | Đặt làm mặc định |

---

### Payment Methods — `api/payment-methods`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/payment-methods | None | Danh sách PTTT |
| POST | /api/payment-methods | Admin | Tạo PTTT |
| PUT | /api/payment-methods/{id} | Admin | Cập nhật |
| DELETE | /api/payment-methods/{id} | Admin | Xóa |

---

### Support Requests — `api/supports`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | /api/supports | Customer | Tạo ticket hỗ trợ |
| GET | /api/supports | Customer | Tickets của mình |
| GET | /api/supports/all?status= | Admin, Staff | Tất cả tickets (filter theo status) |
| PATCH | /api/supports/{id}/status | Admin, Staff | Cập nhật status ticket |

---

### Reports — `api/reports`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/reports/revenue?startDate=&endDate= | Admin | Báo cáo doanh thu |
| GET | /api/reports/orders | Admin | Thống kê đơn hàng |
| GET | /api/reports/customers?top=5 | Admin | Top khách hàng theo chi tiêu |

---

### User Profile — `api/user`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | /api/user/create-staff-admin | Admin | Tạo tài khoản Staff/Admin |
| GET | /api/user/profile | Customer | Xem profile |
| PUT | /api/user/profile | Customer | Cập nhật profile |
| PUT | /api/user/password | Customer | Đổi mật khẩu |
| DELETE | /api/user/profile | Required | Soft delete tài khoản |

---

### Admin — `api/admins`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/admins/customers | Admin | Danh sách Customers |
| GET | /api/admins/staff | Admin | Danh sách Staff |

---

### Staff — `api/staffs`

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| GET | /api/staffs | None | Danh sách staff |
| GET | /api/staffs/{id} | None | Chi tiết staff |
| POST | /api/staffs | None | Tạo staff |
| PUT | /api/staffs/{id} | None | Cập nhật staff |
| DELETE | /api/staffs/{id} | None | Xóa staff |

> Lưu ý: Nhóm endpoint này không có auth (có thể là thiếu sót hoặc internal use).

---

## 5. Authentication & Authorization

**JWT Configuration:**
```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyMinimum32Characters!!",
    "Issuer": "ECommerceAPI",
    "Audience": "ECommerceClient",
    "ExpiryInMinutes": 60
  }
}
```

**Claims trong token:**
- `aud`: "ECommerceClient"
- `iss`: "ECommerceAPI"
- `email`: email user
- `nameid` (ClaimTypes.NameIdentifier): UserId (Guid)
- `role`: tên role (Admin / Staff / Customer)
- `exp`: hết hạn sau 60 phút

**Roles:**
- `Admin` — toàn quyền
- `Staff` — quản lý sản phẩm, đơn hàng, hỗ trợ
- `Customer` — mua hàng, review, quản lý cá nhân

**Lấy UserId trong controller:**
```csharp
var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
```

---

## 6. Response Format chuẩn

Tất cả API trả về `BaseResponse<T>`:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": { ... },
  "statusCode": 200
}
```

Lỗi:
```json
{
  "success": false,
  "message": "Email or password is incorrect.",
  "data": null,
  "statusCode": 401
}
```

---

## 7. Middleware

**GlobalExceptionMiddleware** — bắt toàn bộ unhandled exceptions:
- `UnauthorizedAccessException` → 401
- `ForbiddenException` → 403
- Các lỗi khác → 500
- Log tất cả qua `ILogger`

---

## 8. Cloudinary Image Upload

**Flow:**
1. Client POST multipart/form-data đến `/api/images/upload`
2. Server upload lên Cloudinary folder `ecommerce/products`
3. Trả về `SecureUrl`

**Config:**
```json
{
  "Cloudinary": {
    "CloudName": "dwmsw7ofg",
    "ApiKey": "523997812984961",
    "ApiSecret": "3gzAINU8ZOOx-orpkseh7oLl6H4"
  }
}
```

---

## 9. Database Migrations (theo thứ tự)

| Migration | Nội dung |
|---|---|
| 20260523164623_InitialCreate | Schema ban đầu |
| 20260523165531_SeedRoles | Seed 3 roles |
| 20260524073127_AddShippingAddress | Thêm bảng ShippingAddress |
| 20260524152254_AddIsDeletedToProduct | Soft delete cho Product |
| 20260524172958_AddCategoryIsDeleted | Soft delete cho Category |

**Foreign Key Constraints:**
- Cascade delete: Cart → CartItems, Product → ProductVariants
- SetNull: Order.VoucherId khi Voucher bị xóa
- Restrict: Hầu hết FK khác

---

## 10. Service & Repository Layer

**Services (20+):** JwtService, LoginService, RegisterService, ProductService, CartService, OrderService, ReviewService, VoucherService, PaymentMethodService, UserService, AdminUserService, AdminService, ShippingAddressService, SupportService, StaffService, ReportService, ProductVariantService, ProductImageService, CategoryService, BrandService.

**Repositories (9):** ProductRepository, ProductVariantRepository, UserRepository, RoleRepository, OrderRepository, VoucherRepository, ReviewRepository, StaffRepository, (+ CartRepository qua DbContext).

Tất cả đều dùng **Scoped** DI, có interface riêng.

---

## 11. Dependency Injection (Program.cs)

- `AddDbContext<AppDbContext>` — SQL Server
- `AddScoped<IXxxRepository, XxxRepository>` — 9 repositories
- `AddScoped<IXxxService, XxxService>` — 20+ services
- `AddSingleton<Cloudinary>` — Cloudinary instance
- `AddAuthentication(JwtBearer)` — JWT với HS256
- `AddCors` — AllowAll (any origin/method/header)
- `AddEndpointsApiExplorer` + `AddSwaggerGen` — Swagger với JWT security

---

## 12. Những điểm còn thiếu / cần lưu ý

- **Không có payment gateway thực** (chỉ có PaymentMethod entity, không tích hợp VNPay/Stripe/Momo)
- **Không có email notification** (đăng ký, đặt hàng, v.v.)
- **Không có rate limiting**
- **Không có caching** (Redis hay in-memory)
- **Cloudinary credentials trong appsettings** — nên dùng user-secrets hoặc env vars
- **StaffController không có auth** — có thể là bug hoặc chưa hoàn thiện
- **CORS AllowAll** — không phù hợp cho production

---

## 13. Connection String

```
Server=localhost;Database=ECommerceDB;Trusted_Connection=True;TrustServerCertificate=True;
```
