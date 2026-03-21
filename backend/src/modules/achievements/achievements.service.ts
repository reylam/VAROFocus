import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';

@Injectable()
export class AchievementsService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll() {
    const { data, error } = await this.supabase.from('achievements').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async findUserAchievements(userId: string) {
    const { data, error } = await this.supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
  }
}
