namespace E_commerce.DTOs.PaymentMethod
{
    public class UpdatePaymentMethodRequest
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}