namespace E_commerce.DTOs.PaymentMethod
{
    public class CreatePaymentMethodRequest
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}