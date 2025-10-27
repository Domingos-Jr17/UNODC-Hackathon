#!/usr/bin/env node
import { execSync } from 'child_process';
import * as path from 'path';

// Compile TypeScript files
console.log('🔨 Compiling TypeScript files...');
try {
  execSync('npx tsc src/simple-server.ts --target ES2020 --module commonjs --outDir dist --esModuleInterop --skipLibCheck', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');

  // Run the compiled JavaScript
  console.log('🚀 Starting server...');
  require('./dist/simple-server.js');
} catch (error: any) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}