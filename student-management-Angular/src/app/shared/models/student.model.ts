export interface StudentDto {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: Date;
  departmentName: string;
  programName: string;
}

export interface CreateStudentDto {
  studentCode: string;
  dateOfBirth: Date;
  gender: string;
  departmentId: number;
  programId: number;
  fullName: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
}

export interface UpdateStudentDto {
  fullName: string;
  email?: string;
  phone?: string;
  gender: string;
  dateOfBirth: Date;
  departmentId: number;
  programId: number;
}
