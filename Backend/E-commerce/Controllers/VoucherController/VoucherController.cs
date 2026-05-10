
using E_commerce.DTOs.Voucher;
using E_commerce.Helpers;
using E_commerce.Models;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/vouchers")]
    public class VoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;
        public VoucherController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        // POST api/vouchers/validate
        [HttpPost("validate")]
        public async Task<IActionResult> Validate(ValidateVoucherRequest request)
        {
            try
            {
                var res = await _voucherService.Validate(request);
                return Ok(BaseResponse<ValidateVoucherResponse>.Ok(res));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(BaseResponse<string>.Fail(ex.Message, 400));
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAsync()
        {
            var vouchers = await _voucherService.GetAllAsync();
            return Ok(BaseResponse<List<VoucherResponse>>.Ok(vouchers));          

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVoucherById(Guid id)
        {
            try
            {
                var voucher = await _voucherService.GetVoucherById(id);
                return Ok(BaseResponse<VoucherResponse>.Ok(voucher));
            } catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            

        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateVoucherAsync(CreateVoucherRequest request)
        {
            try
            {
                var voucher = await _voucherService.CreateVoucherAsync(request);
                return Ok(BaseResponse<VoucherResponse>.Ok(voucher));
            }catch (InvalidDataException ex)
            {
                return BadRequest(BaseResponse<string>.Fail(ex.Message));
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>  UpdateVoucherAsync(Guid id, UpdateVoucherRequest request)
        {
            try
            {
                var voucher = await _voucherService.UpdateVoucherAsync(id, request);
                return Ok(BaseResponse<VoucherResponse>.Ok(voucher));
            }catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            try
            {
                await _voucherService.DeleteAsync(id);
                return Ok(BaseResponse<string>.Ok(string.Empty, "Deleted successfully."));
            } catch (KeyNotFoundException ex)
            {
                return NotFound(BaseResponse<string>.Fail(ex.Message, 404));
            }
            
            
        }
    }
}