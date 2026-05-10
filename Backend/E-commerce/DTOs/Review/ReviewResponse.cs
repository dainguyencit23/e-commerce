namespace E_commerce.DTOs.Review
{
    public class ReviewResponse
    {
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}