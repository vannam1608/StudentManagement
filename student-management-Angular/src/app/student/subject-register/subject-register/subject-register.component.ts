import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-register',
  standalone: true,
  templateUrl: './subject-register.component.html',
  styleUrls: ['./subject-register.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class SubjectRegisterComponent implements OnInit {
  availableSubjects: any[] = [];
  registeredSubjectIds: number[] = [];
  groupedSubjects: Record<string, any[]> = {};
  groupedRegisteredSubjects: Record<string, any[]> = {};

  semesters: any[] = [];
  selectedSemester: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSemesters();
    this.loadRegisteredSubjects();
  }

  loadSemesters() {
    this.http.get<any[]>('/api/semesters').subscribe({
      next: (data) => {
        this.semesters = data;
        const openSemester = this.semesters.find(s => s.isOpen);
        this.selectedSemester = openSemester?.id || 0;
        this.loadSubjects();
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải danh sách học kỳ:', err);
      }
    });
  }

  loadSubjects() {
    let params = new HttpParams();
    if (this.selectedSemester !== 0) {
      params = params.set('semesterId', this.selectedSemester.toString());
    }

    this.http.get<any[]>('/api/subjects/available', { params }).subscribe({
      next: (subjects) => {
        this.availableSubjects = subjects.map(s => {
          const semester = this.semesters.find(sem => sem.id === s.semesterId);
          return {
            ...s,
            semesterName: semester?.name || 'Chưa rõ học kỳ'
          };
        });

        this.groupSubjectsBySemester();
        this.groupRegisteredSubjects();
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải danh sách môn học:', err);
      }
    });
  }

  onSemesterChange() {
    this.loadSubjects();
  }

  loadRegisteredSubjects() {
    this.http.get<any[]>('/api/student/my-subjects').subscribe({
      next: (registered) => {
        this.registeredSubjectIds = registered.map(s => s.id);
        this.groupRegisteredSubjects();
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải danh sách môn đã đăng ký:', err);
      }
    });
  }

  groupSubjectsBySemester() {
    const groups: Record<string, any[]> = {};
    const subjectsForSelectedSemester = this.availableSubjects.filter(
      s => this.selectedSemester === 0 || s.semesterId === this.selectedSemester
    );

    for (const subject of subjectsForSelectedSemester) {
      const sem = subject.semesterName || 'Chưa rõ học kỳ';
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(subject);
    }
    
    this.groupedSubjects = groups;
  }

  groupRegisteredSubjects() {
    const registered = this.availableSubjects.filter(s => this.isRegistered(s.id));
    const groups: Record<string, any[]> = {};

    for (const subject of registered) {
      const sem = subject.semesterName || 'Chưa rõ học kỳ';
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(subject);
    }

    this.groupedRegisteredSubjects = groups;
  }

  getCurrentStudentId(): number {
    const token = localStorage.getItem('accessToken');
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return +payload.nameid;
    } catch {
      return 0;
    }
  }

  registerSubject(subjectId: number) {
    if (this.isRegistered(subjectId)) {
      alert('⚠️ Bạn đã đăng ký môn này rồi.');
      return;
    }

    const studentId = this.getCurrentStudentId();
    const body = { studentId, courseClassId: subjectId };

    this.http.post<any>('/api/student/register', body).subscribe({
      next: (res) => {
        if (!res.success) {
          alert(`⚠️ ${res.message}`);
          return;
        }

        alert('✅ Đăng ký môn thành công');
        this.registeredSubjectIds.push(subjectId);
        this.groupRegisteredSubjects();
      },
      error: (err) => {
        const msg = err.error?.message || '❌ Không thể đăng ký môn học';
        alert(msg);
      }
    });
  }

  isRegistered(subjectId: number): boolean {
    return this.registeredSubjectIds.includes(subjectId);
  }
  
  getTotalSubjectsInSelectedSemester(): number {
    if (this.selectedSemester === 0) {
      return this.availableSubjects.length;
    }
    return this.availableSubjects.filter(s => s.semesterId === this.selectedSemester).length;
  }
  
  // Hàm mới để lấy số lượng môn đã đăng ký trong học kỳ hiện tại
  getTotalRegisteredSubjectsInSelectedSemester(): number {
    if (this.selectedSemester === 0) {
      return this.registeredSubjectIds.length;
    }
    
    // Lọc danh sách môn học có sẵn để tìm các môn đã đăng ký trong học kỳ đã chọn
    return this.availableSubjects.filter(
      (s) => this.isRegistered(s.id) && s.semesterId === this.selectedSemester
    ).length;
  }

  get isCurrentSemesterOpen(): boolean {
    const selected = this.semesters.find(s => s.id === this.selectedSemester);
    return !!selected?.isOpen;
  }
}