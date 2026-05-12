using System.ComponentModel.DataAnnotations;

namespace E_commerce.DTOs.Review
{
    public class UpdateReviewRequest
    {
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }
    }
}