import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async create(dto: CreateTaskDto) {
    const { data, error } = await this.supabase.from('tasks').insert(dto).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabase.from('tasks').select('*').eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(userId: string, id: string) {
    const { data, error } = await this.supabase.from('tasks').select('*').eq('id', id).eq('user_id', userId).single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const { data, error } = await this.supabase.from('tasks').update(dto).eq('id', id).eq('user_id', userId).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async remove(userId: string, id: string) {
    const { data, error } = await this.supabase.from('tasks').delete().eq('id', id).eq('user_id', userId).select().single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }
}
