namespace StudentManagementAPI.DTOs.Enrollment
{
    public class EnrollmentDto
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;

        public int CourseClassId { get; set; }
        public string ClassCode { get; set; } = string.Empty;

        public DateTime EnrollDate { get; set; }

        // ✅ Bổ sung để hỗ trợ hiển thị môn học và học kỳ
        public string SubjectCode { get; set; } = string.Empty;

        public string SubjectName { get; set; } = string.Empty;
        public string SemesterName { get; set; } = string.Empty;
        public string Schedule { get; set; } = string.Empty;
    }
}
