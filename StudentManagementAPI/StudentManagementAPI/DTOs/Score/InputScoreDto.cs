// DTOs/Score/InputScoreDto.cs
namespace StudentManagementAPI.DTOs.Score
{
    public class InputScoreDto
    {
        public int EnrollmentId { get; set; }
        public float? Midterm { get; set; }
        public float? Final { get; set; }
        public float? Other { get; set; }
    }
}
