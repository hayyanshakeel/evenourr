/**
 * Health Check Handler
 */
async function handleHealthCheck(
  request: Request,
  env: any,
  corsHeaders: Record<string, string>
): Promise<Response> {
  return new Response(JSON.stringify({
    service: 'Evenour Edge Auth',
    status: 'healthy',
    edge: {
      colo: (request as any).cf?.colo,
      country: (request as any).cf?.country,
      httpProtocol: (request as any).cf?.httpProtocol
    },
    timestamp: new Date().toISOString()
  }), { status: 200, headers: corsHeaders });
}
