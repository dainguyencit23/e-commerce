using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Brand
{
    public class BrandRequest
    {
        [Required]
        [StringLength(150)]
        public string Name { get; set; }
    }
}