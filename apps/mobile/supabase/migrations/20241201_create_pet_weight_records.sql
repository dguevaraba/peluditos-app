-- MIGRATION: Create pet_weight_records table for weight tracking
-- Date: 2024-12-01

CREATE TABLE IF NOT EXISTS pet_weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
  weight_unit TEXT NOT NULL CHECK (weight_unit IN ('kg', 'lb')),
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pet_weight_records_pet_id ON pet_weight_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_pet_weight_records_date ON pet_weight_records(recorded_date);

-- Add RLS (Row Level Security)
ALTER TABLE pet_weight_records ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see weight records for their own pets
CREATE POLICY "Users can view their own pet weight records" ON pet_weight_records
  FOR SELECT USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert weight records for their own pets
CREATE POLICY "Users can insert weight records for their own pets" ON pet_weight_records
  FOR INSERT WITH CHECK (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can update weight records for their own pets
CREATE POLICY "Users can update their own pet weight records" ON pet_weight_records
  FOR UPDATE USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete weight records for their own pets
CREATE POLICY "Users can delete their own pet weight records" ON pet_weight_records
  FOR DELETE USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );

-- Add comments
COMMENT ON TABLE pet_weight_records IS 'Weight tracking records for pets over time';
COMMENT ON COLUMN pet_weight_records.weight IS 'Weight value in the specified unit';
COMMENT ON COLUMN pet_weight_records.weight_unit IS 'Unit of measurement (kg or lb)';
COMMENT ON COLUMN pet_weight_records.recorded_date IS 'Date when the weight was recorded';
COMMENT ON COLUMN pet_weight_records.notes IS 'Optional notes about the weight record';
