namespace E_commerce.DTOs.Report
{
    public class TopCustomer
    {
        public Guid CustomerId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public decimal TotalSpent { get; set; }

        public int OrderCount { get; set; }
    }
}