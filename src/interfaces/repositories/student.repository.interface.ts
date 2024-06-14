import { Student } from 'src/models/student.model';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';

export interface StudentRepositoryInterface
  extends BaseInterfaceRepository<Student> {}
