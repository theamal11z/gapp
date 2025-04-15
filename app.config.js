import { ExpoConfig } from 'expo/config';

// Read in the EXPO_PUBLIC_* variables from .env.local
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Get the config from app.json
const config = require('./app.json');

// Add the extra fields
const expoConfig = {
  ...config.expo,
  owner: "theamal11q1",
  extra: {
    ...config.expo.extra,
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    eas: {
      projectId: "14094419-d37e-42a2-b7e4-25f6bdfc8109"
    },
  },
};

// Export it
export default () => expoConfig; 