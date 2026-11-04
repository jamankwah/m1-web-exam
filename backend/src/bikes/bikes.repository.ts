import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  BikePageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeInUseError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAll(page: number, limit: number): Promise<BikePageModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        skip: (page - 1) * limit,
        take: limit,
      });
    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    return this.toBikeModel(await repository.save(repository.create(input)));
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      const entity = await repository.findOneBy({ id });
      if (!entity) throw new BikeNotFoundError();
      repository.merge(entity, input);
      return this.toBikeModel(await repository.save(entity));
    });
  }

  async delete(id: string): Promise<void> {
    // Check the sales and delete in one transaction to keep the sales history.
    await this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      if (!(await repository.existsBy({ id }))) throw new BikeNotFoundError();
      if (await manager.getRepository(BikeSellEntity).existsBy({ bikeId: id }))
        throw new BikeInUseError();
      await repository.delete(id);
    });
  }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}
