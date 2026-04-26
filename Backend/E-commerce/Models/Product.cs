using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class Product
    {
        [Key] //Xác định primary key
        public Guid Id { get; set; } = Guid.NewGuid(); //guid là hệ thống tự động tạo Id
        [Required(ErrorMessage = "Name is required.")] //để yêu cầu điền thông tin (ko đc null)
                                                       //và phần thông báo nếu không nhập
        [StringLength(100)]//giới hạn độ dài nvarchar để tối ưu database
        public string Name { get; set; }
        [StringLength(200)]
        public string? Description { get; set; } // ? để cho bt là có thể null
        [Column(TypeName = "decimal(18,2)")] //định nghĩa cho decimal trong db
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue,ErrorMessage ="Quantity must be a positve number")] //constrain giá trị không âm
        public int Quantity { get; set; }
        [Required(ErrorMessage = "CategoryId is required.")]
        public Guid CategoryId { get; set; }
        
        [ForeignKey(nameof(CategoryId))] //nameof dùng để compile báo lỗi nếu sai variable
        public virtual Category Category { get; set; } //virtual dùng để tạo lazyloading
                                                       //là khi nào cần thì mới tải về giúp tiết kiệm bộ nhớ và tối ưu thời gian'
        public Guid BrandId { get; set; }
        [ForeignKey(nameof(BrandId))]
        public virtual Brand Brand { get; set; }

        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();// trong các mốt quan hệ một nhiều
                                                                                                     // thì cần tạo ICollection để nhận biết
    }
}
