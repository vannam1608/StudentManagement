public class ScoreDto
{
    public int Id { get; set; }
    public int EnrollmentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public double? Midterm { get; set; }
    public double? Final { get; set; }
    public double? Other { get; set; }
    public double Total { get; set; }

    public string SubjectName { get; set; } = string.Empty;
    public string ClassCode { get; set; } = string.Empty;

    // ✅ Thêm thuộc tính này để chứa tên học kỳ
    public string SemesterName { get; set; } = string.Empty;
}