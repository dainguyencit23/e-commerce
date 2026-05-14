namespace E_commerce.DTOs.PaymentMethod
{
    public class PaymentMethodResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}