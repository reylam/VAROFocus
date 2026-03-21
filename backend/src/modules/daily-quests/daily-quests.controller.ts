import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DailyQuestsService } from './daily-quests.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('daily-quests')
export class DailyQuestsController {
  constructor(private readonly dailyQuestsService: DailyQuestsService) {}

  @Get()
  findAll() {
    return this.dailyQuestsService.findAll();
  }

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  findAssigned(@CurrentUser('id') userId: string) {
    return this.dailyQuestsService.findAssigned(userId);
  }

  @Post('me/assign')
  @UseGuards(SupabaseAuthGuard)
  assign(@CurrentUser('id') userId: string) {
    return this.dailyQuestsService.assignForUser(userId);
  }
}
