import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module";
import { CounselsController } from "./counsels.controller";
import { CounselsService } from "./counsels.service";

@Module({
  imports: [FilesModule],
  controllers: [CounselsController],
  providers: [CounselsService],
})
export class CounselsModule {}
