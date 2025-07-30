export interface CourseClassDto {
  id: number;
  classCode: string;

  subjectId: number;
  subjectName: string;

  teacherId: number;
  teacherName: string;

  semesterId: number;
  semesterName: string;

  schedule?: string;
  maxStudents?: number;
  registeredCount?: number;
}

export interface CreateCourseClassDto {
  classCode: string;
  subjectId: number;
  teacherId: number;
  semesterId: number;
  schedule?: string;
  maxStudents?: number;
}
