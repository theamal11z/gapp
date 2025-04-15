-- Drop existing trigger and function that's causing permission issues
DROP TRIGGER IF EXISTS on_address_change ON addresses;
DROP FUNCTION IF EXISTS update_profile_address_count();

-- Create a new version of the function that doesn't use session_replication_role
CREATE OR REPLACE FUNCTION update_profile_address_count_safe()
RETURNS TRIGGER AS $$
DECLARE
  addr_count integer;
BEGIN
  -- Count addresses for the affected user
  SELECT COUNT(*) INTO addr_count
  FROM addresses
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  -- Update the profile's address_count without using session_replication_role
  UPDATE profiles
  SET address_count = addr_count
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a new trigger with the safer function
CREATE TRIGGER on_address_change_safe
  AFTER INSERT OR UPDATE OR DELETE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_address_count_safe();

-- Add missing RLS policies for addresses table if they don't exist
DO $$ 
BEGIN
  -- Policy for selecting addresses (users can view their own addresses)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'addresses' 
    AND policyname = 'Users can view own addresses'
  ) THEN
    CREATE POLICY "Users can view own addresses"
      ON addresses FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Policy for inserting addresses (users can add their own addresses)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'addresses' 
    AND policyname = 'Users can insert own addresses'
  ) THEN
    CREATE POLICY "Users can insert own addresses"
      ON addresses FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Policy for updating addresses (users can update their own addresses)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'addresses' 
    AND policyname = 'Users can update own addresses'
  ) THEN
    CREATE POLICY "Users can update own addresses"
      ON addresses FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Policy for deleting addresses (users can delete their own addresses)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'addresses' 
    AND policyname = 'Users can delete own addresses'
  ) THEN
    CREATE POLICY "Users can delete own addresses"
      ON addresses FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Enable RLS on addresses table if not already enabled
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
