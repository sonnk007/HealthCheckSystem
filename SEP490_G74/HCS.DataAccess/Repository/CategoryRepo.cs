using HCS.ApplicationContext;
using HCS.DataAccess.IRepository;
using HCS.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace HCS.DataAccess.Repository;

public interface ICategoryRepo : IGenericRepo<Category>
{
    Task<List<Category>> GetCategories();
    Task<bool> RemoveCategoryById(int id);
    Task<Category?> GetCategoryByServiceId(int id);
}

public class CategoryRepo : GenericRepo<Category>, ICategoryRepo
{
    public CategoryRepo(HCSContext context) : base(context)
    {
    }

    public Task<List<Category>> GetCategories()
    {
        return _dbSet.ToListAsync();
    }

    public async Task<bool> RemoveCategoryById(int id)
    {
        var category = await _dbSet.FindAsync(id);
        if(category is null)
        {
            return false;
        }
        else
        {
            category.IsDeleted = !category.IsDeleted;
            return true;
        }
    }

    public async Task<Category?> GetCategoryByServiceId(int id)
    {
        var service =  await _context.Services.Include(s => s.ServiceType).ThenInclude(t => t.Category)
            .FirstOrDefaultAsync(s => s.ServiceId == id);
        if(service is null || service.ServiceType is null || service.ServiceType.Category is null)
        {
            return null;
        }
        else
        {
            return service.ServiceType.Category;
        }
    }
}