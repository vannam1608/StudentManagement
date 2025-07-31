// Models/Student.cs
using StudentManagementAPI.Models;

public class Student
{
    public int Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int ProgramId { get; set; }

    public User? User { get; set; }
    public Department? Department { get; set; }
    public EducationProgram? Program { get; set; }
    public ICollection<Enrollment>? Enrollments { get; set; }
}