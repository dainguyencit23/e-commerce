using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Category
{
    public class CategoryRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
    }
}