# Script PowerShell para executar o script SQL no Supabase
# Execute este script para abrir o Supabase SQL Editor automaticamente

Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "   🚀 EXECUTANDO SCRIPT NO SUPABASE!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

Write-Host "`n📋 PASSO A PASSO:" -ForegroundColor Yellow

Write-Host "`n1️⃣ ABRIR SUPABASE SQL EDITOR:" -ForegroundColor Cyan
Write-Host "   - Clique no link abaixo:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/jjsmoytzjhzdjxinhgen/sql" -ForegroundColor Green

Write-Host "`n2️⃣ EXECUTAR O SCRIPT:" -ForegroundColor Cyan
Write-Host "   - Cole todo o conteúdo do arquivo 'fix-all-tables.sql'" -ForegroundColor White
Write-Host "   - Clique em 'Run' (▶️)" -ForegroundColor White

Write-Host "`n3️⃣ VERIFICAR RESULTADO:" -ForegroundColor Cyan
Write-Host "   - O script mostrará um relatório no final" -ForegroundColor White
Write-Host "   - Deve aparecer: '✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!'" -ForegroundColor White

Write-Host "`n4️⃣ TESTAR LOGIN:" -ForegroundColor Cyan
Write-Host "   - Após executar o script, teste o login novamente" -ForegroundColor White
Write-Host "   - Deve funcionar perfeitamente agora!" -ForegroundColor White

Write-Host "`n🎯 O QUE O SCRIPT FAZ:" -ForegroundColor Yellow
Write-Host "   ✅ Cria 9 tabelas completas" -ForegroundColor Green
Write-Host "   ✅ Adiciona todas as colunas necessárias" -ForegroundColor Green
Write-Host "   ✅ Configura RLS e políticas de segurança" -ForegroundColor Green
Write-Host "   ✅ Cria índices para performance" -ForegroundColor Green
Write-Host "   ✅ Configura triggers automáticos" -ForegroundColor Green
Write-Host "   ✅ Cria perfis para usuários existentes" -ForegroundColor Green
Write-Host "   ✅ Adiciona 3 WODs de exemplo" -ForegroundColor Green

Write-Host "`n🔗 LINKS ÚTEIS:" -ForegroundColor Yellow
Write-Host "   - Supabase Dashboard: https://supabase.com/dashboard/project/jjsmoytzjhzdjxinhgen" -ForegroundColor Blue
Write-Host "   - SQL Editor: https://supabase.com/dashboard/project/jjsmoytzjhzdjxinhgen/sql" -ForegroundColor Blue

Write-Host "`n⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "   - Execute o script COMPLETO de uma vez" -ForegroundColor White
Write-Host "   - Não pare no meio da execução" -ForegroundColor White
Write-Host "   - Aguarde a mensagem de sucesso" -ForegroundColor White

Write-Host "`n🚀 PRONTO PARA EXECUTAR!" -ForegroundColor Green
Write-Host "   Abra o Supabase e execute o script!" -ForegroundColor White

# Aguardar input do usuário
Write-Host "`nPressione qualquer tecla para abrir o Supabase..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Abrir o Supabase no navegador
Start-Process "https://supabase.com/dashboard/project/jjsmoytzjhzdjxinhgen/sql"

Write-Host "`n✅ Supabase aberto! Execute o script agora!" -ForegroundColor Green
