import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateFocusSessionDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsUUID()
  task_id?: string;

  @IsIn(['pomodoro', 'short_break', 'long_break'])
  type: string;

  @IsIn(['started', 'completed', 'interrupted'])
  status: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsNumber()
  actual_duration?: number;
}
