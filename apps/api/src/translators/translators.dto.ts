import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class QueryTranslatorDto {
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

  @IsOptional()
  @IsString()
  category?: string;
}

export class CreateEducationDto {
  @IsString()
  name!: string;

  @IsString()
  major!: string;

  @IsString()
  degree!: string;

  @IsString()
  graduation_status!: string;

  @IsString()
  started_at!: string;

  @IsString()
  ended_at!: string;

  @IsString()
  file_id!: string;
}

export class CreateCareerDto {
  @IsString()
  name!: string;

  @IsString()
  position!: string;

  @IsOptional()
  @IsString()
  achievement?: string;

  @IsOptional()
  @IsBoolean()
  is_employed?: boolean;

  @IsString()
  started_at!: string;

  @IsOptional()
  @IsString()
  ended_at?: string;

  @IsString()
  file_id!: string;
}

export class CreateCertificationDto {
  @IsString()
  name!: string;

  @IsString()
  organization!: string;

  @IsString()
  started_at!: string;

  @IsString()
  file_id!: string;
}

export class CreateSampleDto {
  @IsString()
  source_language!: string;

  @IsString()
  target_language!: string;

  @IsString()
  source_text!: string;

  @IsString()
  target_text!: string;
}

export class CreateTranslatorDto {
  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCareerDto)
  careers?: CreateCareerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCertificationDto)
  certifications?: CreateCertificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSampleDto)
  translation_samples?: CreateSampleDto[];
}

export class UpdateTranslatorDto {
  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEducationDto)
  educations?: CreateEducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCareerDto)
  careers?: CreateCareerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCertificationDto)
  certifications?: CreateCertificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSampleDto)
  translation_samples?: CreateSampleDto[];
}
