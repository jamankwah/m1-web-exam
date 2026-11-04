import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";
import { trim } from "./create-bike.dto";

// Fields left out are not changed; null is rejected because every field is required
const isPresent = (_object: unknown, value: unknown) => value !== undefined;

export class UpdateBikeDto {
  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(isPresent)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(isPresent)
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(isPresent)
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(isPresent)
  @IsInt()
  @Min(1)
  gearCount?: number;

  @ValidateIf(isPresent)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @ValidateIf(isPresent)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(isPresent)
  @IsInt()
  @Min(0)
  priceCents?: number;
}
