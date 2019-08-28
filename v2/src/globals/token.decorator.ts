import { createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator((data, req) => {
    return data ? req.user[data] : req.user;
});
