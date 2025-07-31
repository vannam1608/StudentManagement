// Models/Semester.cs
using StudentManagementAPI.Models;

public class Semester
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsOpen { get; set; } = true;

    public ICollection<CourseClass>? CourseClasses { get; set; }
}