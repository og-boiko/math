// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

export function methodNotAllowed(): Response {
  return json({ error: 'method_not_allowed' }, { status: 405 });
}

export function badRequest(reason: string): Response {
  return json({ error: 'bad_request', reason }, { status: 400 });
}

export function unauthorized(): Response {
  return json({ error: 'unauthorized' }, { status: 401 });
}
