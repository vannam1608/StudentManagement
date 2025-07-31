// Models/EducationProgram.cs
using StudentManagementAPI.Models;

public class EducationProgram
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Student>? Students { get; set; }
}