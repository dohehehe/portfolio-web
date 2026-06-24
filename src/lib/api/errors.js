export function apiError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

export function supabaseError(error, fallbackMessage) {
  return apiError(error?.message ?? fallbackMessage, 500);
}
