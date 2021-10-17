/* eslint-disable prettier/prettier */
import UserSchema from './users.model';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IUser', schema: UserSchema, collection: 'Users' },
    ]),
    JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '1d' },
      }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
