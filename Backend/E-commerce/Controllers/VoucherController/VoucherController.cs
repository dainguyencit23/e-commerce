
//using E_commerce.DTOs.Voucher;
//using E_commerce.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace E_commerce.Controllers.VoucherController
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class VoucherController : ControllerBase
//    {
//        // POST api/vouchers/validate
//        [HttpPost("validate")]
//        public async Task<IActionResult> Validate(ValidateVoucherRequest request)
//        {
//            var voucher = await _context.Vouchers
//                .FirstOrDefaultAsync(v => v.Code == request.Code);

//            if (voucher == null) return NotFound("Voucher không tồn tại");
//            if (!voucher.IsActive) return BadRequest("Voucher không còn hoạt động");
//            if (DateTime.UtcNow < voucher.StartDate || DateTime.UtcNow > voucher.EndDate)
//                return BadRequest("Voucher đã hết hạn");
//            if (voucher.UsedCount >= voucher.TotalQuantity)
//                return BadRequest("Voucher đã hết lượt dùng");
//            if (request.OrderAmount < voucher.MinOrderAmount)
//                return BadRequest($"Đơn hàng tối thiểu {voucher.MinOrderAmount}");

//            // Tính discount
//            decimal discount;
//            if (voucher.DiscountType == DiscountType.Percentage)
//            {
//                discount = request.OrderAmount * voucher.DiscountValue / 100;
//                if (voucher.MaxDiscountAmount > 0)
//                    discount = Math.Min(discount, voucher.MaxDiscountAmount);
//            }
//            else // FixedAmount
//            {
//                discount = voucher.DiscountValue;
//            }

//            return Ok(new ValidateVoucherResponse
//            {
//                Code = voucher.Code,
//                DiscountAmount = discount,
//                FinalAmount = request.OrderAmount - discount
//            });
//        }
//    }

//}