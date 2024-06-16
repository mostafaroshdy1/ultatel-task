import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentModalComponent } from '../student-modal/student-modal.component';
import { StudentService } from '../../../services/student.service';
import Swal from 'sweetalert2';
import { AgePipe } from '../../../pipes/age.pipe';
import { of } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AgePipe,
  ],
  providers: [StudentService],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  selectedCountry: any;
  selectedGender: any;
  selectedEntry: any;
  countries: any[] = [];
  students: any[] = [];
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
  filter: any = this.defaultFilter;

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
    private http: HttpClient,
    private router: Router,
    private studentService: StudentService,
    private modalService: NgbModal
  ) {
    console.log('opps');
  }

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

  pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  fetchStudents(filters: any) {
    this.studentService.getAllStudents(filters).subscribe({
      next: (data: any) => {
        this.students = data.result;
        this.filteredStudents = data.result;
        this.totalPages = Math.ceil(data.total / this.pageSize);
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      },
    });
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to Logout`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  onEntriesChange() {
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
    this.onEntriesChange();
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
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchStudents({
        ...this.filter,
        offset: this.filter.limit * (page - 1),
      });
    }
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
    this.filter = {
      limit: this.limit,
      offset: this.limit * (this.currentPage - 1),
      country: this.selectedCountry,
      gender: this.selectedGender,
      name: this.selectedName.trim(),
      minAge: this.selectedMinAge,
      maxAge: this.selectedMaxAge,
    };
    console.log(this.filter);

    this.fetchStudents(this.filter);
    this.goToFirstPage();
    this.sortTable(this.sortColumn);
  }

  resetFilters() {
    this.selectedName = '';
    this.selectedCountry = null;
    this.selectedMinAge = null;
    this.selectedMaxAge = null;
    this.selectedGender = null;
    this.fetchStudents(this.defaultFilter);
    this.sortTable(this.sortColumn);
  }

  get paginatedStudents(): any[] {
    return this.filteredStudents;
  }

  getMaxIndexDisplayed(): number {
    const endIndex = this.currentPage * this.pageSize;
    return Math.min(endIndex, this.filteredStudents.length);
  }

  confirmDelete(student: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${student.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.deleteStudent(student.id);
      }
    });
  }

  deleteStudent(studentId: number) {
    this.studentService.deleteStudent(studentId).subscribe(
      () => {
        Swal.fire('Deleted!', 'The student has been deleted.', 'success');
        this.fetchStudents(this.filter);
      },
      (error) => {
        Swal.fire('Error!', 'Failed to delete the student.', 'error');
        console.error('Error deleting student:', error);
      }
    );
  }

  openAddEditModal(isAddMode: boolean, student?: any) {
    const modalRef = this.modalService.open(StudentModalComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.modalTitle = isAddMode
      ? 'Add Student'
      : 'Edit Student';
    modalRef.componentInstance.student = student ? { ...student } : {};

    modalRef.componentInstance.studentUpdated.subscribe(
      (updatedStudent: any) => {
        this.updateStudentInList(updatedStudent);
      }
    );

    modalRef.componentInstance.studentAdded.subscribe((newStudent: any) => {
      this.addStudentToList(newStudent);
    });

    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);
  }
  updateStudentInList(updatedStudent: any) {
    const index = this.students.findIndex((s) => s.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
    }
  }

  addStudentToList(newStudent: any) {
    this.students.push(newStudent);
  }
}
