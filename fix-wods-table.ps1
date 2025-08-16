# ========================================
# CORREÇÃO DA TABELA WODS
# ========================================

Write-Host "`n===========================================" -ForegroundColor Red
Write-Host "   🚨 PROBLEMA IDENTIFICADO!" -ForegroundColor Red
Write-Host "===========================================" -ForegroundColor Red

Write-Host "`n📋 O QUE ESTÁ ACONTECENDO:" -ForegroundColor Yellow
Write-Host "`n❌ A tabela 'wods' não existe no Supabase" -ForegroundColor Red
Write-Host "❌ Por isso não consegue salvar treinos" -ForegroundColor Red
Write-Host "❌ O feed fica vazio" -ForegroundColor Red

Write-Host "`n🔧 SOLUÇÃO:" -ForegroundColor Green
Write-Host "`n1. ABRIR SUPABASE DASHBOARD:" -ForegroundColor Cyan
Write-Host "   - Vá para: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   - Selecione seu projeto: jjsmoytzjhzdjxinhgen" -ForegroundColor White

Write-Host "`n2. EXECUTAR SCRIPT SQL:" -ForegroundColor Cyan
Write-Host "   - Clique em 'SQL Editor' no menu lateral" -ForegroundColor White
Write-Host "   - Clique em 'New query'" -ForegroundColor White
Write-Host "   - Cole o conteúdo do arquivo 'create-wods-table.sql'" -ForegroundColor White
Write-Host "   - Clique em 'Run' (▶️)" -ForegroundColor White

Write-Host "`n3. VERIFICAR RESULTADO:" -ForegroundColor Cyan
Write-Host "   - Deve aparecer uma tabela com as colunas da tabela wods" -ForegroundColor White
Write-Host "   - E uma tabela com as políticas RLS" -ForegroundColor White

Write-Host "`n🚀 DEPOIS DE EXECUTAR:" -ForegroundColor Green
Write-Host "`n✅ Poderá criar e salvar treinos" -ForegroundColor Green
Write-Host "✅ Os treinos aparecerão no feed" -ForegroundColor Green
Write-Host "✅ Todas as funcionalidades voltarão ao normal" -ForegroundColor Green

Write-Host "`n📁 ARQUIVO SQL CRIADO:" -ForegroundColor Yellow
Write-Host "   - 'create-wods-table.sql' na raiz do projeto" -ForegroundColor White

Write-Host "`n💡 DICA:" -ForegroundColor Cyan
Write-Host "   Se der erro, verifique se está logado no Supabase" -ForegroundColor White
Write-Host "   e se selecionou o projeto correto" -ForegroundColor White

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "   🎯 EXECUTE O SCRIPT E TESTE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Abrir o arquivo SQL para o usuário copiar
Write-Host "`n📋 ABRINDO ARQUIVO SQL..." -ForegroundColor Yellow
Start-Process "create-wods-table.sql"

Write-Host "`n✅ Arquivo aberto! Copie todo o conteúdo e cole no Supabase SQL Editor." -ForegroundColor Green
