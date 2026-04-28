using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class ProductVariant
    {
        [Key]
        public Guid ProductVariantId {get; set;} = Guid.NewGuid();
        
        public Guid ProductId {get; set;}
        [ForeignKey("ProductId")]
        public virtual Product? Product {get; set;}

        [Required(ErrorMessage="Product variant name is required!")]
        public string Name {set; get;} = null!;

        [Required(ErrorMessage="Product variant price is required!")]
        [Column(TypeName="decimal(18, 2)")]
        public decimal Price {set; get;}

        [Required(ErrorMessage="Product variant quantity is required!")]
        public int Quantity {set; get;}
    }
}
