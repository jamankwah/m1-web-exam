import type { BikePageModel } from "../models/bike.model";
import { BikeResponseDto } from "./bike-response.dto";

export class BikePageResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];

  static fromModel(model: BikePageModel): BikePageResponseDto {
    return Object.assign(new BikePageResponseDto(), {
      totalCount: model.totalCount,
      bikes: model.bikes.map((bike) => BikeResponseDto.fromModel(bike)),
    });
  }
}
