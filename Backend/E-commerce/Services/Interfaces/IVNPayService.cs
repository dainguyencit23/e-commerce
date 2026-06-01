namespace E_commerce.Services.Interfaces
{
    public interface IVNPayService
{
    string CreatePaymentUrl(Guid orderId, decimal amount, string orderInfo, string ipAddress);
    bool ValidateCallback(IQueryCollection queryParams, out string transactionStatus);
}

}