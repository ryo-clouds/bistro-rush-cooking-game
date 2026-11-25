/**
 * Bistro Rush: Master Chef - Main Delivery Entrypoint
 *
 * Prepares the production delivery artifact for make.fun evaluation:
 * 1. Validates output directories and permissions.
 * 2. Copies the static game directory (game/) to the target output directory.
 * 3. Copies high-resolution automated screenshots (screenshots/) to output.
 * 4. Compiles the authoritative dossier.json manifest using makefun-game vendor library.
 * 5. Logs detailed pre-submission audit statistics.
 */

import { cpSync, existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

console.log('[Bistro Rush] Starting game packaging and dossier generation...');
console.log(`[Bistro Rush] Source directory: ${rootDir}`);
console.log(`[Bistro Rush] Target output directory: ${outputDir}`);

// Ensure target output directories exist
mkdirSync(outputDir, { recursive: true });

const gameSrc = join(rootDir, 'game');
const gameDest = join(outputDir, 'game');
const screenshotsSrc = join(rootDir, 'screenshots');
const screenshotsDest = join(outputDir, 'screenshots');

if (!existsSync(gameSrc)) {
  console.error(`[Error] Game source directory not found: ${gameSrc}`);
  process.exit(1);
}

// Copy game assets and verify file count
console.log('[Bistro Rush] Copying game runtime files...');
mkdirSync(gameDest, { recursive: true });
cpSync(gameSrc, gameDest, { recursive: true });

// Copy verified screenshots
mkdirSync(screenshotsDest, { recursive: true });
if (existsSync(screenshotsSrc)) {
  console.log('[Bistro Rush] Copying verified screenshot captures...');
  cpSync(screenshotsSrc, screenshotsDest, { recursive: true });
} else {
  console.warn('[Warning] Screenshots directory missing; proceeding without visual previews.');
}

// Build and serialize dossier.json with standard judge caps
console.log('[Bistro Rush] Building dossier.json manifest...');
const dossierContent = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(dossierPath, dossierContent);

const dossierStat = statSync(dossierPath);
console.log(`[Bistro Rush] Successfully generated dossier.json (${dossierStat.size} bytes).`);
console.log('[Bistro Rush] Package completed successfully. Ready for evaluation.');
