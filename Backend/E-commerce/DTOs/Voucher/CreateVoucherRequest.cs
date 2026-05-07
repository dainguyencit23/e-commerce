using E_commerce.Models;
namespace E_commerce.DTOs.Voucher
{
    public class CreateVoucherRequest
    {
        public string Code { get; set; } = null!;
        public DiscountType DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public decimal MinOrderAmount { get; set; }
        public decimal MaxOrderAmount { get; set; }
        public int TotalQuantity { get; set; }
        public int UsedCount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

}