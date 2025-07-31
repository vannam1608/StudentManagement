  export interface ScoreDto {
    id: number;
    enrollmentId: number;
    studentCode: string;
    fullName: string;
    midterm?: number;
    final?: number;
    other?: number;
    total: number;

    subjectName: string;
    classCode: string;

    semesterName: string;
  }

  export interface InputScoreDto {
    enrollmentId: number;
    midterm?: number;
    final?: number;
    other?: number;
  }

