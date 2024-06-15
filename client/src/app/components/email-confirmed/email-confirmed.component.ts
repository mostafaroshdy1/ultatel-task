import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email-confirmed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.css'],
})
export class EmailConfirmedComponent implements OnInit {
  confirmed: boolean = true;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token: string | null = this.route.snapshot.paramMap.get('token');
    const userId: string | null = this.route.snapshot.paramMap.get('id');

    if (token && userId) {
      this.confirmEmail(token, userId);
    } else {
      this.confirmed = false;
    }
  }

  private confirmEmail(token: string, userId: string): void {
    this.authService.confirmEmail(token, userId).subscribe({
      next: () => {
        this.confirmed = true;
      },
      error: () => {
        this.confirmed = false;
      },
    });
  }
}
