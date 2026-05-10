using E_commerce.Data;
using E_commerce.Models;
using E_commerce.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Repositories
{
    public class VoucherRepository: IVoucherRepository
    {
        private readonly AppDbContext _context;
        public VoucherRepository(AppDbContext context) 
        {
            _context = context;
        }
        public async Task<Voucher?> GetById(Guid id)
            => await _context.Vouchers.FindAsync(id);
        public async Task<Voucher?> GetByCode(string code)
            => await _context.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
        public async Task<List<Voucher>> GetAll()
            => await _context.Vouchers.ToListAsync();
        public async Task Add(Voucher voucher)
            => await _context.Vouchers.AddAsync(voucher);
        public async void Remove(Voucher voucher)
            => _context.Vouchers.Remove(voucher);
        public async Task<bool> SaveChanges()
            => await _context.SaveChangesAsync() > 0;
    }
}
