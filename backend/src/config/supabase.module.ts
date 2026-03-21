import { Global, Module } from '@nestjs/common';
import { supabaseProvider } from './supabase.config';

@Global()
@Module({
  providers: [supabaseProvider],
  exports: [supabaseProvider],
})
export class SupabaseModule {}
