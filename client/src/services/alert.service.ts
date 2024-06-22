import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  success(message: string, title: string = 'Success') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }

  error(message: string, title: string = 'Oops...') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }
  question(message: string, title: string = 'Question') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
  }
  warn(message: string, title: string = 'Warning') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
  }
}
