-- Create the app_role enum
CREATE TYPE app_role AS ENUM (
  'admin',
  'architect',
  'manager',
  'designer',
  'client',
  'contractor'
);

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'designer'::app_role;

-- Update RLS policies to allow admins to update roles
-- This assumes existing RLS exists. We'll simply ensure the column is there first.
-- You might need to adjust policies manually if strict column security is in place.
