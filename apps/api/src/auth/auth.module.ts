import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AdminGuard } from "./admin.guard";
import { AuthGuard } from "./auth.guard";

@Module({
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: AdminGuard },
  ],
})
export class AuthModule {}
