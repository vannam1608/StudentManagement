namespace StudentManagementAPI.DTOs.Student
{
    public class UpdateStudentDto
    {
        public string StudentCode { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public int DepartmentId { get; set; }
        public int ProgramId { get; set; }
    }

}
