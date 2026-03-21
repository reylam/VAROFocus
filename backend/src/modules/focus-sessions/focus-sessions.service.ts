import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateFocusSessionDto } from './dto/create-focus-session.dto';
import { UpdateFocusSessionDto } from './dto/update-focus-session.dto';

@Injectable()
export class FocusSessionsService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(dto: CreateFocusSessionDto) {
    const { data, error } = await this.supabase.from('focus_sessions').insert(dto).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabase.from('focus_sessions').select('*').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(userId: string, id: string) {
    const { data, error } = await this.supabase.from('focus_sessions').select('*').eq('id', id).eq('user_id', userId).single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(userId: string, id: string, dto: UpdateFocusSessionDto) {
    const { data, error } = await this.supabase.from('focus_sessions').update(dto).eq('id', id).eq('user_id', userId).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async remove(userId: string, id: string) {
    const { data, error } = await this.supabase.from('focus_sessions').delete().eq('id', id).eq('user_id', userId).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }
}
