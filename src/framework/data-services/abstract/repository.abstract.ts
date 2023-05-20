export interface IRepository<D> {
  getAll(): Promise<D[]>;

  getAllInAscOrder(orderBy: string): Promise<D[]>;

  getById(id: string): Promise<D | null>;

  create(item: D): Promise<unknown>;

  update(id: string, item: D);
}
