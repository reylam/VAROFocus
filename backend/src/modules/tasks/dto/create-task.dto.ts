import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  monster_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsIn(['easy', 'medium', 'hard', 'boss'])
  difficulty: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed', 'failed'])
  status?: string;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsNumber()
  estimated_minutes?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  is_daily_quest?: boolean;
}
