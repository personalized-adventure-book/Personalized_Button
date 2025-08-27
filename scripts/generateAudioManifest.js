#!/usr/bin/env node

/**
 * Script to generate audio manifest from content folders
 * This creates a JSON file listing available audio samples by language.
 *
 * Folder structure expected:
 *   content/Song/Audios/gallery/<LANG_FOLDER>/song_gallery_XX.(mp3|wav|wov)
 *
 * Output (public/audio-manifest.json):
 * {
 *   "Song": {
 *     "gallery": {
 *       "en": ["song_gallery_01.mp3", ...],
 *       "fr": [...]
 *     }
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');

function listAudioFiles(dir) {
	try {
		const exts = new Set(['.mp3', '.wav', '.wov']);
		return fs.readdirSync(dir).filter(f => exts.has(path.extname(f).toLowerCase())).sort();
	} catch (e) {
		return [];
	}
}

function mapFolderToLang(folderName) {
	const clean = folderName.trim().toUpperCase();
	if (clean.includes('ENGLISH')) return 'en';
	if (clean.includes('FRENCH')) return 'fr';
	if (clean.includes('ITALIAN')) return 'it';
	if (clean.includes('ARABIC')) return 'ar';
	return null;
}

function generateAudioManifest() {
	const cwd = process.cwd();
	const contentDir = path.join(cwd, 'content');
	const publicDir = path.join(cwd, 'public');
	const songDir = path.join(contentDir, 'Song');
	const manifest = { Song: { gallery: {} } };

	const galleryBase = path.join(songDir, 'Audios', 'gallery');
	if (fs.existsSync(galleryBase)) {
		const subfolders = fs.readdirSync(galleryBase).filter(f => {
			const full = path.join(galleryBase, f);
			return fs.existsSync(full) && fs.statSync(full).isDirectory();
		});
		subfolders.forEach(folder => {
			const lang = mapFolderToLang(folder);
			if (!lang) return;
			const files = listAudioFiles(path.join(galleryBase, folder));
			if (files.length) {
				manifest.Song.gallery[lang] = files;
				console.log(`Found ${files.length} audio files in Song/Audios/gallery/${folder} (${lang})`);
			}
		});
	} else {
		console.warn('Audio gallery base folder not found:', galleryBase);
	}

	if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
	const outPath = path.join(publicDir, 'audio-manifest.json');
	fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
	console.log('✅ Audio manifest generated:', outPath);
	return manifest;
}

if (require.main === module) {
	generateAudioManifest();
}

module.exports = { generateAudioManifest };

