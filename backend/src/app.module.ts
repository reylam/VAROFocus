import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './config/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { MonstersModule } from './modules/monsters/monsters.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { FocusSessionsModule } from './modules/focus-sessions/focus-sessions.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { DailyQuestsModule } from './modules/daily-quests/daily-quests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    MonstersModule,
    ProfilesModule,
    TasksModule,
    FocusSessionsModule,
    AchievementsModule,
    DailyQuestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}