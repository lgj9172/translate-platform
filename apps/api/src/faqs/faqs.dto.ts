import { IsOptional, IsString } from "class-validator";

export class CreateFaqDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;
}

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
