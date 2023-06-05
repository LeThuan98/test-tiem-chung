import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomerAuth = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const customer = request.customer;

    return key ? customer && customer[key] : customer;
  },
);
