import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-score-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './my-score-list.component.html',
  styleUrls: ['./my-score-list.component.scss']
})
export class MyScoreListComponent implements OnInit {
  scores: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('https://localhost:7172/api/student/scores').subscribe({
      next: data => this.scores = data,
      error: err => console.error(err)
    });
  }
}
