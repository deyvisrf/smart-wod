# Script para configurar o SmartWod com Supabase
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Configuração do SmartWod" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se .env.local existe
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "✓ Arquivo .env.local já existe" -ForegroundColor Green
    $overwrite = Read-Host "Deseja sobrescrever? (s/n)"
    if ($overwrite -ne 's') {
        Write-Host "Configuração cancelada." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "Para configurar o Supabase, você precisa:" -ForegroundColor Yellow
Write-Host "1. Criar uma conta em https://supabase.com" -ForegroundColor White
Write-Host "2. Criar um novo projeto" -ForegroundColor White
Write-Host "3. Ir em Settings > API para pegar as credenciais" -ForegroundColor White
Write-Host ""

# Solicitar URL do Supabase
Write-Host "Cole a URL do seu projeto Supabase" -ForegroundColor Cyan
Write-Host "(Ex: https://abcdefghijklmnop.supabase.co)" -ForegroundColor Gray
$supabaseUrl = Read-Host "URL"

# Validar URL
if ($supabaseUrl -notmatch "^https://.*\.supabase\.co$") {
    Write-Host "⚠ URL parece inválida. Certifique-se que é uma URL do Supabase." -ForegroundColor Yellow
}

# Solicitar Anon Key
Write-Host ""
Write-Host "Cole a chave anon/public do seu projeto" -ForegroundColor Cyan
Write-Host "(É uma string longa que começa com 'eyJ...')" -ForegroundColor Gray
$supabaseKey = Read-Host "Anon Key"

# Validar Key
if ($supabaseKey.Length -lt 50) {
    Write-Host "⚠ Chave parece muito curta. Certifique-se que copiou corretamente." -ForegroundColor Yellow
}

# Criar arquivo .env.local
$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey

# Google OAuth Configuration
# Configure em: Authentication > Providers no painel do Supabase
# Site URL: http://localhost:3000
# Redirect URLs: http://localhost:3000/auth/callback
"@

# Salvar arquivo
$envContent | Out-File -FilePath $envFile -Encoding utf8
Write-Host ""
Write-Host "✓ Arquivo .env.local criado com sucesso!" -ForegroundColor Green

# Instruções finais
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Próximos passos:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configure o Google OAuth no Supabase:" -ForegroundColor Yellow
Write-Host "   - Vá em Authentication > Providers" -ForegroundColor White
Write-Host "   - Ative o Google" -ForegroundColor White
Write-Host "   - Configure com:" -ForegroundColor White
Write-Host "     Site URL: http://localhost:3000" -ForegroundColor Gray
Write-Host "     Redirect: http://localhost:3000/auth/callback" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Reinicie o servidor:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Acesse http://localhost:3000/setup para verificar" -ForegroundColor Yellow
Write-Host ""
Write-Host "Configuração concluída!" -ForegroundColor Green


