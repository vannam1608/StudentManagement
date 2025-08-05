namespace StudentManagementAPI.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public string SubjectCode { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Credit { get; set; }


        public int SemesterId { get; set; }
        public Semester Semester { get; set; } = null!;
        // 🔧 THÊM DÒNG NÀY
        public ICollection<CourseClass> CourseClasses { get; set; } = new List<CourseClass>();
    }
}
