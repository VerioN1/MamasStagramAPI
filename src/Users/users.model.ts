import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, index: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  posts: { type: Array, required: true },
  followers: { type: Array, required: true },
  followings: { type: Array, required: true },
  personalName: { type: String, required: true },
});
UserSchema.plugin(mongoosePaginate);
export default UserSchema;
export interface IUser extends mongoose.Document {
  userName: string;
  avatar: string;
  personalName: string;
  posts: Array<string>;
  followers: Array<string>;
  followings: Array<string>;
  password: string;
}
export interface IUserMock {
  personalName: string;
  userName: string;
  avatar: string;
  posts: Array<string>;
  followers: Array<string>;
  followings: Array<string>;
  password: string;
}
export interface IUserCreds {
  userName: string;
  password: string;
}
