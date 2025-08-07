using AutoMapper;
using StudentManagementAPI.DTOs.CourseClass;
using StudentManagementAPI.DTOs.Department;
using StudentManagementAPI.DTOs.EducationProgram;
using StudentManagementAPI.DTOs.Enrollment;
using StudentManagementAPI.DTOs.Notification;
using StudentManagementAPI.DTOs.Schedule;
using StudentManagementAPI.DTOs.Score;
using StudentManagementAPI.DTOs.Semester;
using StudentManagementAPI.DTOs.Student;
using StudentManagementAPI.DTOs.Subject;
using StudentManagementAPI.DTOs.Teacher;
using StudentManagementAPI.DTOs.User;
using StudentManagementAPI.Models;

namespace StudentManagementAPI.Shared
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ✅ Student
            CreateMap<Student, StudentDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name))
                .ForMember(dest => dest.ProgramName, opt => opt.MapFrom(src => src.Program.Name));
            CreateMap<StudentDto, Student>();
            CreateMap<CreateStudentDto, Student>();
            CreateMap<UpdateStudentDto, Student>();

            // ✅ Subject
            CreateMap<Subject, SubjectDto>()
                .ForMember(dest => dest.SemesterId, opt => opt.MapFrom(src => src.SemesterId))
                .ForMember(dest => dest.SemesterName, opt => opt.MapFrom(src => src.Semester != null ? src.Semester.Name : ""))
                .ReverseMap();


            CreateMap<CreateSubjectDto, Subject>();

            // ✅ Teacher
            CreateMap<Teacher, TeacherDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.TeacherCode, opt => opt.MapFrom(src => src.TeacherCode))
                .ForMember(dest => dest.Degree, opt => opt.MapFrom(src => src.Degree));

            // ✅ CourseClass
            CreateMap<CourseClass, CourseClassDto>()
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.User.FullName))
                .ForMember(dest => dest.SemesterName, opt => opt.MapFrom(src => src.Semester.Name))
                .ForMember(dest => dest.RegisteredCount, opt => opt.MapFrom(src => src.Enrollments != null ? src.Enrollments.Count : 0));
            CreateMap<CourseClassDto, CourseClass>();
            CreateMap<CreateCourseClassDto, CourseClass>();

            // ✅ Enrollment
            CreateMap<Enrollment, EnrollmentDto>()
                .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.Student.StudentCode)) 
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Student.User.FullName))
                .ForMember(dest => dest.ClassCode, opt => opt.MapFrom(src => src.CourseClass.ClassCode))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.CourseClass.Subject.Name))
                .ForMember(dest => dest.SubjectCode, opt => opt.MapFrom(src => src.CourseClass.Subject.SubjectCode))
                .ForMember(dest => dest.SemesterName, opt => opt.MapFrom(src => src.CourseClass.Semester.Name))
                .ForMember(dest => dest.Schedule, opt => opt.MapFrom(src => src.CourseClass.Schedule));
            CreateMap<EnrollmentDto, Enrollment>();
            CreateMap<CreateEnrollmentDto, Enrollment>();

            // ✅ Score
            CreateMap<Score, ScoreDto>()
                .ForMember(dest => dest.StudentCode, opt => opt.MapFrom(src => src.Enrollment.Student.StudentCode ?? ""))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Enrollment.Student.User.FullName ?? ""))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Enrollment.CourseClass.Subject.Name ?? ""))
                .ForMember(dest => dest.ClassCode, opt => opt.MapFrom(src => src.Enrollment.CourseClass.ClassCode ?? ""));
            CreateMap<ScoreDto, Score>();
            CreateMap<InputScoreDto, Score>();

            // ✅ Schedule
            CreateMap<CourseClass, ScheduleDto>()
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
                .ForMember(dest => dest.ClassCode, opt => opt.MapFrom(src => src.ClassCode))
                .ForMember(dest => dest.Schedule, opt => opt.MapFrom(src => src.Schedule))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.User.FullName))
                .ForMember(dest => dest.Semester, opt => opt.MapFrom(src => src.Semester.Name));
            CreateMap<ScheduleDto, CourseClass>();

            // ✅ Notification
            CreateMap<Notification, NotificationDto>()
                .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator != null ? src.Creator.FullName : ""));
            CreateMap<CreateNotificationDto, Notification>();

            // ✅ User
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UpdateUserDto, User>();
            CreateMap<User, UserCredentialDto>();

            // ✅ Department
            CreateMap<Department, DepartmentDto>()
                .ForMember(dest => dest.StudentCount, opt => opt.MapFrom(src => src.Students!.Count));
            CreateMap<CreateDepartmentDto, Department>();

            // ✅ Semester
            CreateMap<Semester, SemesterDto>();
            CreateMap<CreateSemesterDto, Semester>().ReverseMap();

            // ✅ EducationProgram
            CreateMap<EducationProgram, EducationProgramDto>()
                .ForMember(dest => dest.StudentCount, opt => opt.MapFrom(src => src.Students.Count));
            CreateMap<CreateEducationProgramDto, EducationProgram>();
        }
    }
}
