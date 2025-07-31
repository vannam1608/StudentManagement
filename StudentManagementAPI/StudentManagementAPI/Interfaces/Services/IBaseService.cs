namespace StudentManagementAPI.Interfaces.Services
{
    public interface IBaseService<TDto, TCreateDto>
    {
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TCreateDto dto);
        Task<bool> UpdateAsync(int id, TCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
