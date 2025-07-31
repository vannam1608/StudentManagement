// DTOs/Subject/CreateSubjectDto.cs
using System;

namespace StudentManagementAPI.DTOs.Subject
{
    public class CreateSubjectDto
    {
        public string SubjectCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Credit { get; set; }
        public string? Description { get; set; }
    }
}
