import { Module } from "@nestjs/common";
import { QuotationsModule } from "../quotations/quotations.module";
import { SupabaseModule } from "../supabase/supabase.module";
import { TranslationsController } from "./translations.controller";
import { TranslationsService } from "./translations.service";

@Module({
  imports: [SupabaseModule, QuotationsModule],
  controllers: [TranslationsController],
  providers: [TranslationsService],
})
export class TranslationsModule {}
