import { ObjectLiteral, Repository, FindOptionsOrder } from 'typeorm';
import { IRepository } from '../data-services/abstract/repository.abstract';
import { DataModel } from '../data-services/abstract/data-model.abstract';

export class PostgresGenericRepository<M extends ObjectLiteral, D>
  implements IRepository<D>
{
  private repository: Repository<M>;

  constructor(repository: Repository<M>, private dataModel: DataModel<D, M>) {
    this.repository = repository;
  }

  async getAll(): Promise<D[]> {
    const results = await this.repository.find({});
    return results.map((item) => this.dataModel.dataToDomain(item));
  }

  async getAllInAscOrder(orderBy: keyof M): Promise<D[]> {
    const order = {
      [orderBy]: 'ASC',
    } as FindOptionsOrder<M>;
    const results = await this.repository.find({ order });
    return results.map((item) => this.dataModel.dataToDomain(item));
  }

  async getById(id): Promise<D | null> {
    const result = await this.repository.findOneBy(id);
    return result ? (result as unknown as D) : null;
  }

  async create(item: D): Promise<M> {
    try {
      const model = this.dataModel.domainToData(item);
      await this.repository.save(model);
      return model;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw error;
      }
      throw new Error(`Error creating item: ${error}`);
    }
  }

  async update(id, item: D) {
    try {
      const model = item as unknown as M;
      await this.repository.update(id, model);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
