import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { SUPABASE_CLIENT } from '../../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      throw new UnauthorizedException('Invalid Supabase auth token');
    }

    request.user = {
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata,
    };

    return true;
  }
}
