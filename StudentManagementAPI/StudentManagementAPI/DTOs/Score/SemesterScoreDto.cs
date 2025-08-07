namespace StudentManagementAPI.DTOs.Score
{
    public class SemesterScoreDto
    {
        public string SemesterName { get; set; } = string.Empty;
        public List<ScoreDto> Scores { get; set; } = new();
    }
}
