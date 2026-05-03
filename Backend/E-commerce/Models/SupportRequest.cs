using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce.Models
{
    public class SupportRequest
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "UserId is required.")]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(150)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        [StringLength(1000)]
        public string Message { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; 
        // Pending / InProgress / Resolved

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; } // có thể null
    }
}
