/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/StorageSettings';

@Controller('/Auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('Register')
  @UseInterceptors(FileInterceptor('file', storage('usersAvatars')))
  async Register(
    @UploadedFile() file,
    @Body('userName') userName: string,
    @Body('password') password: string,
    @Body('personalName') personalName: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const user = await this.usersService.createUser({
        userName: userName,
        password: hashedPassword,
        avatar: file.filename,
        personalName: personalName,
        posts: [],
        followers: [],
        followings: [],
      });
      const jwt = await this.jwtService.signAsync({ id: userName });
      response.cookie('jwt', jwt, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 5 * 60 * 1000),
        domain: 'localhost',
      });
      return user;
    } catch (error) {
      console.log(error.message);
      throw new ForbiddenException(error.message);
    }
  }

  @Post('Login')
  async login(
    @Body('userName') userName: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.usersService.authUser({
        userName: userName,
        password: password,
      });
      const jwt = await this.jwtService.signAsync({ id: userName });
      response.cookie('jwt', jwt, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 500 * 60 * 1000),
        domain: 'localhost',
      });
      response.cookie('userName', userName, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 500 * 60 * 1000),
        domain: 'localhost',
      });
      return user;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
  @Get('LoginJWT')
  async loginJWT(@Req() request: Request) {
    try {
      const jwtCookie = request.cookies['jwt'];
      const userCookie = request.cookies['userName'];
      const jwtAuth = await this.jwtService.verifyAsync(jwtCookie);
      const userAuth = await this.usersService.findUser(userCookie);
      if (jwtAuth && userAuth) {
        return userAuth;
      }
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedException("couldn't find user");
    }
  }
  @Post('Logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    response.clearCookie('userName');
    return {
      message: 'success',
    };
  }
  @Post('FollowUser')
  async FollowOrUnFollowUser(
    @Body('followedUser') followedUser: string,
    @Body('followingUser') followingUser: string,
  ) {
    try {
      return await this.usersService.followORUnFollow(
        followedUser,
        followingUser,
      );
    } catch (error) {
      return error;
    }
  }
  @Get('SearchUser/:userName')
  async searchUser(@Param('userName') userName: string, @Req() req: Request) {
    console.log(req.query);
    try {
      const res = await this.usersService.SearchByUserName(userName);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
