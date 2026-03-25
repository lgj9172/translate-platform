import { IsIn, IsOptional, IsString } from "class-validator";

const CATEGORIES = ["SUGGESTION", "REQUEST_CANCELLATION"] as const;

export class CreateCounselDto {
  @IsString()
  content!: string;

  @IsIn(CATEGORIES)
  category!: string;

  @IsString()
  file_id!: string;
}

export class CreateAnswerDto {
  @IsString()
  content!: string;
}

export class QueryCounselDto {
  @IsOptional()
  @IsString()
  is_done?: string;
}
