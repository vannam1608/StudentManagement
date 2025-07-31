// DTOs/Semester/SemesterDto.cs
using System;

namespace StudentManagementAPI.DTOs.Semester
{
    public class SemesterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsOpen { get; set; }
    }
}
