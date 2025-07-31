// Models/CourseClass.cs
using StudentManagementAPI.Models;

public class CourseClass
{
    public int Id { get; set; }
    public string ClassCode { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public int TeacherId { get; set; }
    public int SemesterId { get; set; }
    public string? Schedule { get; set; }
    public int? MaxStudents { get; set; }

    public Subject? Subject { get; set; }
    public Teacher? Teacher { get; set; }
    public Semester? Semester { get; set; }
    public ICollection<Enrollment>? Enrollments { get; set; }

}

