import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateQuotationDto {
  @IsString()
  translation_id!: string;

  @IsObject()
  fee!: { unit: string; value: number };

  @IsOptional()
  @IsString()
  detail?: string;
}

export class UpdateQuotationDto {
  @IsOptional()
  @IsObject()
  fee?: { unit: string; value: number };

  @IsOptional()
  @IsString()
  detail?: string;
}
