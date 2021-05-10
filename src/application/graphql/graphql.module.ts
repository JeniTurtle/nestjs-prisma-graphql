import { ADMIN_TOKEN_HEADER } from '@/constant'
import { AuthModule } from '@/decorator'
import { AuthorModule } from './authors/author.module'
import { CommentModule } from './comments/comment.module'
import { PostModule } from './posts/post.module'
import { AdminPassportModule } from './passport/passport.module'

@AuthModule({
  header: ADMIN_TOKEN_HEADER,
  imports: [
    AuthorModule,
    CommentModule,
    PostModule,
    AdminPassportModule,
  ],
})

export class GraphQLModule {}
