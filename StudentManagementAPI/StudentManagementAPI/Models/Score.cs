using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagementAPI.Models
{
    public class Score
    {
        public int Id { get; set; }
        public int EnrollmentId { get; set; }

        // ✅ Sử dụng double để tương thích với kiểu FLOAT trong SQL
        public double? Midterm { get; set; }
        public double? Final { get; set; }
        public double? Other { get; set; }

        // ✅ Không ánh xạ sang DB, tính toán trong runtime
        [NotMapped]
        public double Total { get; private set; }

        public Enrollment? Enrollment { get; set; }

        public void CalculateTotal()
        {
            Total = Math.Round((Midterm ?? 0) * 0.3 + (Other ?? 0) * 0.2 + (Final ?? 0) * 0.5, 2);
        }
    }
}
