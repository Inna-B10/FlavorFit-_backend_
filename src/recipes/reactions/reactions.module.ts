import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsResolver } from './reactions.resolver';

@Module({
  providers: [ReactionsResolver, ReactionsService],
})
export class ReactionsModule {}
