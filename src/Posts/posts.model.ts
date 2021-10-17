import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  likes: { type: Array, required: true },
  image: { type: String, required: true },
  OPName: { type: String, required: true },
  OPAvatar: { type: String, required: true },
  OPCaption: { type: String, required: true },
  creationDate: { type: String, required: true },
});

export interface IPost extends mongoose.Document {
  likes: Array<string>;
  image: string;
  OPName: string;
  OPAvatar: string;
  OPCaption: string;
  creationDate: string;
}

export interface IPostMock {
  likes: Array<string>;
  image: string;
  OPName: string;
  OPAvatar: string;
  OPCaption: string;
  creationDate: string;
}

export interface IPostComments extends mongoose.Document {
  postId: string;
  comments: Array<ICommentMock>;
}
export interface IPostCommentsMock {
  postID: string;
  comments: Array<ICommentMock>;
}

export interface ICommentMock {
  OPName: string;
  content: string;
  likes: Array<string>;
}
