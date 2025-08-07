import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../shared/services/schedule.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  scheduleList: any[] = [];
  groupedSchedules: { semester: string, schedules: any[] }[] = []; 
  weeklySchedule: { [key: string]: any[] } = {}; 
  currentWeekDays: Date[] = []; 
  currentWeekOffset: number = 0; // ✅ Offset từ tuần hiện tại (0 = tuần này, -1 = tuần trước, 1 = tuần sau)
  viewMode: 'semester' | 'weekly' = 'semester'; 
  currentSemester: string = ''; // ✅ Mặc định rỗng để hiển thị tất cả học kỳ 
  availableSemesters: string[] = []; 
  semesterInfo: { [key: string]: { startDate: Date, endDate: Date } } = {}; // ✅ Thông tin thời gian học kỳ
  loading = true;

  // ✅ Danh sách ngày trong tuần
  dayNames = [
    { key: 'monday', name: 'Thứ 2', shortName: 'T2' },
    { key: 'tuesday', name: 'Thứ 3', shortName: 'T3' },
    { key: 'wednesday', name: 'Thứ 4', shortName: 'T4' },
    { key: 'thursday', name: 'Thứ 5', shortName: 'T5' },
    { key: 'friday', name: 'Thứ 6', shortName: 'T6' },
    { key: 'saturday', name: 'Thứ 7', shortName: 'T7' },
    { key: 'sunday', name: 'Chủ nhật', shortName: 'CN' }
  ];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.initializeCurrentWeek(); // ✅ Khởi tạo tuần hiện tại
    
    this.scheduleService.getStudentSchedule().subscribe({
      next: (data) => {
        console.log('Dữ liệu lịch học nhận được:', data);
        this.scheduleList = data || [];
        this.extractAvailableSemesters(); // ✅ Trích xuất danh sách học kỳ
        this.groupBySemester(); // ✅ Gọi hàm nhóm theo học kỳ
        this.groupByWeeklySchedule(); // ✅ Gọi hàm nhóm theo tuần
        this.loading = false;
        
        console.log('Grouped schedules:', this.groupedSchedules);
        console.log('Weekly schedule:', this.weeklySchedule);
      },
      error: (err) => {
        console.error('Lỗi khi tải lịch học:', err);
        this.scheduleList = [];
        this.extractAvailableSemesters(); // ✅ Trích xuất danh sách học kỳ
        this.groupBySemester();
        this.groupByWeeklySchedule();
        this.loading = false;
      }
    });
  }

  // ✅ Trích xuất danh sách học kỳ có sẵn
  extractAvailableSemesters() {
    const semesterSet = new Set<string>();
    this.scheduleList.forEach(item => {
      if (item.semester) {
        semesterSet.add(item.semester);
      }
    });
    this.availableSemesters = Array.from(semesterSet).sort().reverse(); // Học kỳ mới nhất trước
    
    // Khởi tạo thông tin thời gian học kỳ
    this.initializeSemesterInfo();
    
    // Tự động xác định học kỳ hiện tại dựa vào ngày (chỉ khi chưa có lựa chọn)
    if (!this.currentSemester) {
      this.currentSemester = this.getCurrentSemesterByDate();
    }
  }

  // ✅ Khởi tạo thông tin thời gian của các học kỳ
  initializeSemesterInfo() {
    // Dựa vào dữ liệu bạn cung cấp
    this.semesterInfo = {
      'HK1 2025': {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-07-15')
      },
      'HK2 2025': {
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-30')
      },
      'HK1 2026': {
        startDate: new Date('2026-01-10'),
        endDate: new Date('2026-05-05')
      },
    };
  }

  // ✅ Xác định học kỳ hiện tại dựa vào ngày
  getCurrentSemesterByDate(): string {
    const today = new Date();
    
    for (const [semester, info] of Object.entries(this.semesterInfo)) {
      if (today >= info.startDate && today <= info.endDate) {
        return semester;
      }
    }
    
    // Nếu không tìm thấy, trả về học kỳ mới nhất có sẵn
    return this.availableSemesters.length > 0 ? this.availableSemesters[0] : 'HK2 2024-2025';
  }

  // ✅ Kiểm tra tuần có trong khoảng thời gian học kỳ không
  isWeekInSemester(weekDays: Date[], semester: string): boolean {
    const semesterInfo = this.semesterInfo[semester];
    if (!semesterInfo) return true; // Nếu không có thông tin thì cho phép xem
    
    const weekStart = weekDays[0]; // Thứ 2
    const weekEnd = weekDays[6]; // Chủ nhật
    
    // Kiểm tra xem tuần có giao với khoảng thời gian học kỳ không
    return weekStart <= semesterInfo.endDate && weekEnd >= semesterInfo.startDate;
  }

  // ✅ Lấy thông tin hiển thị về khoảng thời gian học kỳ
  getSemesterDateRange(semester: string): string {
    const semesterInfo = this.semesterInfo[semester];
    if (!semesterInfo) return '';
    
    const startStr = semesterInfo.startDate.toLocaleDateString('vi-VN');
    const endStr = semesterInfo.endDate.toLocaleDateString('vi-VN');
    return `(${startStr} - ${endStr})`;
  }

  // ✅ Chuyển đổi học kỳ trong view tuần
  switchSemester(semester: string) {
    this.currentSemester = semester;
    this.groupByWeeklySchedule(); // Cập nhật lại lịch tuần
  }

  // ✅ Handle semester change event
  onSemesterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.currentSemester = target.value;
      this.groupByWeeklySchedule(); // Cập nhật lại lịch tuần
    }
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

  // ✅ Tính tổng số môn học
  getTotalSubjects(): number {
    return this.scheduleList.length;
  }

  // ✅ Tính tổng số tín chỉ
  getTotalCredits(): number {
    return this.scheduleList.reduce((total, item) => {
      return total + (item.credits || 3);
    }, 0);
  }

  // ✅ Khởi tạo tuần hiện tại
  initializeCurrentWeek() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Tính offset đến thứ 2
    
    this.currentWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i + (this.currentWeekOffset * 7));
      this.currentWeekDays.push(date);
    }
  }

  // ✅ Chuyển sang tuần trước
  goToPreviousWeek() {
    this.currentWeekOffset--;
    this.initializeCurrentWeek();
  }

  // ✅ Chuyển sang tuần sau
  goToNextWeek() {
    this.currentWeekOffset++;
    this.initializeCurrentWeek();
  }

  // ✅ Quay về tuần hiện tại
  goToCurrentWeek() {
    this.currentWeekOffset = 0;
    this.initializeCurrentWeek();
  }

  // ✅ Lấy tiêu đề tuần
  getWeekTitle(): string {
    let title = '';
    
    if (this.currentWeekOffset === 0) {
      title = 'Tuần hiện tại';
    } else if (this.currentWeekOffset === -1) {
      title = 'Tuần trước';
    } else if (this.currentWeekOffset === 1) {
      title = 'Tuần sau';
    } else if (this.currentWeekOffset < 0) {
      title = `${Math.abs(this.currentWeekOffset)} tuần trước`;
    } else {
      title = `${this.currentWeekOffset} tuần sau`;
    }
    
    // Kiểm tra tuần có trong khoảng học kỳ không
    if (!this.isWeekInSemester(this.currentWeekDays, this.currentSemester)) {
      title += ' (Ngoài thời gian học kỳ)';
    }
    
    return title;
  }

  // ✅ Nhóm lịch học theo ngày trong tuần
  groupByWeeklySchedule() {
    // Reset weekly schedule
    this.weeklySchedule = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    // Lọc lấy môn học của học kỳ hiện tại (hoặc tất cả nếu không chọn học kỳ)
    const currentSemesterSchedules = this.currentSemester 
      ? this.scheduleList.filter(item => item.semester && item.semester === this.currentSemester)
      : this.scheduleList;

    // Phân loại lịch học theo ngày
    currentSemesterSchedules.forEach(item => {
      const dayKeys = this.parseDaysFromSchedule(item.schedule);
      
      // Thêm môn học vào tất cả các ngày trong khoảng thời gian
      dayKeys.forEach(dayKey => {
        if (dayKey && this.weeklySchedule[dayKey]) {
          // Thêm thông tin buổi học (sáng/trưa/tối)
          const timeSlot = this.getTimeSlot(item.schedule);
          const enhancedItem = { ...item, timeSlot };
          this.weeklySchedule[dayKey].push(enhancedItem);
        }
      });
    });

    // Sắp xếp theo thời gian cho mỗi ngày
    Object.keys(this.weeklySchedule).forEach(day => {
      const daySchedule = this.weeklySchedule[day];
      if (daySchedule && daySchedule.length > 0) {
        daySchedule.sort((a, b) => {
          const timeA = this.parseTimeFromSchedule(a.schedule);
          const timeB = this.parseTimeFromSchedule(b.schedule);
          return timeA.localeCompare(timeB);
        });
      }
    });
  }

  // ✅ Phân tích ngày từ chuỗi lịch học - trả về mảng các ngày
  parseDaysFromSchedule(schedule: string): string[] {
    if (!schedule) return [];
    
    const lowerSchedule = schedule.toLowerCase();
    const days: string[] = [];
    
    // Xử lý các ngày được phân cách bằng dấu gạch ngang (ví dụ: T2-T6 = Thứ 2 và Thứ 6)
    const dashMatch = lowerSchedule.match(/t(\d)-t(\d)/);
    if (dashMatch) {
      const firstDay = parseInt(dashMatch[1]);
      const secondDay = parseInt(dashMatch[2]);
      
      const firstDayKey = this.getDayKeyFromNumber(firstDay);
      const secondDayKey = this.getDayKeyFromNumber(secondDay);
      
      if (firstDayKey) days.push(firstDayKey);
      if (secondDayKey) days.push(secondDayKey);
      
      return days;
    }
    
    // Xử lý ngày đơn lẻ
    if (lowerSchedule.includes('thứ 2') || lowerSchedule.includes('t2')) days.push('monday');
    if (lowerSchedule.includes('thứ 3') || lowerSchedule.includes('t3')) days.push('tuesday');
    if (lowerSchedule.includes('thứ 4') || lowerSchedule.includes('t4')) days.push('wednesday');
    if (lowerSchedule.includes('thứ 5') || lowerSchedule.includes('t5')) days.push('thursday');
    if (lowerSchedule.includes('thứ 6') || lowerSchedule.includes('t6')) days.push('friday');
    if (lowerSchedule.includes('thứ 7') || lowerSchedule.includes('t7')) days.push('saturday');
    if (lowerSchedule.includes('chủ nhật') || lowerSchedule.includes('cn')) days.push('sunday');
    
    return days;
  }

  // ✅ Chuyển đổi số thứ tự ngày thành key
  getDayKeyFromNumber(dayNumber: number): string | null {
    switch (dayNumber) {
      case 2: return 'monday';
      case 3: return 'tuesday';
      case 4: return 'wednesday';
      case 5: return 'thursday';
      case 6: return 'friday';
      case 7: return 'saturday';
      case 8: return 'sunday'; // Chủ nhật có thể được viết là T8
      default: return null;
    }
  }

  // ✅ Phân tích ngày từ chuỗi lịch học (backward compatibility)
  parseDayFromSchedule(schedule: string): string | null {
    const days = this.parseDaysFromSchedule(schedule);
    return days.length > 0 ? days[0] : null;
  }

  // ✅ Phân tích thời gian từ chuỗi lịch học
  parseTimeFromSchedule(schedule: string): string {
    if (!schedule) return '00:00';
    
    // Tìm pattern giờ:phút (ví dụ: 07:30, 13:00, 10:00-12:00)
    // Ưu tiên lấy thời gian bắt đầu nếu có khoảng thời gian
    const timeMatch = schedule.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
    }
    
    return '00:00';
  }

  // ✅ Chuyển đổi chế độ xem
  toggleViewMode() {
    this.viewMode = this.viewMode === 'semester' ? 'weekly' : 'semester';
  }

  // ✅ Lấy tên ngày theo định dạng
  getDateString(date: Date): string {
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  // ✅ Kiểm tra có phải ngày hôm nay không
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // ✅ Lấy màu cho ngày
  getDayColorClass(dayKey: string): string {
    const scheduleCount = this.weeklySchedule[dayKey]?.length || 0;
    if (scheduleCount === 0) return 'day-empty';
    if (scheduleCount <= 2) return 'day-light';
    if (scheduleCount <= 4) return 'day-medium';
    return 'day-heavy';
  }

  // ✅ Xác định khung thời gian (sáng/trưa/tối)
  getTimeSlot(schedule: string): 'morning' | 'afternoon' | 'evening' {
    const time = this.parseTimeFromSchedule(schedule);
    const hour = parseInt(time.split(':')[0]);
    
    if (hour >= 6 && hour < 12) return 'morning';     // 6:00 - 11:59: Sáng
    if (hour >= 12 && hour < 17) return 'afternoon';  // 12:00 - 16:59: Trưa
    return 'evening';                                  // 17:00 - 5:59: Tối
  }

  // ✅ Lấy tên khung thời gian
  getTimeSlotName(timeSlot: string): string {
    switch (timeSlot) {
      case 'morning': return 'Sáng';
      case 'afternoon': return 'Trưa';
      case 'evening': return 'Tối';
      default: return '';
    }
  }

  // ✅ Lấy icon cho khung thời gian
  getTimeSlotIcon(timeSlot: string): string {
    switch (timeSlot) {
      case 'morning': return 'bi-sunrise';
      case 'afternoon': return 'bi-sun';
      case 'evening': return 'bi-moon';
      default: return 'bi-clock';
    }
  }

  // ✅ Lấy màu cho khung thời gian
  getTimeSlotColor(timeSlot: string): string {
    switch (timeSlot) {
      case 'morning': return '#f59e0b';    // Vàng cam (bình minh)
      case 'afternoon': return '#ef4444';  // Đỏ (mặt trời)
      case 'evening': return '#6366f1';   // Tím (tối)
      default: return '#6b7280';
    }
  }

  // ✅ Nhóm lịch học theo khung thời gian trong ngày
  getSchedulesByTimeSlot(daySchedules: any[]): { [key: string]: any[] } {
    const grouped = {
      morning: [],
      afternoon: [],
      evening: []
    } as { [key: string]: any[] };

    daySchedules.forEach(schedule => {
      const timeSlot = schedule.timeSlot || this.getTimeSlot(schedule.schedule);
      if (grouped[timeSlot]) {
        grouped[timeSlot].push(schedule);
      }
    });

    return grouped;
  }

  // ✅ Kiểm tra có lịch trong khung thời gian không
  hasScheduleInTimeSlot(daySchedules: any[], timeSlot: string): boolean {
    return daySchedules.some(schedule => 
      (schedule.timeSlot || this.getTimeSlot(schedule.schedule)) === timeSlot
    );
  }

  // ✅ Lấy danh sách lịch học đã lọc theo học kỳ
  getFilteredSchedules(): any[] {
    if (!this.currentSemester) {
      return this.scheduleList;
    }
    return this.scheduleList.filter(item => item.semester === this.currentSemester);
  }

  // ✅ Lấy danh sách nhóm học kỳ đã lọc
  getFilteredSemesterGroups(): { semester: string, schedules: any[] }[] {
    if (!this.currentSemester) {
      return this.groupedSchedules;
    }
    return this.groupedSchedules.filter(group => group.semester === this.currentSemester);
  }

  // ✅ Tính tổng tín chỉ cho một học kỳ cụ thể
  getTotalCreditsForSemester(semester: string): number {
    return this.scheduleList
      .filter(item => item.semester === semester)
      .reduce((total, item) => total + (item.credits || 3), 0);
  }

  // ✅ Xóa bộ lọc học kỳ (xem tất cả)
  clearSemesterFilter() {
    this.currentSemester = '';
    this.groupByWeeklySchedule(); // Cập nhật lại lịch tuần
  }

  // ✅ Lấy màu trạng thái học kỳ
  getSemesterStatusColor(semester: string): string {
    const today = new Date();
    const semesterInfo = this.semesterInfo[semester];
    
    if (!semesterInfo) return '#6b7280'; // Xám mặc định
    
    if (today >= semesterInfo.startDate && today <= semesterInfo.endDate) {
      return '#10b981'; // Xanh lá (đang học)
    } else if (today > semesterInfo.endDate) {
      return '#6366f1'; // Tím (đã hoàn thành)
    } else {
      return '#f59e0b'; // Vàng cam (sắp tới)
    }
  }

  // ✅ Lấy class CSS cho badge trạng thái học kỳ
  getSemesterStatusBadgeClass(semester: string): string {
    const today = new Date();
    const semesterInfo = this.semesterInfo[semester];
    
    if (!semesterInfo) return 'bg-secondary-soft text-secondary';
    
    if (today >= semesterInfo.startDate && today <= semesterInfo.endDate) {
      return 'bg-success-soft text-success'; // Đang học
    } else if (today > semesterInfo.endDate) {
      return 'bg-primary-soft text-primary'; // Đã hoàn thành
    } else {
      return 'bg-warning-soft text-warning'; // Sắp tới
    }
  }

  // ✅ Lấy text trạng thái học kỳ
  getSemesterStatusText(semester: string): string {
    const today = new Date();
    const semesterInfo = this.semesterInfo[semester];
    
    if (!semesterInfo) return 'Chưa xác định';
    
    if (today >= semesterInfo.startDate && today <= semesterInfo.endDate) {
      return 'Đang học';
    } else if (today > semesterInfo.endDate) {
      return 'Đã hoàn thành';
    } else {
      return 'Sắp diễn ra';
    }
  }
}
