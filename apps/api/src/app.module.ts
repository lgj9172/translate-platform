import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BlogsModule } from "./blogs/blogs.module";
import { CounselsModule } from "./counsels/counsels.module";
import { FaqsModule } from "./faqs/faqs.module";
import { FilesModule } from "./files/files.module";
import { NoticesModule } from "./notices/notices.module";
import { PrismaModule } from "./prisma/prisma.module";
import { QuotationsModule } from "./quotations/quotations.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { SupabaseModule } from "./supabase/supabase.module";
import { TranslationsModule } from "./translations/translations.module";
import { TranslatorsModule } from "./translators/translators.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 우선순위: .env.local > .env.{NODE_ENV}
      envFilePath: [
        ".env.local",
        `.env.${process.env.NODE_ENV ?? "development"}`,
      ],
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    FilesModule,
    TranslationsModule,
    QuotationsModule,
    TranslatorsModule,
    CounselsModule,
    NoticesModule,
    FaqsModule,
    BlogsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
