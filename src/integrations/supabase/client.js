
// Convert the Supabase client to JavaScript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cqdalqkmzqkfneoeblmh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGFscWttenFrZm5lb2VibG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTEzODMsImV4cCI6MjA1OTg2NzM4M30.JzaHcTkyuT6L4dc6U10AFDUyP9JtBAHl8YGrAq9C024";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
