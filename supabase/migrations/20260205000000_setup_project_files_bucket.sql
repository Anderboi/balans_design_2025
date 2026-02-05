-- Create project_files storage bucket for project documentation
-- This bucket will store BTI plans, measurement plans, and other project documents

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project_files',
  'project_files',
  true, -- Public bucket so files can be accessed via public URLs
  52428800, -- 50MB file size limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/acad', -- AutoCAD DWG
    'image/vnd.dwg',
    'image/x-dwg',
    'application/dxf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for project_files bucket

-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project_files' AND
  (storage.foldername(name))[1] = 'documents'
);

-- Policy 2: Allow public access to view/download files (since bucket is public)
CREATE POLICY "Public access to project files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project_files');

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete project files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project_files');

-- Policy 4: Allow authenticated users to update files (for potential future use)
CREATE POLICY "Authenticated users can update project files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project_files')
WITH CHECK (bucket_id = 'project_files');
