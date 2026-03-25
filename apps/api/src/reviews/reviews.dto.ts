import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateReviewDto {
  @IsString()
  translator_id!: string;

  @IsString()
  translation_id!: string;

  @IsObject()
  ratings!: {
    translation_quality: number;
    communication: number;
    deadline_compliance: number;
  };

  @IsOptional()
  @IsString()
  comment?: string;
}

export class QueryReviewDto {
  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  size?: number;
}
