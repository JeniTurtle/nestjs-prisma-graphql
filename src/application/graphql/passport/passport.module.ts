import { Module } from '@nestjs/common'
import { AdminPassportController } from './passport.controller'

@Module({
  controllers: [
    AdminPassportController,
  ],
})

export class AdminPassportModule {}