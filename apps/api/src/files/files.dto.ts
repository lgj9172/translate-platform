import { IsIn, IsString } from "class-validator";

const FILE_EXTENSIONS = ["PDF"] as const;

export class CreateFileDto {
  @IsString()
  name!: string;

  @IsIn(FILE_EXTENSIONS)
  extension!: string;
}
