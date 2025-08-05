export interface StudentDto {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  departmentName: string;
  programName: string;

  // ➕ Thêm nếu cần cập nhật từ giao diện:
  departmentId?: number;
  programId?: number;
}


export interface CreateStudentDto {
  studentCode: string;
  dateOfBirth: string;
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
  studentCode: string; 
  fullName: string;
  email?: string;
  phone?: string;
  gender: string;
  dateOfBirth: string;
  departmentId: number;
  programId: number;
}

