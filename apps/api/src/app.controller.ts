import { Controller, Get } from "@nestjs/common";
import type { AppService } from "./app.service";
import { Public } from "./common/decorators/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get("health")
  getHealth() {
    return {
      code: "200",
      message: "OK",
      data: "OK",
    };
  }
}
