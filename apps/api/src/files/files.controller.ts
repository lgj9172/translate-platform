import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Express } from "express";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FilesService } from "./files.service";

@ApiTags("Files")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: "파일 업로드" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @CurrentUser() user: SupabaseUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );
    return this.filesService.upload(
      user.id,
      file.buffer,
      originalName,
      file.mimetype,
    );
  }

  @Get(":fileId")
  @ApiOperation({ summary: "파일 정보 및 Presigned URL 조회" })
  findOne(@Param("fileId") fileId: string) {
    return this.filesService.findOne(fileId);
  }

  @Delete(":fileId")
  @ApiOperation({ summary: "파일 삭제" })
  remove(
    @CurrentUser() user: SupabaseUser,
    @Param("fileId") fileId: string,
  ) {
    return this.filesService.remove(fileId, user.id);
  }
}
