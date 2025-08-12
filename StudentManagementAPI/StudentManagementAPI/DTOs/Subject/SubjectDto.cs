using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagementAPI.DTOs.Subject
{
    public class SubjectDto
    {
        public int Id { get; set; }
        public string SubjectCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Credit { get; set; }

        public int SemesterId { get; set; } 

        public string? SemesterName { get; set; } 
    }
}