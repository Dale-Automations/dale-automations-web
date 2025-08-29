-- Crear tabla para almacenar leads del formulario
CREATE TABLE public.callback_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'called', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  called_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Habilitar Row Level Security (opcional si quieres que solo admins vean los leads)
ALTER TABLE public.callback_leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar leads (público)
CREATE POLICY "Anyone can insert callback leads" 
ON public.callback_leads 
FOR INSERT 
WITH CHECK (true);

-- Política para leer leads (solo autenticados - puedes ajustar según necesites)
CREATE POLICY "Authenticated users can view callback leads" 
ON public.callback_leads 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política para actualizar leads (solo autenticados)
CREATE POLICY "Authenticated users can update callback leads" 
ON public.callback_leads 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_callback_leads_updated_at
  BEFORE UPDATE ON public.callback_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejor performance
CREATE INDEX idx_callback_leads_status ON public.callback_leads(status);
CREATE INDEX idx_callback_leads_created_at ON public.callback_leads(created_at);
CREATE INDEX idx_callback_leads_phone ON public.callback_leads(phone);