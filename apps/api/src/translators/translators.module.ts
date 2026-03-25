import { Module } from "@nestjs/common";
import { TranslatorsController } from "./translators.controller";
import { TranslatorsService } from "./translators.service";

@Module({
  controllers: [TranslatorsController],
  providers: [TranslatorsService],
})
export class TranslatorsModule {}
