/* eslint-disable prettier/prettier */
import { commentsController } from './comments.controller';
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostCommentsSchema } from './comments.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'IPostComments', schema: PostCommentsSchema, collection: 'Comments' },
    ]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [commentsController],
  providers: [CommentsService],
  exports: [CommentsService]
})
export class CommentsModule {}
