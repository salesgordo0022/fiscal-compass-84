-- Deleta as empresas da aba Simples Nacional que não fazem parte da última importação (as últimas 35 inseridas)
DELETE FROM public.planilha_geral_empresas
WHERE tab = 'simples-nacional'
AND id NOT IN (
    SELECT id 
    FROM public.planilha_geral_empresas 
    WHERE tab = 'simples-nacional'
    ORDER BY created_at DESC 
    LIMIT 35
);