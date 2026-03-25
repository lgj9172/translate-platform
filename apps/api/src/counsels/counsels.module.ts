import { Module } from "@nestjs/common";
import { CounselsController } from "./counsels.controller";
import { CounselsService } from "./counsels.service";

@Module({
  controllers: [CounselsController],
  providers: [CounselsService],
})
export class CounselsModule {}
