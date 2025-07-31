using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagementAPI.Models
{
    public class Teacher
    {
        // ID là khoá chính kiêm khóa ngoại đến bảng Users
        [ForeignKey("User")]
        public int Id { get; set; }

        public string TeacherCode { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;

        // Navigation đến bảng Users (1-1)
        public User? User { get; set; }

        // Navigation đến lớp học phần
        public ICollection<CourseClass>? CourseClasses { get; set; }
    }
}
