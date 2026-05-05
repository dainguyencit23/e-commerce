using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using E_commerce.Data;
using E_commerce.Models;
using E_commerce.DTOs.Category;

namespace E_commerce.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/categories
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Categories
                .Select(c => new CategoryResponse
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST: api/categories (Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create(CategoryRequest request)
        {
            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = request.Name
            };

            _context.Categories.Add(category);
            _context.SaveChanges();

            return Ok(category);
        }

        // ✅ PUT: api/categories/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(Guid id, CategoryRequest request)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            category.Name = request.Name;
            _context.SaveChanges();

            return Ok(category);
        }

        // ✅ DELETE: api/categories/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(Guid id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return Ok();
        }
    }
}