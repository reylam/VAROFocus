import { Controller, UseGuards, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { CreateFocusSessionDto } from './dto/create-focus-session.dto';
import { UpdateFocusSessionDto } from './dto/update-focus-session.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('focus-sessions')
@UseGuards(SupabaseAuthGuard)
export class FocusSessionsController {
  constructor(private readonly focusSessionsService: FocusSessionsService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createFocusSessionDto: CreateFocusSessionDto) {
    return this.focusSessionsService.create({ ...createFocusSessionDto, user_id: userId });
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.focusSessionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.focusSessionsService.findOne(userId, id);
  }

  @Patch(':id')
  update(@CurrentUser('id') userId: string, @Param('id') id: string, @Body() updateFocusSessionDto: UpdateFocusSessionDto) {
    return this.focusSessionsService.update(userId, id, updateFocusSessionDto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.focusSessionsService.remove(userId, id);
  }
}
