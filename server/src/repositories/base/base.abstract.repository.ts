import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
  email: string;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public save(data: DeepPartial<T>): Promise<T> {
    return this.entity.save(data);
  }
  public saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }
  public create(data: DeepPartial<T>): Promise<T> {
    const entity = this.entity.create(data);
    return this.entity.save(entity);
  }

  public createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entity = this.entity.create(data);
    return this.entity.save(entity);
  }

  public findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return this.entity.findOneBy(options);
  }

  public findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return this.entity.findOne(filterCondition);
  }

  public findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(relations);
  }

  public findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(options);
  }

  public remove(data: T): Promise<T> {
    return this.entity.remove(data);
  }
  public preload(entityLike: DeepPartial<T>): Promise<T> {
    return this.entity.preload(entityLike);
  }
  public async update(id: number, updateData: DeepPartial<T>): Promise<T> {
    const entity = await this.preload({ id, ...updateData });
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return this.save(entity);
  }

  public count(options?: FindManyOptions<T>): Promise<number> {
    return this.entity.count(options);
  }
}
