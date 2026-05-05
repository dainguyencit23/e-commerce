namespace E_commerce.DTOs.Cart
{
    // DTO dùng để nhận dữ liệu khi user thêm sản phẩm vào giỏ hàng
    public class AddCartItemDto
    {
        // Id của ProductVariant cần thêm vào cart
        public Guid ProductVariantId { get; set; }

        // Số lượng sản phẩm muốn thêm
        public int Quantity { get; set; }
    }
}
