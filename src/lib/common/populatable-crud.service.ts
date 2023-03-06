import { Document, FilterQuery, Model, PopulateOptions } from 'mongoose';
import { CrudService } from '../common/crud.service';

export class PopulatableCrudService<
  IModel,
  IModelDocument extends Document,
> extends CrudService<IModel, IModelDocument> {
  populateOptions: PopulateOptions | PopulateOptions[];

  constructor(
    model: Model<IModelDocument>,
    populateOptions: PopulateOptions | PopulateOptions[],
  ) {
    super(model);

    this.populateOptions = populateOptions;
  }

  async get(
    filter: string | FilterQuery<IModelDocument> | undefined,
    projection?: unknown,
  ): Promise<IModelDocument> {
    const item = await super.get(filter, projection);

    return this.Model.populate(item, this.populateOptions);
  }

  async getAll(
    filter: FilterQuery<IModelDocument> = {},
    projection?: unknown,
  ): Promise<IModelDocument[]> {
    const items = await super.getAll(filter, projection);

    return this.Model.populate(items, this.populateOptions);
  }

  async add(modelData: IModel): Promise<IModelDocument> {
    const item = await super.add(modelData);

    return this.Model.populate(item, this.populateOptions);
  }

  async update(
    id: string | FilterQuery<IModelDocument>,
    updates: IModel,
  ): Promise<IModelDocument> {
    const updatedItem = await super.update(id, updates);

    return this.Model.populate(updatedItem, this.populateOptions);
  }

  async delete(
    id: string | FilterQuery<IModelDocument>,
  ): Promise<IModelDocument> {
    const deletedItem = await super.delete(id);

    return this.Model.populate(deletedItem, this.populateOptions);
  }
}
