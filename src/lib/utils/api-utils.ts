import { APIResponse } from '../common/common.types';
import { CrudService } from '../common/crud.service';
import { Document, FilterQuery } from 'mongoose';

type ResponseClass = { new (...args: any[]): APIResponse };

export class APIUtils {
  static async handle<Response extends APIResponse, ServiceCallResult>(
    serviceCall: Promise<ServiceCallResult>,
    response: ResponseClass,
  ): Promise<Response> {
    const result = (await serviceCall) as ServiceCallResult;
    return new response(true, result) as Response;
  }

  static async genericGet<
    Response extends APIResponse,
    IModel,
    IModelDocument extends Document,
  >(
    service: CrudService<IModel, IModelDocument>,
    response: ResponseClass,
    filter?: FilterQuery<IModelDocument>,
    projection?: unknown,
  ): Promise<Response> {
    return APIUtils.handle(service.get(filter, projection), response);
  }

  static async genericGetAll<
    Response extends APIResponse,
    IModel,
    IModelDocument extends Document,
  >(
    service: CrudService<IModel, IModelDocument>,
    response: ResponseClass,
    filter?: FilterQuery<IModelDocument>,
    projection?: unknown,
  ): Promise<Response> {
    return APIUtils.handle(service.getAll(filter, projection), response);
  }

  static async genericAdd<
    Response extends APIResponse,
    IModel,
    IModelDocument extends Document,
  >(
    service: CrudService<IModel, IModelDocument>,
    response: ResponseClass,
    modelData: IModel,
  ): Promise<Response> {
    return APIUtils.handle(service.add(modelData), response);
  }

  static async genericUpdate<
    Response extends APIResponse,
    IModel,
    IModelDocument extends Document,
  >(
    service: CrudService<IModel, IModelDocument>,
    response: ResponseClass,
    id: string | FilterQuery<IModelDocument>,
    updates: IModel,
  ): Promise<Response> {
    return APIUtils.handle(service.update(id, updates), response);
  }

  static async genericDelete<
    Response extends APIResponse,
    IModel,
    IModelDocument extends Document,
  >(
    service: CrudService<IModel, IModelDocument>,
    response: ResponseClass,
    id: string | FilterQuery<IModelDocument>,
  ): Promise<Response> {
    return APIUtils.handle(service.delete(id), response);
  }
}
