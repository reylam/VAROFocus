import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TasksModule } from './tasks/tasks.module';
import { FocusSessionsModule } from './focus-sessions/focus-sessions.module';
import { MonstersModule } from './monsters/monsters.module';
import { AchievementsModule } from './achievements/achievements.module';
import { DailyQuestsModule } from './daily-quests/daily-quests.module';
import { LevelRewardsModule } from './level-rewards/level-rewards.module';

@Module({
  imports: [
    SupabaseModule,
    ProfilesModule,
    TasksModule,
    FocusSessionsModule,
    MonstersModule,
    AchievementsModule,
    DailyQuestsModule,
    LevelRewardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

