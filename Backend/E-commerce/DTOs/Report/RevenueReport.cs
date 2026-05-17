namespace E_commerce.DTOs.Report
{
    public class RevenueReport
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public decimal TotalRevenue { get; set; }

        public int TotalOrders { get; set; }
    }
}