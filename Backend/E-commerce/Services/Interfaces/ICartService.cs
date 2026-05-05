using E_commerce.DTOs.Cart;

namespace E_commerce.Services.Interfaces
{
    // Interface định nghĩa các chức năng của CartService
    public interface ICartService
    {
        // Lấy cart theo userId
        Task<CartResponseDto?> GetCartAsync(Guid userId);

        // Thêm item vào cart
        Task<bool> AddItemAsync(Guid userId, AddCartItemDto dto);

        // Update quantity của cart item
        Task<bool> UpdateItemAsync(Guid itemId, UpdateCartItemDto dto);

        // Xóa cart item
        Task<bool> DeleteItemAsync(Guid itemId);

        // Xóa toàn bộ cart
        Task<bool> ClearCartAsync(Guid userId);
    }
}