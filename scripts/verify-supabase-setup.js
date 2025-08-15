#!/usr/bin/env node

/**
 * Script de verificação do setup do Supabase
 * Execute: node scripts/verify-supabase-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do Supabase...\n');

// Verificar arquivo .env.local
console.log('1. Verificando variáveis de ambiente...');
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado');
  console.log('   Crie o arquivo .env.local na raiz do projeto');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.log('❌ Variáveis do Supabase não encontradas no .env.local');
  console.log('   Certifique-se de ter:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Variáveis de ambiente configuradas');

// Verificar se os arquivos SQL existem
console.log('\n2. Verificando scripts SQL...');
const sqlFiles = [
  'supabase/migrations/001_initial_tables.sql',
  'supabase/migrations/002_rls_policies.sql',
  'supabase/migrations/003_functions_triggers.sql',
  'supabase/migrations/004_storage_setup.sql'
];

let missingFiles = [];
sqlFiles.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Scripts SQL não encontrados:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  process.exit(1);
}

console.log('✅ Scripts SQL encontrados');

// Verificar dependências do Supabase
console.log('\n3. Verificando dependências...');
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ package.json não encontrado');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

const requiredDeps = [
  '@supabase/supabase-js',
  '@supabase/auth-helpers-nextjs',
  '@supabase/auth-ui-react',
  '@supabase/auth-ui-shared'
];

let missingDeps = [];
requiredDeps.forEach(dep => {
  if (!dependencies[dep]) {
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.log('❌ Dependências do Supabase não instaladas:');
  missingDeps.forEach(dep => console.log(`   - ${dep}`));
  console.log('\n   Execute: npm install ' + missingDeps.join(' '));
  process.exit(1);
}

console.log('✅ Dependências instaladas');

// Verificar arquivos criados
console.log('\n4. Verificando arquivos de integração...');
const requiredFiles = [
  'lib/supabase.ts',
  'contexts/AuthContext.tsx',
  'app/auth/login/page.tsx',
  'app/auth/callback/route.ts',
  'middleware.ts'
];

let missingIntegrationFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    missingIntegrationFiles.push(file);
  }
});

if (missingIntegrationFiles.length > 0) {
  console.log('❌ Arquivos de integração não encontrados:');
  missingIntegrationFiles.forEach(file => console.log(`   - ${file}`));
  process.exit(1);
}

console.log('✅ Arquivos de integração criados');

// Verificar se o middleware está configurado
console.log('\n5. Verificando middleware...');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

if (!middlewareContent.includes('createMiddlewareClient')) {
  console.log('❌ Middleware não configurado corretamente');
  process.exit(1);
}

console.log('✅ Middleware configurado');

// Verificar layout atualizado
console.log('\n6. Verificando layout...');
const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('AuthProvider')) {
  console.log('❌ AuthProvider não adicionado ao layout');
  process.exit(1);
}

console.log('✅ Layout atualizado com AuthProvider');

console.log('\n🎉 Verificação concluída com sucesso!');
console.log('\n📋 Checklist para o Supabase:');
console.log('   1. ✅ Criar projeto no Supabase (https://supabase.com)');
console.log('   2. ✅ Configurar variáveis no .env.local');
console.log('   3. ⏳ Executar scripts SQL no SQL Editor');
console.log('   4. ⏳ Configurar Auth settings');
console.log('   5. ⏳ Configurar OAuth (opcional)');
console.log('   6. ⏳ Testar login/cadastro');
console.log('\n🚀 Execute npm run dev para testar!');
