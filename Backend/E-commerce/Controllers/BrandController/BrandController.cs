using E_commerce.Data;
using E_commerce.DTOs.Brand;
using E_commerce.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_commerce.Controllers.BrandController
{
    [Route("api/brands")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/brands
        [HttpGet]
        public async Task<IActionResult> GetBrands()
        {
            var brands = await _context.Brands
                .Select(b => new BrandResponse
                {
                    Id = b.Id,
                    Name = b.Name
                })
                .ToListAsync();

            return Ok(brands);
        }

        // POST: api/brands
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateBrand(BrandRequest request)
        {
            var brand = new Brand
            {
                Id = Guid.NewGuid(),
                Name = request.Name
            };

            await _context.Brands.AddAsync(brand);

            await _context.SaveChangesAsync();

            return Ok(new BrandResponse
            {
                Id = brand.Id,
                Name = brand.Name
            });
        }

        // PUT: api/brands/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBrand(Guid id, BrandRequest request)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound("Brand not found.");
            }

            brand.Name = request.Name;

            await _context.SaveChangesAsync();

            return Ok(new BrandResponse
            {
                Id = brand.Id,
                Name = brand.Name
            });
        }

        // DELETE: api/brands/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBrand(Guid id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound("Brand not found.");
            }

            _context.Brands.Remove(brand);

            await _context.SaveChangesAsync();

            return Ok("Brand deleted successfully.");
        }
    }
}