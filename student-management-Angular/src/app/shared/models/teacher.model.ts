// src/app/shared/models/teacher.model.ts
export interface TeacherDto {
  id: number;
  teacherCode: string;
  username: string;
  fullName: string;
  degree: string;
  email: string;
  phone: string;
}

export interface CreateTeacherDto {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  teacherCode: string;
  degree: string;
}
