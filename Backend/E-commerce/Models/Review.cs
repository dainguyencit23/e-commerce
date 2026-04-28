using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema; 

namespace E_commerce.Models
{
    public class Review
    {
        [Key] // xác định đây là khóa chính (Primary Key)
        public Guid Id { get; set; } = Guid.NewGuid(); // tự động tạo Id duy nhất

        [Required] // bắt buộc phải có ProductId
        public Guid ProductId { get; set; } // liên kết tới Product

        [Required] // bắt buộc phải có UserId
        public Guid UserId { get; set; } // người viết review

        public Guid? OrderDetailId { get; set; }
        // nullable (?) vì có thể cho phép review không cần order (tuỳ business)

        [Range(1, 5)] // rating chỉ từ 1 đến 5
        public int Rating { get; set; }

        [StringLength(500)] // giới hạn độ dài comment
        public string? Comment { get; set; } // có thể null

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        // tự động lấy thời gian hiện tại (UTC để tránh lệch timezone)

        public string? Image { get; set; } // link ảnh review (optional)

        // ================= Navigation Properties =================

        [ForeignKey(nameof(ProductId))] // chỉ ra khóa ngoại
        public virtual Product Product { get; set; }
        // virtual để hỗ trợ lazy loading (EF chỉ load khi cần)

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; }

        [ForeignKey(nameof(OrderDetailId))]
        public virtual OrderDetail? OrderDetail { get; set; }
        // nullable vì OrderDetailId có thể null
    }
}