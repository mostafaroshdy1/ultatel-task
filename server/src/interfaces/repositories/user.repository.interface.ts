import { User } from 'src/models/user.model';
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
