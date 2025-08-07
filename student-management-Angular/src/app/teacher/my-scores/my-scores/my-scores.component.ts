import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-scores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-scores.component.html',
  styleUrls: ['./my-scores.component.scss']
})
export class MyScoresComponent implements OnInit {
  scores: any[] = [];
  filteredScores: any[] = [];
  availableClasses: string[] = [];
  selectedClassCode: string = '';
  editingScore: any = null;
  loading = true;
  error = '';
  
  // Thông tin lớp học từ navigation
  currentClassInfo: any = null;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Đọc thông tin lớp học từ query parameters trước
    this.route.queryParams.subscribe(params => {
      console.log('🔗 Query params nhận được:', params);
      if (params['classId']) {
        this.currentClassInfo = {
          classId: params['classId'],
          classCode: params['classCode'],
          subjectName: params['subjectName'],
          semesterName: params['semesterName']
        };
        this.selectedClassCode = params['classCode'];
        console.log('✅ Đã set currentClassInfo:', this.currentClassInfo);
        
        // Load dữ liệu sau khi đã có thông tin lớp học
        this.fetchScores();
      } else {
        console.log('❌ Không có classId trong params');
        // Load tất cả dữ liệu nếu không có filter
        this.fetchScores();
      }
    });
  }

  fetchScores(): void {
    this.loading = true;
    this.http.get<any[]>(`api/score/my-class`).subscribe({
      next: data => {
        console.log('📊 Dữ liệu điểm từ API:', data);
        console.log('🎯 Thông tin lớp hiện tại:', this.currentClassInfo);
        
        this.scores = data;
        
        // Nếu có thông tin lớp học từ navigation, filter ngay
        if (this.currentClassInfo) {
          console.log('🔍 Bắt đầu filtering...');
          
          let filtered = [];
          
          // Filter theo classCode (ưu tiên cao nhất vì đây là field chắc chắn có)
          if (this.currentClassInfo.classCode) {
            console.log('🔍 Filtering theo classCode:', this.currentClassInfo.classCode);
            filtered = data.filter(s => {
              const match = s.classCode === this.currentClassInfo.classCode;
              console.log(`Checking: ${s.classCode} === ${this.currentClassInfo.classCode} = ${match}`);
              return match;
            });
            console.log('📋 Kết quả filter theo classCode:', filtered.length, 'items');
          }
          
          // Nếu vẫn chưa có kết quả, thử filter theo subjectName  
          if (filtered.length === 0 && this.currentClassInfo.subjectName) {
            console.log('🔄 Thử filter theo subjectName:', this.currentClassInfo.subjectName);
            filtered = data.filter(s => {
              const match = s.subjectName === this.currentClassInfo.subjectName;
              console.log(`Checking: ${s.subjectName} === ${this.currentClassInfo.subjectName} = ${match}`);
              return match;
            });
            console.log('📋 Kết quả filter theo subjectName:', filtered.length, 'items');
          }
          
          this.filteredScores = filtered;
          console.log('✅ Kết quả filter cuối cùng:', this.filteredScores.length, 'sinh viên');
          
          // Tự động set selectedClassCode để UI hiển thị đúng
          if (this.currentClassInfo.classCode) {
            this.selectedClassCode = this.currentClassInfo.classCode;
          }
        } else {
          this.filteredScores = data;
          console.log('📄 Hiển thị tất cả dữ liệu:', data.length, 'items');
        }

        // Lấy danh sách classCode duy nhất
        this.availableClasses = Array.from(new Set(data.map(s => s.classCode)));

        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi khi tải điểm:', err);
        this.error = 'Không thể tải dữ liệu điểm.';
        this.loading = false;
      }
    });
  }

  applyClassFilter(): void {
    // Nếu đang trong mode xem lớp cụ thể, không cho phép thay đổi filter qua dropdown
    if (this.currentClassInfo) {
      console.log('🔒 Đang trong chế độ xem lớp cụ thể, không thể thay đổi filter');
      return;
    }
    
    // Chế độ xem tất cả - cho phép filter bình thường
    console.log('🔍 Applying filter for class:', this.selectedClassCode);
    this.filteredScores = this.selectedClassCode
      ? this.scores.filter(s => s.classCode === this.selectedClassCode)
      : this.scores;
    console.log('📋 Filtered results:', this.filteredScores.length, 'students');
  }

  startEdit(score: any) {
    this.editingScore = { ...score }; // tạo bản sao
  }

  cancelEdit() {
    this.editingScore = null;
  }

  saveScore() {
    if (!this.editingScore) return;

    const payload = {
      enrollmentId: this.editingScore.enrollmentId,
      midterm: this.editingScore.midterm,
      final: this.editingScore.final,
      other: this.editingScore.other
    };

    this.http.post(`api/score/input`, payload).subscribe({
      next: () => {
        this.editingScore = null;
        this.fetchScores(); // Gọi lại toàn bộ dữ liệu để cập nhật chính xác
      },
      error: err => {
        console.error('❌ Lỗi khi cập nhật điểm:', err);
        alert('Không thể cập nhật điểm.');
      }
    });
  }

  // Utility methods for badge styling
  getScoreBadgeClass(score: number | null): string {
    if (score === null || score === undefined) return 'bg-secondary';
    if (score >= 8.5) return 'bg-success';
    if (score >= 7.0) return 'bg-primary';
    if (score >= 5.5) return 'bg-warning';
    if (score >= 4.0) return 'bg-orange';
    return 'bg-danger';
  }

  getTotalScoreBadgeClass(total: number | null): string {
    if (total === null || total === undefined) return 'bg-secondary';
    if (total >= 8.5) return 'bg-success';
    if (total >= 7.0) return 'bg-primary';
    if (total >= 5.5) return 'bg-warning';
    if (total >= 4.0) return 'bg-orange';
    return 'bg-danger';
  }
}
