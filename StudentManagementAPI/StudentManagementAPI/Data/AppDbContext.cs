using Microsoft.EntityFrameworkCore;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<EducationProgram> EducationPrograms { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<CourseClass> CourseClasses { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Score> Scores { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Student)
                .WithOne(s => s.User)
                .HasForeignKey<Student>(s => s.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Teacher)
                .WithOne(t => t.User)
                .HasForeignKey<Teacher>(t => t.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Enrollment>()
                .HasIndex(e => new { e.StudentId, e.CourseClassId })
                .IsUnique();

            modelBuilder.Entity<Score>()
                .Property(s => s.Total)
                .HasComputedColumnSql("ROUND(ISNULL(Midterm,0)*0.3 + ISNULL(Other,0)*0.2 + ISNULL(Final,0)*0.5, 2)");

            modelBuilder.Entity<Notification>()
                .Property(n => n.TargetRole)
                .HasDefaultValue("All");

            modelBuilder.Entity<Semester>()
                .Property(s => s.IsOpen)
                .HasDefaultValue(true);

            modelBuilder.Entity<Notification>()
                .Property(n => n.TargetRole)
                .HasDefaultValue("All");
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Creator)
                .WithMany()
                .HasForeignKey(n => n.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);


        }


    }
}
