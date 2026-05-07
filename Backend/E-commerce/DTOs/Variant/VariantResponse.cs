namespace E_commerce.DTOs.Variant
{
    public class VariantResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quatity { get; set; }
    }
}
