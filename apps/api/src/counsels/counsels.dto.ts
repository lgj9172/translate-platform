import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

const CATEGORIES = ["SUGGESTION", "REQUEST_CANCELLATION"] as const;

export class CreateCounselDto {
  @IsString()
  content!: string;

  @IsIn(CATEGORIES)
  category!: string;

  @IsOptional()
  @IsUUID()
  file_id?: string;
}

export class CreateAnswerDto {
  @IsString()
  content!: string;
}

export class UpdateAnswerDto {
  @IsString()
  content!: string;
}

export class QueryCounselDto {
  @IsOptional()
  @IsString()
  is_done?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  start?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number;
}
