import { Module } from "@nestjs/common";
import { FilesModule } from "../files/files.module";
import { QuotationsModule } from "../quotations/quotations.module";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  imports: [QuotationsModule, FilesModule],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
