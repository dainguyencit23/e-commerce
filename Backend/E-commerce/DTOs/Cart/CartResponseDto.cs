namespace E_commerce.DTOs.Cart
{
    // DTO dùng để trả toàn bộ giỏ hàng
    public class CartResponseDto
    {
        // Id của Cart
        public Guid Id { get; set; }

        // Danh sách cart items
        public List<CartItemDto> Items { get; set; } = new();
    }
}
