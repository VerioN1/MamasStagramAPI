import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost, IPostMock } from './posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('IPost') private readonly postsModule: Model<IPost>,
  ) {}

  async insertNewPost(PostData: IPostMock) {
    try {
      const newPost = new this.postsModule({
        ...PostData,
      });
      const didSave = await newPost.save();
      console.log(didSave);
      return didSave;
    } catch (e) {
      console.log(e);
    }
  }

  async getAllPosts(): Promise<Array<IPost>> {
    const posts: IPost[] = await this.postsModule.find({});
    return posts.reverse();
  }
  async getUserPosts(userName: string): Promise<Array<IPost>> {
    const posts: IPost[] = await this.postsModule.find({ OPName: userName });
    return posts.reverse();
  }
  async addLikeToPost(postId: string, userName: string): Promise<boolean> {
    const post: IPost = await this.postsModule.findById(postId);
    const isLiked = post.likes.find((value) => value == userName);
    if (isLiked) {
      post.likes = post.likes.filter((value) => value != userName);
      post.save();
      return false;
    } else {
      post.likes.push(userName);
      await post.save();
      return true;
    }
  }
}

export const PostMock: IPostMock = {
  likes: ['alono', 'nomore'],
  image: 'https://via.placeholder.com/150',
  OPName: 'Alon',
  OPAvatar: 'no matter',
  OPCaption: 'that my life',
  creationDate: new Date().toString(),
};
