using E_commerce.DTOs.PaymentMethod;
using E_commerce.Helpers;
using E_commerce.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/payment-methods")]
    public class PaymentMethodsController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentMethodService;

        public PaymentMethodsController(
            IPaymentMethodService paymentMethodService
        )
        {
            _paymentMethodService = paymentMethodService;
        }

        // GET: api/payment-methods
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _paymentMethodService.GetAllAsync();

            return Ok(
                BaseResponse<List<PaymentMethodResponse>>
                    .Ok(result, "Get payment methods successfully.")
            );
        }

        // POST: api/payment-methods
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(
            CreatePaymentMethodRequest request
        )
        {
            await _paymentMethodService.CreateAsync(request);

            return Ok(
                BaseResponse<string>
                    .Ok(string.Empty, "Create payment method successfully.")
            );
        }

        // PUT: api/payment-methods/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            Guid id,
            UpdatePaymentMethodRequest request
        )
        {
            try
            {
                await _paymentMethodService.UpdateAsync(id, request);

                return Ok(
                    BaseResponse<string>
                        .Ok(string.Empty, "Update payment method successfully.")
                );
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    BaseResponse<string>.Fail(ex.Message, 404)
                );
            }
        }

        // DELETE: api/payment-methods/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _paymentMethodService.DeleteAsync(id);

                return Ok(
                    BaseResponse<string>
                        .Ok(string.Empty, "Delete payment method successfully.")
                );
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    BaseResponse<string>.Fail(ex.Message, 404)
                );
            }
        }
    }
}