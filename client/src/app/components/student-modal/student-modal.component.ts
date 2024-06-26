import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Country } from '../../../interfaces/country.interface';
import { Student } from '../../../interfaces/student.interface';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-student-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgbDatepickerModule,
  ],
  providers: [StudentService, AlertService],
  templateUrl: './student-modal.component.html',
  styleUrl: './student-modal.component.css',
})
export class StudentModalComponent {
  @Input() modalTitle: string = '';
  @Input() student: Student = {} as Student;
  @Output() studentUpdated = new EventEmitter<any>();
  @Output() studentAdded = new EventEmitter<any>();
  countries: Country[] = [];
  isEditMode: boolean = false;
  oldStudent: Student = {} as Student;
  studentId: number = 0;
  birthDate: NgbDateStruct | null = null;
  studentForm: FormGroup;
  originalStudentData: Student = {} as Student;

  genders = [
    { id: 1, name: 'male' },
    { id: 2, name: 'female' },
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private fb: FormBuilder,
    private studentService: StudentService,
    private readonly alertService: AlertService
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      birthDate: ['null', Validators.required],
    });
  }

  ngOnInit() {
    if (this.student.id) {
      this.isEditMode = true;
      this.oldStudent = this.student;
      this.studentId = this.student.id;
      this.originalStudentData = { ...this.student };
      this.student.birthDate = this.dateStringToNgbDateStruct(
        this.student.birthDate
      );
      this.originalStudentData.birthDate = this.dateStringToNgbDateStruct(
        this.originalStudentData.birthDate
      );
    }

    this.fetchCountries();
  }

  fetchCountries() {
    this.http.get<Country[]>('assets/countries.json').subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      },
    });
  }

  dateStringToNgbDateStruct(dateString: string): any {
    if (!dateString) return null;

    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  populateFormForSave(student: Student) {
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      gender: student.gender,
      country: student.country,
      birthDate: this.dateStructToString(student.birthDate),
    });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  dateStructToString(dateStruct: any): any {
    if (!dateStruct) return null;
    const date = new Date(
      dateStruct.year,
      dateStruct.month - 1,
      dateStruct.day
    );
    return date.toISOString().split('T')[0];
  }

  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

  save(): void {
    this.populateFormForSave(this.student);
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      if (this.isEditMode && this.student) {
        if (this.isFormValueChanged(this.student, this.originalStudentData)) {
          this.studentService
            .updateStudent(+this.studentId, formData)
            .subscribe({
              next: (response: any) => {
                this.alertService
                  .success('Student updated successfully!', 'Student Updated')
                  .then(() => {
                    this.activeModal.close(response);
                    this.studentUpdated.emit(response);
                  });
              },
              error: (error: any) => {
                if (error.error.message == 'Email already exists') {
                  this.alertService.error('Email already exists', 'Error');
                }
              },
            });
        } else {
          this.activeModal.dismiss('cancel');
        }
      } else {
        this.studentService.createStudent(formData).subscribe({
          next: (response: any) => {
            this.alertService
              .success('Student created successfully!', 'Student Created')
              .then(() => {
                this.activeModal.close(response);
                this.studentAdded.emit(response);
              });
          },
          error: (error: any) => {
            if (error.error.message == 'Email already exists') {
              this.alertService.error('Email already exists', 'Error');
            }
          },
        });
      }
    } else {
      this.markAllAsTouched(this.studentForm);
    }
  }

  isFormValueChanged(newData: any, originalData: any): boolean {
    return JSON.stringify(newData) !== JSON.stringify(originalData);
  }

  clearGender() {
    this.studentForm.patchValue({
      gender: '',
    });
  }

  clearCountry() {
    this.studentForm.patchValue({
      country: '',
    });
  }
}
