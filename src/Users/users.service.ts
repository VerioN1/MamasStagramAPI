/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserCreds, IUserMock } from './users.model';
import * as bcrypt from 'bcrypt';

 
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('IUser') private readonly usersModule: Model<IUser>,
  ) {}
  async createUser(user : IUserMock){
    const doesUserExists = await this.usersModule.findOne({userName: user.userName})
    if(doesUserExists){
        throw new Error("User already exists");
    }
    const newUser = new this.usersModule({
        ...user
    });

    const status = await newUser.save();
    console.log(status);
    return newUser;
    }
    async authUser(user: IUserCreds) : Promise<IUserMock> {
        
        try{
            const foundUser = await this.findUser(user.userName);
            const isAuth = await bcrypt.compare(user.password, foundUser.password);
            if (isAuth) {
                return foundUser;
            }
            else {
                throw new UnauthorizedException('your password was incorrect');
              }
        }
        catch(error) {
            throw error;
          }
    }
    async findUser(userName : string) : Promise<IUser>{
        const foundUser : IUser = await this.usersModule.findOne({userName: userName})
        if(foundUser){
            return foundUser
        }else{
            throw new NotFoundException('your user name does not exists');
        }
    }
    async addUserAvatar(userName : string, avatarPath : string) : Promise<boolean> {
        try {
            await this.usersModule.findOneAndUpdate({userName: userName}, {avatar: avatarPath}, {new: true})
            return true;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    async followORUnFollow(followedUser: string, followingUser: string){
        try {
            const user = await this.usersModule.findOne({userName: followedUser})
            if(user.followers.includes(followingUser)){
                user.followers = user.followers.filter(value => value != followingUser);
                return await user.save();
            }else{
                user.followers.push(followingUser);
                return await user.save();
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    async SearchByUserName(userName: string){
        const options = {
            page: 1,
            limit: 2,
            offset: 1
        }
        try {
            if(userName === '*'){
                //@ts-ignore
                const users = await this.usersModule.paginate({},options)
                console.log(users)
            }
            const users = await this.usersModule.find({userName: {$regex : `${userName}.*`}})
            return users;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}