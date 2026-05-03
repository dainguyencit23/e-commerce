using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class CartItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "CartId is required.")]
        public Guid CartId { get; set; }

        [ForeignKey(nameof(CartId))]
        public virtual Cart Cart { get; set; }

        [Required(ErrorMessage = "Product Variant Id is required.")]
        public Guid ProductVariantId { get; set; }

        [ForeignKey(nameof(ProductVariantId))]
        public virtual ProductVariant ProductVariant { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

    }
}
