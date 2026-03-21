import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn, IsUrl } from 'class-validator';

export class CreateMonsterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['slime', 'goblin', 'orc', 'dragon', 'demon'])
  type: string;

  @IsNumber()
  max_hp: number;

  @IsNumber()
  current_hp: number;

  @IsNumber()
  attack_power: number;

  @IsNumber()
  xp_reward: number;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
