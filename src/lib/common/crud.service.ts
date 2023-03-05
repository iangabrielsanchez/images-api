import { Model, Document, FilterQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export abstract class CrudService<IModel, IModelDocument extends Document> {
  Model: Model<IModelDocument>;

  constructor(model: Model<IModelDocument>) {
    this.Model = model;
  }

  async get(
    filter: string | FilterQuery<IModelDocument> | undefined,
    projection?: unknown,
  ): Promise<IModelDocument> {
    const getItemQuery =
      typeof filter === 'string'
        ? this.Model.findById(filter, projection)
        : this.Model.findOne(filter, projection);

    const item = await getItemQuery.exec();
    if (item === null) {
      throw new NotFoundException(`${this.Model.modelName} was not found`);
    }

    return item;
  }

  async getAll(
    filter: FilterQuery<IModelDocument> = {},
    projection?: unknown,
  ): Promise<IModelDocument[]> {
    const items = await this.Model.find(filter, projection).exec();

    return items;
  }
  add(modelData: IModel): Promise<IModelDocument> {
    const item = new this.Model(modelData);

    return item.save();
  }

  async update(
    id: string | FilterQuery<IModelDocument>,
    updates: IModel,
  ): Promise<IModelDocument> {
    const updateOptions = {
      useFindAndModify: false,
      new: true,
    };

    const updateItemQuery =
      typeof id === 'string'
        ? this.Model.findByIdAndUpdate(id, updates, updateOptions)
        : this.Model.findOneAndUpdate(id, updates, updateOptions);
    const updatedItem = await updateItemQuery.exec();

    if (updatedItem === null) {
      throw new NotFoundException(`${this.Model.modelName} was not found`);
    }

    return updatedItem;
  }

  async delete(
    id: string | FilterQuery<IModelDocument>,
  ): Promise<IModelDocument> {
    const deleteOptions = { useFindAndModify: false };
    const deleteItemQuery =
      typeof id === 'string'
        ? this.Model.findByIdAndDelete(id, deleteOptions)
        : this.Model.findOneAndDelete(id, deleteOptions);
    const deletedItem = await deleteItemQuery.exec();

    if (deletedItem === null) {
      throw new NotFoundException(`${this.Model.modelName} was not found`);
    }

    return deletedItem;
  }
}
