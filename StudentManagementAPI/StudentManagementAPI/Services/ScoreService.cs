using AutoMapper;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.Interfaces.Repositories;
using StudentManagementAPI.Interfaces.Services;
using StudentManagementAPI.Models;
using StudentManagementAPI.Models.Common;

namespace StudentManagementAPI.Services
{
    public class ScoreService : IScoreService
    {
        private readonly IScoreRepository _scoreRepository;
        private readonly IEnrollmentRepository _enrollmentRepository;
        private readonly IMapper _mapper;

        public ScoreService(
            IScoreRepository scoreRepository,
            IEnrollmentRepository enrollmentRepository,
            IMapper mapper)
        {
            _scoreRepository = scoreRepository;
            _enrollmentRepository = enrollmentRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ScoreDto>> GetAllAsync()
        {
            var scores = await _scoreRepository.GetAllAsync();

            return scores.Select(score =>
            {
                score.CalculateTotal();
                return new ScoreDto
                {
                    Id = score.Id,
                    EnrollmentId = score.EnrollmentId,
                    StudentCode = score.Enrollment.Student.StudentCode,
                    FullName = score.Enrollment.Student.User.FullName,
                    Midterm = score.Midterm,
                    Final = score.Final,
                    Other = score.Other,
                    Total = score.Total,
                    SubjectName = score.Enrollment.CourseClass.Subject?.Name ?? string.Empty,
                    ClassCode = score.Enrollment.CourseClass.ClassCode
                };
            });
        }

        public async Task<ScoreDto?> GetByEnrollmentIdAsync(int enrollmentId)
        {
            var score = await _scoreRepository.GetByEnrollmentIdAsync(enrollmentId);
            if (score == null) return null;

            score.CalculateTotal();
            return new ScoreDto
            {
                Id = score.Id,
                EnrollmentId = score.EnrollmentId,
                StudentCode = score.Enrollment.Student.StudentCode,
                Midterm = score.Midterm,
                Final = score.Final,
                Other = score.Other,
                Total = score.Total,
                SubjectName = score.Enrollment.CourseClass.Subject?.Name ?? string.Empty,
                ClassCode = score.Enrollment.CourseClass.ClassCode
            };
        }

        public async Task<IEnumerable<ScoreDto>> GetByStudentIdAsync(int studentId)
        {
            var scores = await _scoreRepository.GetByStudentIdAsync(studentId);

            return scores.Select(score =>
            {
                score.CalculateTotal();
                return new ScoreDto
                {
                    Id = score.Id,
                    EnrollmentId = score.EnrollmentId,
                    StudentCode = score.Enrollment.Student.StudentCode,
                    Midterm = score.Midterm,
                    Final = score.Final,
                    Other = score.Other,
                    Total = score.Total,
                    SubjectName = score.Enrollment.CourseClass.Subject?.Name ?? string.Empty,
                    ClassCode = score.Enrollment.CourseClass.ClassCode
                };
            });
        }

        public async Task<ScoreDto?> GetByStudentAndSubjectAsync(int studentId, int subjectId)
        {
            var score = await _scoreRepository.GetByStudentAndSubjectAsync(studentId, subjectId);
            if (score == null) return null;

            score.CalculateTotal();
            return new ScoreDto
            {
                Id = score.Id,
                EnrollmentId = score.EnrollmentId,
                StudentCode = score.Enrollment.Student.StudentCode,
                Midterm = score.Midterm,
                Final = score.Final,
                Other = score.Other,
                Total = score.Total,
                SubjectName = score.Enrollment.CourseClass.Subject?.Name ?? string.Empty,
                ClassCode = score.Enrollment.CourseClass.ClassCode
            };
        }

        public async Task<bool> InputScoreAsync(InputScoreDto dto)
        {
            var score = await _scoreRepository.GetByEnrollmentIdAsync(dto.EnrollmentId);
            if (score == null) return false;

            score.Midterm = dto.Midterm;
            score.Final = dto.Final;
            score.Other = dto.Other;

            score.CalculateTotal();

            _scoreRepository.Update(score);
            await _scoreRepository.SaveChangesAsync();

            return true;
        }

        public async Task<int> CreateMissingScoresAsync()
        {
            var enrollments = await _enrollmentRepository.GetAllAsync();
            int count = 0;

            foreach (var e in enrollments)
            {
                var existing = await _scoreRepository.GetByEnrollmentIdAsync(e.Id);
                if (existing == null)
                {
                    var newScore = new Score
                    {
                        EnrollmentId = e.Id,
                        Midterm = null,
                        Final = null,
                        Other = null
                    };
                    await _scoreRepository.AddAsync(newScore);
                    count++;
                }
            }

            if (count > 0)
                await _scoreRepository.SaveChangesAsync();

            return count;
        }

        public async Task<IEnumerable<ScoreDto>> GetScoresByTeacherIdAsync(int teacherId)
        {
            var scores = await _scoreRepository.GetByTeacherIdAsync(teacherId);

            foreach (var score in scores)
            {
                score.CalculateTotal(); // Đảm bảo tính lại Total trước khi map
            }

            return _mapper.Map<IEnumerable<ScoreDto>>(scores);
        }

        public async Task<PaginatedResult<ScoreDto>> GetPagedAsync(int page, int pageSize, string? studentCode, string? classCode)
        {
            var (scores, totalItems) = await _scoreRepository.GetPagedAsync(page, pageSize, studentCode, classCode);

            foreach (var s in scores)
                s.CalculateTotal();

            var dtos = _mapper.Map<IEnumerable<ScoreDto>>(scores);

            return new PaginatedResult<ScoreDto>
            {
                Data = dtos,
                TotalItems = totalItems,
                CurrentPage = page,
                PageSize = pageSize
            };
        }




            public async Task<IEnumerable<SemesterScoreDto>> GetScoresGroupedBySemesterAsync(int studentId)
            {
                var scores = await _scoreRepository.GetByStudentIdAsync(studentId);

                foreach (var score in scores)
                    score.CalculateTotal();

                var grouped = scores
                    .GroupBy(s => s.Enrollment.CourseClass.Semester.Name) // Giả định bạn muốn group theo Semester.Name
                    .Select(g => new SemesterScoreDto
                    {
                        SemesterName = g.Key,
                        Scores = g.Select(score => new ScoreDto
                        {
                            Id = score.Id,
                            EnrollmentId = score.EnrollmentId,
                            StudentCode = score.Enrollment.Student.StudentCode,
                            FullName = score.Enrollment.Student.User.FullName,
                            Midterm = score.Midterm,
                            Final = score.Final,
                            Other = score.Other,
                            Total = score.Total,
                            SubjectName = score.Enrollment.CourseClass.Subject?.Name ?? string.Empty,
                            ClassCode = score.Enrollment.CourseClass.ClassCode
                        }).ToList()
                    });

                return grouped;
            }



    }
}
