namespace E_commerce.DTOs.Report
{
    public class OrderStatistics
    {
        public string Status { get; set; } = string.Empty;

        public int Count { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
    }
}