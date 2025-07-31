namespace StudentManagementAPI.DTOs.CourseClass
{
    public class CreateCourseClassDto
    {
        public string ClassCode { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public int TeacherId { get; set; }
        public int SemesterId { get; set; }
        public string? Schedule { get; set; }
        public int? MaxStudents { get; set; }
    }
}
