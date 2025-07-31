// DTOs/EducationProgram/EducationProgramDto.cs
namespace StudentManagementAPI.DTOs.EducationProgram
{
    public class EducationProgramDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }
}
