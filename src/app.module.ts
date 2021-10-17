import { CommentsModule } from './Comments/comments.module';
import { UsersModule } from './Users/users.module';
import { PostsModule } from './Posts/posts.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CommentsModule,
    UsersModule,
    PostsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/mamas-instagram'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
