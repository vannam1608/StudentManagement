export interface ScheduleDto {
  subjectName: string;
  classCode: string;
  schedule: string;
  teacherName: string;
  semester: string;

  // ✅ Thêm ngày học chi tiết (tùy bạn muốn string hay array)
  studyDays?: string; // VD: "Thứ 2, Thứ 4"
  studyDates?: string[]; // VD: ["2025-08-01", "2025-08-08", "2025-08-15"]
}
