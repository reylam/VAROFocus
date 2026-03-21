import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Controller('profiles')
@UseGuards(SupabaseAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getMe(@CurrentUser('id') userId: string) {
    return this.profilesService.findById(userId);
  }

  @Patch('me')
  updateMe(@CurrentUser('id') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(userId, updateProfileDto);
  }
}
