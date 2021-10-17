import { PostSchema } from './posts.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { JwtModule } from '@nestjs/jwt';
import { CommentsModule } from 'src/Comments/comments.module';

@Module({
  imports: [
    CommentsModule,
    MongooseModule.forFeature([
      { name: 'IPost', schema: PostSchema, collection: 'Posts' },
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
