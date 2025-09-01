-- =====================================================
-- MIGRATION: Add theme and color preferences to user_profiles
-- Date: 2024-12-01
-- =====================================================

-- Add theme and color preference columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
ADD COLUMN IF NOT EXISTS color_preference TEXT DEFAULT '#65b6ad';

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.theme_preference IS 'User theme preference: light or dark';
COMMENT ON COLUMN user_profiles.color_preference IS 'User selected color preference (hex color)';

-- Update existing records to have default values
UPDATE user_profiles 
SET 
  theme_preference = COALESCE(theme_preference, 'light'),
  color_preference = COALESCE(color_preference, '#65b6ad')
WHERE theme_preference IS NULL OR color_preference IS NULL;
