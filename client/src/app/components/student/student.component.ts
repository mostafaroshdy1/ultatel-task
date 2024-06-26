import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentModalComponent } from '../student-modal/student-modal.component';
import { StudentService } from '../../../services/student.service';
import { AgePipe } from '../../../pipes/age.pipe';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Student } from '../../../interfaces/student.interface';
import { FilterStudent } from '../../../interfaces/filterStudent.interface';
import { Country } from '../../../interfaces/country.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgSelectModule, CommonModule, FormsModule, AgePipe],
  providers: [StudentService, AlertService],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  selectedCountry: string | null = null;
  selectedGender: string | null = null;
  selectedEntry: number = 10;
  countries: Country[] = [];
  students: Student[] = [];
  filteredStudents: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  limit: number = this.pageSize;
  offset: number = 0;
  defaultFilter = { limit: this.limit, offset: 0 };
  selectedName: string = '';
  selectedMinAge: number | null = null;
  selectedMaxAge: number | null = null;
  filter: FilterStudent = this.defaultFilter;
  totalEntries: number = 0;

  genders = [
    { id: 1, name: 'male' },
    { id: 2, name: 'female' },
  ];
  entries = [
    { id: 1, name: '10' },
    { id: 2, name: '25' },
    { id: 3, name: '50' },
    { id: 4, name: '75' },
    { id: 5, name: '100' },
  ];

  constructor(
    private readonly http: HttpClient,
    private readonly studentService: StudentService,
    private readonly modalService: NgbModal,
    private readonly authService: AuthService,
    private readonly alertService: AlertService
  ) {}

  ngOnInit() {
    this.fetchCountries();
    this.fetchStudents(this.defaultFilter); // default filters
  }

  fetchCountries() {
    this.http.get<any[]>('assets/countries.json').subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      },
    });
  }

  displayedPages(): number[] {
    let startPage = Math.floor((this.currentPage - 1) / 10) * 10 + 1;
    let endPage = startPage + 9;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
    }

    return this.pagesArray().slice(startPage - 1, endPage);
  }
  shouldShowEllipsisAfter(): boolean {
    const lastPageInCurrentRange =
      Math.floor((this.currentPage - 1) / 10) * 10 + 10;
    return lastPageInCurrentRange < this.totalPages;
  }
  shouldShowEllipsisBefore(): boolean {
    const firstPageInCurrentRange =
      Math.floor((this.currentPage - 1) / 10) * 10 + 1;
    return firstPageInCurrentRange > 1;
  }
  pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchStudents(filters: FilterStudent) {
    this.studentService.getAllStudents(filters).subscribe({
      next: (data: any) => {
        this.students = data.result;
        this.filteredStudents = data.result;
        this.totalPages = Math.ceil(data.total / this.pageSize);
        this.totalEntries = data.total;
      },
      error: (error) => {
        this.pageSize = 10;
        this.filter = this.defaultFilter;
        console.error('Error fetching students:', error);
      },
    });
  }

  logout() {
    this.alertService
      .warn('You are about to Logout', 'Are you sure?')
      .then((result: any) => {
        if (result.isConfirmed) {
          this.authService.logout();
        }
      });
  }

  // this is automatically called when onEntriesClear is called
  onEntriesChange() {
    if (this.pageSize < 10) this.pageSize = 10;
    this.filter = {
      ...this.filter,
      limit: this.pageSize,
      offset: this.pageSize * (this.currentPage - 1),
    };
    this.goToFirstPage();
  }

  onEntriesClear() {
    this.selectedEntry = 10;
    this.pageSize = 10;
    this.filter = {
      ...this.filter,
      limit: this.pageSize,
      offset: this.pageSize * (this.currentPage - 1),
    };
  }

  sortTable(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filter = {
      ...this.filter,
      orderBy: column,
      order: this.sortDirection,
    };
    this.fetchStudents(this.filter);
  }

  goToPage(page: number) {
    this.currentPage = page;
    console.log('page:', page);
    console.log('curr:', this.currentPage);

    if (page >= 1 && page <= this.totalPages) {
      this.filter = {
        ...this.filter,
        offset: this.filter.limit * (page - 1),
      };
    }

    this.fetchStudents(this.filter);
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToLastPage() {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  searchStudents() {
    console.log(this.selectedCountry);
    this.filter = {
      limit: this.pageSize,
      offset: this.pageSize * (this.currentPage - 1),
      country: this.selectedCountry,
      gender: this.selectedGender,
      name: this.selectedName.trim(),
      minAge: this.selectedMinAge,
      maxAge: this.selectedMaxAge ? this.selectedMaxAge + 1 : null,
    };

    this.goToFirstPage();
  }

  resetFilters() {
    this.selectedName = '';
    this.selectedCountry = null;
    this.selectedMinAge = null;
    this.selectedMaxAge = null;
    this.selectedGender = null;
    this.defaultFilter.limit = this.filter.limit;
    this.defaultFilter.offset = this.filter.offset;
    this.filter = this.defaultFilter;
    this.fetchStudents(this.filter);
  }

  getMaxRange(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalEntries);
  }

  confirmDelete(student: Student) {
    this.alertService
      .warn(
        `You are about to delete ${student.firstName} ${student.lastName}.`,
        'Are you sure?'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.deleteStudent(student.id);
        }
      });
  }

  deleteStudent(studentId: number): void {
    this.studentService
      .deleteStudent(studentId)
      .pipe(
        catchError((error) => {
          this.alertService.error('Failed to delete the student.', 'Error!');
          return of(null);
        }),
        finalize(() => {
          this.fetchStudents(this.filter);
        })
      )
      .subscribe(() => {
        this.alertService.success('The student has been deleted.', 'Deleted!');
      });
  }

  openAddEditModal(isAddMode: boolean, student?: Student) {
    const modalRef = this.modalService.open(StudentModalComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.modalTitle = isAddMode
      ? 'Add Student'
      : 'Edit Student';

    modalRef.componentInstance.student = student ? { ...student } : {};

    modalRef.componentInstance.studentUpdated.subscribe({
      next: (respone: any) => {
        this.fetchStudents(this.filter);
      },
    });

    modalRef.componentInstance.studentAdded.subscribe({
      next: (respone: any) => {
        this.fetchStudents(this.filter);
      },
    });
  }
}
