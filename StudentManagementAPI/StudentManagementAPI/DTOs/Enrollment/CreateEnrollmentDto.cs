// DTOs/Enrollment/CreateEnrollmentDto.cs
namespace StudentManagementAPI.DTOs.Enrollment
{
    public class CreateEnrollmentDto
    {
        public int StudentId { get; set; }
        public int CourseClassId { get; set; }
    }
}
