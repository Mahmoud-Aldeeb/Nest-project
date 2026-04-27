/*
https://docs.nestjs.com/middleware#middleware
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log({
      headers: req.headers,
      method: req.method,
      hostname: req.hostname,
    });

    // const token = req.headers.authorization;
    // if (token && token === 'thisIsAToken') {
    //   next();
    // } else {
    //   res.status(401).json({ message: 'you are not allowed' });
    // }

    next();
  }
}
