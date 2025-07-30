export interface SemesterDto {
  id: number;
  name: string;
  startDate: string;  // ISO date string
  endDate: string;
  isOpen: boolean;
}

export interface CreateSemesterDto {
  name: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}
