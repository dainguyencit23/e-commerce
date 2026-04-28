using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class PaymentMethod
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid(); // tự động tạo Id duy nhất

        [Required]
        [StringLength(100)]
        public string Name { get; set; } // tên phương thức thanh toán
        [StringLength(255)]
        public string? Description { get; set; } // miêu tả phương thức thanh toán (optional)
        public bool IsActive { get; set; } = true; // trạng thái hoạt động của phương thức thanh toán, mặc định là true (đang hoạt động)

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>(); // một phương thức thanh toán có thể được sử dụng trong nhiều đơn hàng
        // 1 PaymentMethod -> N Order
    }
}
