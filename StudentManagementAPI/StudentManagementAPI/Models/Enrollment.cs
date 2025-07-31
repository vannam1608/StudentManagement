// Models/Enrollment.cs
using StudentManagementAPI.Models;

public class Enrollment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int CourseClassId { get; set; }
    public DateTime EnrollDate { get; set; } = DateTime.Now;

    public Student? Student { get; set; }
    public CourseClass? CourseClass { get; set; }
    public Score? Score { get; set; }
}
