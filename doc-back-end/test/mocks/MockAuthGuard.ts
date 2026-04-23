import { ExecutionContext } from "@nestjs/common";

export class MockAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    req.user = {
      sub: 1,
      email: 'test@test.com',
    };

    return true;
  }
}