// DTOs/Department/DepartmentDto.cs
namespace StudentManagementAPI.DTOs.Department
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }
}
