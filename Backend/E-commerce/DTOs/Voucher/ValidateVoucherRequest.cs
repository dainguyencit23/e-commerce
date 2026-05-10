using E_commerce.Models;
namespace E_commerce.DTOs.Voucher
{
    public class ValidateVoucherRequest
    {
        public string Code { get; set; } = null!;
        public decimal OrderAmount { get; set; }
    }

}