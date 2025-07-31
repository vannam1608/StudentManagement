public class StudentDto
{
    public int Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string ProgramName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty; // 🔴 Thêm dòng này
}
