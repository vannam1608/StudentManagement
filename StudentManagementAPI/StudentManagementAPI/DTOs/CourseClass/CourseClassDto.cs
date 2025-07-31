namespace StudentManagementAPI.DTOs.CourseClass
{
    public class CourseClassDto
    {
        public int Id { get; set; }
        public string ClassCode { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;

        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;

        public int SemesterId { get; set; }
        public string SemesterName { get; set; } = string.Empty;

        public string? Schedule { get; set; }
        public int? MaxStudents { get; set; }
        public int? RegisteredCount { get; set; } // Optional: số lượng sinh viên đã đăng ký
    }
}
