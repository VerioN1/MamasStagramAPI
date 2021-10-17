/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IPostComments } from './comments.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('IPostComments')
    private readonly commentsModel: Model<IPostComments>,
  ) {}

  async findPostComments(postId : string) {
    const postComments = await this.commentsModel.findOne({postId: postId})
    return postComments;
  }
  async createPostComment(postId : string){
      const newPostComment = new this.commentsModel({
          postId: postId,
          comments: []
      })
      await newPostComment.save();
  }
  async addComment(postId : string, OPName: string, content: string){
      try {
          const postComments = await this.commentsModel.findOne({postId: postId})
          postComments.comments.push({
              'id': uuidv4(),
              'OPName': OPName,
              'content': content,
              'likes' : []
          })
          const result = await postComments.save();
          return result;
      } catch (error) {
          console.log(error)
          throw error;
      }
  }
  async getComments(postsIDs : Array<string>){
    postsIDs.map(async (id) => {
        return await this.findPostComments(id)
    })
  }

}
