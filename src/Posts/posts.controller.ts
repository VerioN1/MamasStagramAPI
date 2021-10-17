/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtService } from '@nestjs/jwt';
import { IPost, IPostMock } from './posts.model';
import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/StorageSettings';
import { CommentsService } from 'src/Comments/comments.service';
export class UserDto {
  userName: string;
}

@Controller('Posts')
export class PostsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private jwtService: JwtService,
  ) {}

  @Get('All')
  async getAllPosts(): Promise<IPostMock | IPostMock[]> {
    return await this.postsService.getAllPosts();
  }
  @Get('UserPosts')
  async getUsersPosts(@Body() body: UserDto, @Req() request: Request) {
    try {
      const jwtCookie = request.cookies['jwt'];
      await this.jwtService.verifyAsync(jwtCookie);
      const posts = await this.postsService.getUserPosts(body.userName);
      return posts;
    } catch (e) {
      throw e;
    }
  }
  @Post('AddOrRemoveLike')
  async AddLikeToPost(@Body() body, @Req() request: Request) {
    try {
      const jwtCookie = request.cookies['jwt'];
      await this.jwtService.verifyAsync(jwtCookie);
      const result = await this.postsService.addLikeToPost(
        body.postId,
        body.userName,
      );
      if (result) {
        return 'liked';
      } else {
        return 'disliked';
      }
    } catch (e) {
      console.log(e.message);
      return e.message;
    }
  }
  @Post('Create')
  @UseInterceptors(FileInterceptor('file', storage('PostsImages')))
  async addNewPost(
    @Body() body,
    @Req() request: Request,
    @UploadedFile() file,
  ): Promise<IPost> {
    try {
      const jwtCookie = request.cookies['jwt'];
      await this.jwtService.verifyAsync(jwtCookie);
      const postData = await this.postsService.insertNewPost({
        likes: [],
        image: file.filename,
        OPName: body.OPName,
        OPAvatar: body.OPAvatar,
        OPCaption: body.OPCaption,
        creationDate: Date.now().toString(),
      });
      this.commentsService.createPostComment(postData._id);
      return postData;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
