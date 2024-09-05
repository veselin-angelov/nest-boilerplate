import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '@app/users/repositories';
import { compareSync } from 'bcrypt';

@Injectable()
export class BullBoardBasicAuthMiddleware implements NestMiddleware {
  public constructor(private readonly usersRepository: UserRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const credentials = req.get('authorization')?.split('Basic ')?.[1] ?? null;

    if (!credentials) {
      res.setHeader(
        'WWW-Authenticate',
        'Basic realm="Login to BUll", charset="UTF-8"',
      );
      res.sendStatus(401);
    } else {
      const [email, password] = Buffer.from(credentials, 'base64')
        .toString('ascii')
        .split(':');

      const user = await this.usersRepository.findOne({
        email,
      });

      if (!user || !compareSync(password, user.password)) {
        res.sendStatus(401);
        return;
      }

      next();
    }
  }
}
