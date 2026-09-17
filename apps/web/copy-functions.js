const fs = require('fs');
const path = require('path');

// Paths relative to project root (apps/web)
const SRC = path.join(__dirname, 'src', 'mailerLiteSubscribeFunction.js');
const DEST_DIR = path.join(__dirname, 'netlify', 'functions');
const DEST = path.join(DEST_DIR, 'mailerLiteSubscribe.js');

// Create destination directory if it doesn't exist
fs.mkdirSync(DEST_DIR, { recursive: true });

// Copy file
if (fs.existsSync(SRC)) {
  fs.copyFileSync(SRC, DEST);
  console.log(`Copied ${SRC} -> ${DEST}`);
} else {
  console.warn(`Source function not found at ${SRC}. Skipping copy.`);
}
