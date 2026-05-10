using E_commerce.Models;

namespace E_commerce.Repositories.Interfaces
{
    public interface IVoucherRepository
    {
        Task<Voucher?> GetById(Guid id);
        Task<Voucher?> GetByCode(string code);
        Task<List<Voucher>> GetAll();
        Task Add(Voucher voucher);
        void Remove(Voucher voucher);
        Task<bool> SaveChanges();
    }
}
