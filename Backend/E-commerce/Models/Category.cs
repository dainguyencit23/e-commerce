using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100)]
        public string Name { get; set; }
        [Required(ErrorMessage ="Slug is required.")]
        [StringLength(50)]
        
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
