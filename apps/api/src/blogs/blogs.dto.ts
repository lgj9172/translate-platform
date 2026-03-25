import { IsOptional, IsString } from "class-validator";

export class CreateBlogDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class CreateBlogCommentDto {
  @IsString()
  content!: string;
}
