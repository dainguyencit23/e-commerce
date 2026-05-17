using E_commerce.DTOs.Report;

namespace E_commerce.Services.Interfaces
{
    public interface IReportService
    {
        Task<RevenueReport> GetRevenueReportAsync(
            DateTime startDate,
            DateTime endDate);

        Task<List<OrderStatistics>> GetOrderStatisticsAsync();

        Task<List<TopCustomer>> GetTopCustomersAsync(int top);
    }
}