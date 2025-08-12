import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';

// Khai báo interface cho ScoreDto để đảm bảo an toàn kiểu dữ liệu
interface ScoreDto {
  id: number;
  enrollmentId: number;
  studentCode: string;
  fullName: string;
  midterm: number | null;
  final: number | null;
  other: number | null;
  total: number;
  subjectName: string;
  classCode: string;
  semesterName: string;
}

// Interface học kỳ từ API
interface SemesterDto {
  id: number;
  name: string;
  startDate: string;
  endDate: boolean;
}

@Component({
  selector: 'app-my-scores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-scores.component.html',
  styleUrls: ['./my-scores.component.scss']
})
export class MyScoresComponent implements OnInit {
  scores: ScoreDto[] = [];
  filteredScores: ScoreDto[] = [];
  
  // Thay thế availableClasses bằng một biến để lưu trữ các lớp duy nhất
  uniqueClassCodes: string[] = [];

  availableSemesters: string[] = [];
  selectedSemesterName: string = '';

  // Thay thế selectedClassCode bằng searchClassQuery
  searchClassQuery: string = '';

  editingScore: any = null;
  loading = true;
  error = '';
  
  currentClassInfo: any = null;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadSemesters();
    this.route.queryParams.subscribe(params => {
      console.log('🔗 Query params nhận được:', params);
      if (params['classId']) {
        this.currentClassInfo = {
          classId: params['classId'],
          classCode: params['classCode'],
          subjectName: params['subjectName'],
          semesterName: params['semesterName']
        };
        
        // Cập nhật searchClassQuery thay vì selectedClassCode
        this.searchClassQuery = params['classCode'];
        this.selectedSemesterName = params['semesterName'];

        console.log('✅ Đã set currentClassInfo:', this.currentClassInfo);
        this.fetchScores();
      } else {
        console.log('❌ Không có classId trong params');
        this.fetchScores();
      }
    });
  }

  loadSemesters(): void {
    this.http.get<SemesterDto[]>(`https://localhost:7172/api/semesters`).subscribe({
      next: semesters => {
        this.availableSemesters = semesters.map(s => s.name);
        console.log('Danh sách học kỳ:', this.availableSemesters);
      },
      error: err => {
        console.error('❌ Lỗi khi tải học kỳ:', err);
      }
    });
  }

  fetchScores(): void {
    this.loading = true;
    this.http.get<ScoreDto[]>(`api/score/my-class`).subscribe({
      next: data => {
        console.log('📊 Dữ liệu điểm từ API:', data);
        this.scores = data;
        this.uniqueClassCodes = Array.from(new Set(data.map(s => s.classCode)));
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi khi tải điểm:', err);
        this.error = 'Không thể tải dữ liệu điểm.';
        this.loading = false;
      }
    });
  }

  // Thay đổi logic filter để sử dụng searchClassQuery
  applyFilters(): void {
    if (this.currentClassInfo) {
      this.filteredScores = this.scores.filter(s =>
        s.classCode === this.currentClassInfo.classCode &&
        s.semesterName === this.currentClassInfo.semesterName
      );
    } else {
      this.filteredScores = this.scores.filter(s => {
        // Tìm kiếm lớp học theo chuỗi nhập vào
        const classMatch = !this.searchClassQuery || s.classCode.toLowerCase().includes(this.searchClassQuery.toLowerCase());
        const semesterMatch = !this.selectedSemesterName || s.semesterName === this.selectedSemesterName;
        return classMatch && semesterMatch;
      });
    }
    console.log('📋 Kết quả filter:', this.filteredScores.length, 'sinh viên');
  }
  
  // Bỏ applyClassFilter vì nó không còn cần thiết
  // Thay thế bằng một phương thức đơn giản hơn để kích hoạt filter khi người dùng nhập liệu
  onSearchClass(): void {
    this.applyFilters();
  }

  applySemesterFilter(): void {
    this.applyFilters();
  }

  startEdit(score: ScoreDto) {
    this.editingScore = { ...score };
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
        this.fetchScores();
      },
      error: err => {
        console.error('❌ Lỗi khi cập nhật điểm:', err);
        alert('Không thể cập nhật điểm.');
      }
    });
  }

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