import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from '../../src/controllers/student.controller';
import { StudentService } from '../../src/services/student.service';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [StudentService],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
