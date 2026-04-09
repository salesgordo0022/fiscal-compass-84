
-- Drop existing overly permissive policies on planilha_geral_empresas
DROP POLICY IF EXISTS "Authenticated users can insert empresas" ON public.planilha_geral_empresas;
DROP POLICY IF EXISTS "Authenticated users can update empresas" ON public.planilha_geral_empresas;
DROP POLICY IF EXISTS "Authenticated users can delete empresas" ON public.planilha_geral_empresas;

-- Create admin-only write policies on planilha_geral_empresas
CREATE POLICY "Only admins can insert empresas"
  ON public.planilha_geral_empresas FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update empresas"
  ON public.planilha_geral_empresas FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete empresas"
  ON public.planilha_geral_empresas FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Drop existing overly permissive policies on planilha_geral_saved_data
DROP POLICY IF EXISTS "Authenticated users can insert saved data" ON public.planilha_geral_saved_data;
DROP POLICY IF EXISTS "Authenticated users can update saved data" ON public.planilha_geral_saved_data;
DROP POLICY IF EXISTS "Authenticated users can delete saved data" ON public.planilha_geral_saved_data;

-- Create admin-only write policies on planilha_geral_saved_data
CREATE POLICY "Only admins can insert saved data"
  ON public.planilha_geral_saved_data FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update saved data"
  ON public.planilha_geral_saved_data FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete saved data"
  ON public.planilha_geral_saved_data FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
