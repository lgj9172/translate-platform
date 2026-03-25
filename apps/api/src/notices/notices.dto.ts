import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateNoticeDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsBoolean()
  is_important?: boolean;
}

export class UpdateNoticeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_important?: boolean;
}
