export interface EnrollmentDto {
  id: number;
  studentId: number;
  studentCode: string;
  fullName: string;
  courseClassId: number;
  classCode: string;
  enrollDate: Date;
  subjectName: string;
  subjectCode: string;
  semesterId: number; 
  semesterName: string;
  schedule: string;
}



export interface CreateEnrollmentDto {
  studentId: number;
  courseClassId: number;
}
