export abstract class DataModel<D, M> {
  abstract domainToData(domain: D): M;
  abstract dataToDomain(data: M): D;
}
