import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

const LANGUAGES = [
  "ko-KR",
  "en-US",
  "ja-JP",
  "zh-CN",
  "ru-RU",
  "es-ES",
  "ar-SA",
  "de-DE",
  "fr-FR",
] as const;

const _CATEGORIES = [
  "IT",
  "FINANCE",
  "CONTENTS",
  "GAME",
  "LAW",
  "MEDICAL",
  "CONSTRUCTION",
  "MARKETING",
  "LITERATURE",
  "ETC",
] as const;

export class SourceFileDto {
  @IsUUID()
  file_id!: string;

  @IsNumber()
  char_with_blank!: number;

  @IsNumber()
  char_without_blank!: number;

  @IsNumber()
  word!: number;
}

export class CreateTranslationDto {
  @IsString()
  title!: string;

  @IsIn(LANGUAGES)
  source_language!: string;

  @IsIn(LANGUAGES)
  target_language!: string;

  @IsArray()
  categories!: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SourceFileDto)
  source_files!: SourceFileDto[];

  @IsDateString()
  deadline!: string;

  @IsObject()
  fee!: { unit: string; value: number };

  @IsOptional()
  @IsString()
  sample?: string;
}

export class UpdateTranslationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsObject()
  fee?: { unit: string; value: number };
}

export class QueryTranslationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  start?: number;

  @IsOptional()
  @IsNumber()
  size?: number;
}

export class CreateCommentDto {
  @IsString()
  content!: string;
}

export class CreateTranslationQuotationDto {
  @IsObject()
  fee!: { unit: string; value: number };

  @IsOptional()
  @IsString()
  detail?: string;
}

export class SubmitTranslationDto {
  @IsArray()
  @IsString({ each: true })
  target_files!: string[];
}
