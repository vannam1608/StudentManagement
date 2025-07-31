using Microsoft.EntityFrameworkCore;

namespace StudentManagementAPI.Shared
{
    public static class Extensions
    {
        public static async Task<List<T>> ToPagedListAsync<T>(this IQueryable<T> source, int pageNumber, int pageSize)
        {
            return await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }
    }
}
