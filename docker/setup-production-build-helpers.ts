import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { prodServerScriptsToBuild } from './production-build-mainifest';

const execPromise = promisify(exec);

async function buildScripts() {
  const scriptPaths = prodServerScriptsToBuild.join(' ');
  const command = `NODE_ENV=production bun build ${scriptPaths} --outdir=dist/docker --target=node --minify`;

  try {
    const { stdout, stderr } = await execPromise(command);
    console.log('Build output:', stdout);
    if (stderr) {
      console.error('Build errors:', stderr);
    }
    console.log('Successfully built all utility scripts.');
  } catch (error) {
    console.error('Failed to build utility scripts:', error);
    process.exit(1);
  }
}

buildScripts();
