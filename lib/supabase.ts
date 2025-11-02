// This is a mock Supabase client.
// You should replace this with your actual Supabase client initialization.
export const supabase = {
  from: <T>(table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        maybeSingle: () => Promise.resolve({ data: null, error: null as { message: string } | null }),
      }),
    }),
  }),
};
