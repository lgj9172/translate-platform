import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateTranslatorDto {
  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  introduction?: string;
}

export class UpdateTranslatorDto {
  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  introduction?: string;

  @IsOptional()
  @IsBoolean()
  is_draft?: boolean;
}

export class UpsertEducationDto {
  @IsOptional()
  @IsString()
  education_id?: string;

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

export class UpsertCareerDto {
  @IsOptional()
  @IsString()
  career_id?: string;

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

export class UpsertCertificationDto {
  @IsOptional()
  @IsString()
  certification_id?: string;

  @IsString()
  name!: string;

  @IsString()
  organization!: string;

  @IsString()
  started_at!: string;

  @IsString()
  file_id!: string;
}

export class UpsertSampleDto {
  @IsOptional()
  @IsString()
  translation_sample_id?: string;

  @IsString()
  source_language!: string;

  @IsString()
  target_language!: string;

  @IsString()
  source_text!: string;

  @IsString()
  target_text!: string;
}
