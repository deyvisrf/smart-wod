# ========================================
# CORRECAO DA TABELA WODS
# ========================================

Write-Host "===========================================" -ForegroundColor Red
Write-Host "   PROBLEMA IDENTIFICADO!" -ForegroundColor Red
Write-Host "===========================================" -ForegroundColor Red

Write-Host ""
Write-Host "O QUE ESTA ACONTECENDO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "X A tabela 'wods' nao existe no Supabase" -ForegroundColor Red
Write-Host "X Por isso nao consegue salvar treinos" -ForegroundColor Red
Write-Host "X O feed fica vazio" -ForegroundColor Red

Write-Host ""
Write-Host "SOLUCAO:" -ForegroundColor Green
Write-Host ""
Write-Host "1. ABRIR SUPABASE DASHBOARD:" -ForegroundColor Cyan
Write-Host "   - Va para: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   - Selecione seu projeto: jjsmoytzjhzdjxinhgen" -ForegroundColor White

Write-Host ""
Write-Host "2. EXECUTAR SCRIPT SQL:" -ForegroundColor Cyan
Write-Host "   - Clique em 'SQL Editor' no menu lateral" -ForegroundColor White
Write-Host "   - Clique em 'New query'" -ForegroundColor White
Write-Host "   - Cole o conteudo do arquivo 'create-wods-table.sql'" -ForegroundColor White
Write-Host "   - Clique em 'Run' (botao play)" -ForegroundColor White

Write-Host ""
Write-Host "3. VERIFICAR RESULTADO:" -ForegroundColor Cyan
Write-Host "   - Deve aparecer uma tabela com as colunas da tabela wods" -ForegroundColor White
Write-Host "   - E uma tabela com as politicas RLS" -ForegroundColor White

Write-Host ""
Write-Host "DEPOIS DE EXECUTAR:" -ForegroundColor Green
Write-Host ""
Write-Host "V Poderá criar e salvar treinos" -ForegroundColor Green
Write-Host "V Os treinos aparecerão no feed" -ForegroundColor Green
Write-Host "V Todas as funcionalidades voltarão ao normal" -ForegroundColor Green

Write-Host ""
Write-Host "ARQUIVO SQL CRIADO:" -ForegroundColor Yellow
Write-Host "   - 'create-wods-table.sql' na raiz do projeto" -ForegroundColor White

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "   EXECUTE O SCRIPT E TESTE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Abrir o arquivo SQL para o usuário copiar
Write-Host ""
Write-Host "ABRINDO ARQUIVO SQL..." -ForegroundColor Yellow
Start-Process "create-wods-table.sql"

Write-Host ""
Write-Host "Arquivo aberto! Copie todo o conteudo e cole no Supabase SQL Editor." -ForegroundColor Green

