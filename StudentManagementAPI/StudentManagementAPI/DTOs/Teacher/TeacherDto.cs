namespace StudentManagementAPI.DTOs.Teacher
{
    public class TeacherDto
    {
        public int Id { get; set; }
        public string TeacherCode { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

}
