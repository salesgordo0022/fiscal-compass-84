
-- Tabela para persistir dados das empresas da Planilha Geral
CREATE TABLE public.planilha_geral_empresas (
  id TEXT NOT NULL PRIMARY KEY,
  cod TEXT DEFAULT '',
  cnpj TEXT DEFAULT '',
  empresa TEXT NOT NULL,
  solicitacao BOOLEAN DEFAULT false,
  despesas BOOLEAN DEFAULT false,
  mister_cont_dig BOOLEAN DEFAULT false,
  conferir_extratos BOOLEAN DEFAULT false,
  conciliacao_impostos BOOLEAN DEFAULT false,
  darf BOOLEAN DEFAULT false,
  anotacao TEXT DEFAULT '',
  trimestre_num TEXT DEFAULT '',
  data_fechamento TEXT DEFAULT '',
  trimestre TEXT DEFAULT '',
  lalur TEXT DEFAULT '',
  cont_digital TEXT DEFAULT '',
  regime TEXT DEFAULT '',
  situacao TEXT DEFAULT '',
  mensalidades TEXT DEFAULT '',
  regime_ano_anterior TEXT DEFAULT '',
  tab TEXT NOT NULL DEFAULT 'lucro-real', -- qual aba a empresa pertence
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.planilha_geral_empresas ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ler
CREATE POLICY "Authenticated users can read empresas"
ON public.planilha_geral_empresas FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Todos os usuários autenticados podem inserir
CREATE POLICY "Authenticated users can insert empresas"
ON public.planilha_geral_empresas FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Todos os usuários autenticados podem atualizar
CREATE POLICY "Authenticated users can update empresas"
ON public.planilha_geral_empresas FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Todos os usuários autenticados podem deletar
CREATE POLICY "Authenticated users can delete empresas"
ON public.planilha_geral_empresas FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Tabela para persistir dados salvos (checklist, anotações, etc.)
CREATE TABLE public.planilha_geral_saved_data (
  empresa_id TEXT NOT NULL PRIMARY KEY,
  codigo TEXT DEFAULT '',
  cnpj TEXT DEFAULT '',
  checklist_items JSONB DEFAULT '[]',
  anotacoes JSONB DEFAULT '[]',
  trimestre TEXT DEFAULT '',
  lalur JSONB DEFAULT '{}',
  cont_digital TEXT DEFAULT '',
  regime TEXT DEFAULT '',
  situacao TEXT DEFAULT '',
  mensalidades TEXT DEFAULT '',
  regime_ano_anterior TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.planilha_geral_saved_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read saved data"
ON public.planilha_geral_saved_data FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert saved data"
ON public.planilha_geral_saved_data FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update saved data"
ON public.planilha_geral_saved_data FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete saved data"
ON public.planilha_geral_saved_data FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Trigger para updated_at
CREATE TRIGGER update_planilha_geral_empresas_updated_at
BEFORE UPDATE ON public.planilha_geral_empresas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planilha_geral_saved_data_updated_at
BEFORE UPDATE ON public.planilha_geral_saved_data
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
