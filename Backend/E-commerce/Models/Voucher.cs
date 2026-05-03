using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class Voucher
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Voucher code is required.")]
        [StringLength(50)]
        public string Code { get; set; } = null!;

        [Required(ErrorMessage = "Discount type is required.")]
        public DiscountType DiscountType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal DiscountValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal MinOrderAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue)]
        public decimal MaxDiscountAmount { get; set; }

        [Range(0, int.MaxValue)]
        public int TotalQuantity { get; set; }

        [Range(0, int.MaxValue)]
        public int UsedCount { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }

    public enum DiscountType
    {
        Percentage,
        FixedAmount
    }
}
