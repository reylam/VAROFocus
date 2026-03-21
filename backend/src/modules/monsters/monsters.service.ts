import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';

@Injectable()
export class MonstersService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(dto: CreateMonsterDto) {
    const { data, error } = await this.supabase.from('monsters').insert(dto).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.from('monsters').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.from('monsters').select('*').eq('id', id).single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateMonsterDto) {
    const { data, error } = await this.supabase.from('monsters').update(dto).eq('id', id).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabase.from('monsters').delete().eq('id', id).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }
}
