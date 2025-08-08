import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { ok, fail } from '@/lib/api-error';
import { OrdersService } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.response) return guard.response;

  try {
    const stats = await OrdersService.getStats();
    return ok(stats);
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return fail('INTERNAL_ERROR', 'Failed to fetch order stats', 500);
  }
}
