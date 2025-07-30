import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../../shared/services/schedule.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  scheduleList: any[] = [];
  groupedSchedules: { semester: string, schedules: any[] }[] = []; // ✅ Khai báo biến
  loading = true;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.scheduleService.getStudentSchedule().subscribe({
      next: (data) => {
        this.scheduleList = data;
        this.groupBySemester(); // ✅ Gọi hàm nhóm theo học kỳ
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải lịch học:', err);
        this.loading = false;
      }
    });
  }

  // ✅ Hàm nhóm lịch học theo học kỳ
  groupBySemester() {
    const map = new Map<string, any[]>();

    for (const item of this.scheduleList) {
      const semester = item.semester ?? 'Khác';
      if (!map.has(semester)) {
        map.set(semester, []);
      }
      map.get(semester)!.push(item);
    }

    this.groupedSchedules = Array.from(map.entries()).map(([semester, schedules]) => ({
      semester,
      schedules
    }));
  }
}
