export interface SubjectDto {
  id: number;
  subjectCode: string;
  name: string;
  description: string;
  credit: number;
}

export interface CreateSubjectDto {
  subjectCode: string;
  name: string;
  credit: number;
  description?: string;
}

export interface RegisterSubjectDto {
  studentId: number;
  courseClassId: number;
}


