import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';

@Injectable()
export class DailyQuestsService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findAll() {
    const { data, error } = await this.supabase.from('daily_quests').select('*').eq('is_active', true);
    if (error) throw new Error(error.message);
    return data;
  }

  async findAssigned(userId: string) {
    const { data, error } = await this.supabase.from('user_daily_quests').select('*, daily_quests(*)').eq('user_id', userId).eq('assigned_date', new Date().toISOString().slice(0, 10));
    if (error) throw new Error(error.message);
    return data;
  }

  async assignForUser(userId: string) {
    const { data, error } = await this.supabase.rpc('assign_daily_quests', { p_user_id: userId });
    if (error) throw new Error(error.message);
    return data;
  }
}
