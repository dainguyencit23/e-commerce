namespace E_commerce.DTOs.Variant
{
    public class CreateVariantRequest
    {
        public string Name {get; set;} = null!;
        public decimal Price {get; set;}
        public int Quatity {get; set;}
    }
}