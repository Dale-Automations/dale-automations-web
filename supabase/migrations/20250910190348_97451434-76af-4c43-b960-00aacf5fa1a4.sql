-- Add language column to callback_leads table
ALTER TABLE public.callback_leads 
ADD COLUMN language TEXT DEFAULT 'es';