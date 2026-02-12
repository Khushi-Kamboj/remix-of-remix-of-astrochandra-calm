// This file provides OAuth integration with Supabase

import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple", opts?: SignInOptions) => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: opts?.redirect_uri || `${window.location.origin}/auth/callback`,
            skipBrowserRedirect: false,
          },
        });

        if (error) {
          return { error };
        }

        return { data, error: null };
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
  },
};
