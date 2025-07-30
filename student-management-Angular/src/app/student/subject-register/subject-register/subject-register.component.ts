import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-register',
  standalone: true,
  templateUrl: './subject-register.component.html',
  styleUrl: './subject-register.component.scss',
  imports: [CommonModule, FormsModule]
})
export class SubjectRegisterComponent implements OnInit {
  availableSubjects: any[] = [];
  registeredSubjectIds: number[] = [];
  selectedSubjectId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    this.http.get<any[]>('/api/subjects').subscribe({
      next: (subjects) => {
        this.availableSubjects = subjects;
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải danh sách môn học:', err);
      }
    });

    this.http.get<any[]>('/api/student/my-subjects').subscribe({
      next: (registered) => {
        this.registeredSubjectIds = registered.map(s => s.id);
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải danh sách môn đã đăng ký:', err);
      }
    });
  }

  getCurrentStudentId(): number {
    const token = localStorage.getItem('accessToken');
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return +payload.nameid; // nameid hoặc sub hoặc studentId tùy backend
    } catch {
      return 0;
    }
  }

  registerSubject(subjectId: number) {
  const studentId = this.getCurrentStudentId();
  const body = {
    studentId: studentId,
    courseClassId: subjectId 
  };
  console.log('📦 Payload gửi:', body);

  this.http.post('/api/student/register', body).subscribe({
    next: () => {
      alert('✅ Đăng ký môn thành công');
      this.registeredSubjectIds.push(subjectId);
    },
    error: (err) => {
      console.error('❌ Đăng ký thất bại:', err);
      alert('❌ Không thể đăng ký môn học');
    }
  });
}



  isRegistered(subjectId: number): boolean {
    return this.registeredSubjectIds.includes(subjectId);
  }
}
