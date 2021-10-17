import * as mongoose from 'mongoose';

export const PostCommentsSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  comments: { type: Array, required: true },
});

export interface IPostComments extends mongoose.Document {
  postId: string;
  comments: Array<IComment>;
}
export interface IPostCommentsMock {
  postID: string;
  comments: Array<IComment>;
}

export interface IComment {
  id: string;
  OPName: string;
  content: string;
  likes: Array<string>;
}
