namespace E_commerce.DTOs.Voucher
{
    public class ValidateVoucherResponse
    {
        public string Code { get; set; } = null!;
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
    }
}
