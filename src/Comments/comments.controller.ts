/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CommentsService } from './comments.service';

@Controller('Comments')
export class commentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private jwtService: JwtService,
  ) {}

  @Post('Create')
  async AddNewComment(@Body() body, @Req() req: Request) {
      try {          
          const { OPName, content, postId } = body;
          const commentExist = await this.commentsService.findPostComments(postId);
          if(commentExist){
            return await this.commentsService.addComment(postId, OPName, content);
          }
          else{
              await this.commentsService.createPostComment(postId);
              return await this.commentsService.addComment(postId, OPName, content);
          }
      } catch (error) {
          console.log(error)
          throw error;
      }
  }
  @Post('ByIds')
  async getCommentsById(@Body('postsID') postsID : Array<string> ){
        try {
            const result = this.commentsService.getComments(postsID);
            return result
        } catch (error) {
            console.log(error)
        }
  }
  @Get(':id')
  async getComment(@Param('id') id : string ){
        try {
            const result = await this.commentsService.findPostComments(id);
            return result
        } catch (error) {
            console.log(error)
        }
  }
}
