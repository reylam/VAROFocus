import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findById(id: string) {
    const { data, error } = await this.supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateProfileDto) {
    const { data, error } = await this.supabase.from('profiles').update({ ...dto, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }
}
