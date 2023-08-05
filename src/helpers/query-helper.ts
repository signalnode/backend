import { ParsedQs } from 'qs';
import { Between, Equal, FindManyOptions, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';

const convertQueryToRelations: (query: string[]) => FindOptionsRelations<unknown> = (query) => {
  return query;
};

const convertQueryToOrder: (query: ParsedQs) => FindOptionsOrder<unknown> | undefined = (query) => {
  if (typeof query === 'object' && !Array.isArray(query)) {
    return Object.entries(query).reduce((a, [key, value]) => {
      if (typeof value === 'string') {
        if (['asc', 'desc'].includes(value.toLowerCase())) {
          return { ...a, [key]: value.toLowerCase() };
        }
      }
      return { ...a, [key]: convertQueryToOrder(value as ParsedQs) };
    }, {});
  }
  return undefined;
};

const convertQueryToFilters: (query: ParsedQs | ParsedQs[] | string[]) => ParsedQs = (query) => {
  if (Array.isArray(query)) {
    if ((query as unknown[]).every((v) => typeof v === 'string')) {
      return In(query as string[]);
    }
  }
  return Object.entries(query).reduce((acc, [key, value]) => {
    console.log(key, value);
    if (Array.isArray(value)) return acc;
    if (key === 'not' && typeof value === 'string') {
      return Not(value);
    } else if (typeof value === 'string') {
      return { [key]: Equal(value) };
    } else if (value && ((value['gt'] && value['lt']) || (value['gt'] && value['lte']) || (value['gte'] && value['lt']) || (value['gte'] && value['lte']))) {
      return { [key]: Between(value['gt'] ?? value['gte'], value['lt'] ?? value['lte']) };
    } else if (value && value['gt']) {
      return { [key]: MoreThan(value['gt']) };
    } else if (value && value['gte']) {
      return { [key]: MoreThanOrEqual(value['gte']) };
    } else if (value && value['lt']) {
      return { [key]: LessThan(value['lt']) };
    } else if (value && value['lte']) {
      return { [key]: LessThanOrEqual(value['lte']) };
    } else if (value && value['eq']) {
      return { [key]: Equal(value['eq']) };
    } else if (value && value['in'] && typeof value['in'] === 'string') {
      return { [key]: In(value['in'].split(',').map((v) => v.trim())) };
    } else if (value) {
      return { [key]: convertQueryToFilters(value) };
    } else {
      return acc;
    }
  }, {});
};

export const convertQueryToOptions: (query: ParsedQs, options?: { relations?: FindOptionsRelations<unknown>; where?: ParsedQs }) => FindManyOptions = (query, options) => {
  let relations: FindOptionsRelations<unknown> | undefined = undefined;
  let order: FindOptionsOrder<unknown> | undefined = undefined;
  let where: FindOptionsWhere<unknown | unknown[]> | undefined = undefined;

  if (options?.relations) {
    relations = options.relations;
  } else {
    if (query['relations']) {
      if (typeof query['relations'] === 'string') relations = query['relations'].split(',').map((r) => r.trim());
      if (Array.isArray(query['relations'])) {
        relations = convertQueryToRelations(query['relations'] as string[]);
      }
    }
  }
  // TODO: Order or its children can never be an array
  if (query['order']) {
    order = convertQueryToOrder(query['order'] as ParsedQs);
  }

  console.log(query);
  if (options?.where) {
    where = options.where;
  } else {
    where = where = Object.entries(query).reduce<ParsedQs>((acc, [key, value]) => {
      if (key === 'relations' || key === 'order') return acc;
      if (typeof value === 'string') return { ...acc, [key]: value };
      if (value) return { ...acc, ...convertQueryToFilters({ [key]: value }) };
      return acc;
    }, {});
  }

  console.log(where);

  return { relations, order, where: Object.keys(where).length > 0 ? where : undefined };
};
