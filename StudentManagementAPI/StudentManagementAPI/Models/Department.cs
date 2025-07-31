// Models/Department.cs
using StudentManagementAPI.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Student>? Students { get; set; }
}