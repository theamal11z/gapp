import { ExpoConfig } from 'expo/config';

// Read in the EXPO_PUBLIC_* variables from .env.local
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Get the config from app.json
const config = require('./app.json');

// Add the extra fields
const expoConfig = {
  ...config.expo,
  owner: "theamal11qf",
  extra: {
    ...config.expo.extra,
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    eas: {
      projectId: "e5cc6764-5f39-4915-a542-addf3d203474"
    },
  },
};

// Export it
export default () => expoConfig; 