import { apiError, supabaseError } from "@/lib/api/errors";
import { assertValidTable } from "@/lib/api/resources";
import { getTableColumns } from "@/lib/supabase/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getWritableColumns(table) {
  return getTableColumns(table)
    .filter((column) => !column.isPrimaryKey && column.name !== "created_at")
    .map((column) => column.name);
}

function pickWritablePayload(table, body) {
  const writableColumns = new Set(getWritableColumns(table));

  return Object.fromEntries(
    Object.entries(body ?? {}).filter(([key]) => writableColumns.has(key)),
  );
}

function getResourceLabel(table) {
  return table.replace(/_/g, " ");
}

export function createCollectionHandlers(table) {
  assertValidTable(table);
  const label = getResourceLabel(table);

  return {
    async GET() {
      try {
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          return supabaseError(error, `Failed to fetch ${label}.`);
        }

        return Response.json(data);
      } catch (error) {
        return apiError(error.message, 500);
      }
    },

    async POST(request) {
      try {
        const body = await request.json();
        const payload = pickWritablePayload(table, body);

        if (Object.keys(payload).length === 0) {
          return apiError("Request body must include at least one writable field.", 400);
        }

        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from(table)
          .insert(payload)
          .select()
          .single();

        if (error) {
          return supabaseError(error, `Failed to create ${label}.`);
        }

        return Response.json(data, { status: 201 });
      } catch (error) {
        return apiError(error.message, 500);
      }
    },
  };
}

export function createItemHandlers(table) {
  assertValidTable(table);
  const label = getResourceLabel(table);

  return {
    async GET(_request, { params }) {
      try {
        const { id } = await params;
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return apiError(`${label} not found.`, 404);
          }

          return supabaseError(error, `Failed to fetch ${label}.`);
        }

        return Response.json(data);
      } catch (error) {
        return apiError(error.message, 500);
      }
    },

    async PATCH(request, { params }) {
      try {
        const { id } = await params;
        const body = await request.json();
        const payload = pickWritablePayload(table, body);

        if (Object.keys(payload).length === 0) {
          return apiError("Request body must include at least one writable field.", 400);
        }

        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from(table)
          .update(payload)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return apiError(`${label} not found.`, 404);
          }

          return supabaseError(error, `Failed to update ${label}.`);
        }

        return Response.json(data);
      } catch (error) {
        return apiError(error.message, 500);
      }
    },

    async DELETE(_request, { params }) {
      try {
        const { id } = await params;
        const supabase = createSupabaseServerClient();
        const { data, error } = await supabase
          .from(table)
          .delete()
          .eq("id", id)
          .select()
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return apiError(`${label} not found.`, 404);
          }

          return supabaseError(error, `Failed to delete ${label}.`);
        }

        return Response.json(data);
      } catch (error) {
        return apiError(error.message, 500);
      }
    },
  };
}
