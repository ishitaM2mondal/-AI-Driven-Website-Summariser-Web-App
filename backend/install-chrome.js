import { execSync } from 'child_process';

try {
  console.log('Installing Chrome for Puppeteer...');
  execSync('npx puppeteer browsers install chrome', { 
    stdio: 'inherit',
    env: { ...process.env, PUPPETEER_CACHE_DIR: './chrome-cache' }
  });
  console.log('Chrome installed successfully!');
} catch (error) {
  console.error('Failed to install Chrome:', error);
  process.exit(1);
}
