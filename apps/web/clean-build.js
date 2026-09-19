const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const buildDir = path.join(projectRoot, '.next');

function removeBuildDir(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  try {
    fs.rmSync(targetPath, { recursive: true, force: true, maxRetries: 10 });
    console.log(`Cleaned build directory: ${targetPath}`);
    return;
  } catch (error) {
    console.warn(`rmSync failed for ${targetPath}: ${error.message}`);
  }

  try {
    fs.readdirSync(targetPath, { withFileTypes: true }).forEach((entry) => {
      const entryPath = path.join(targetPath, entry.name);
      if (entry.isDirectory() && !entry.isSymbolicLink()) {
        removeBuildDir(entryPath);
      } else {
        try {
          fs.unlinkSync(entryPath);
        } catch (unlinkError) {
          if (unlinkError && unlinkError.code !== 'ENOENT') {
            throw unlinkError;
          }
        }
      }
    });

    fs.rmdirSync(targetPath, { recursive: false });
    console.log(`Fallback cleaned build directory: ${targetPath}`);
  } catch (fallbackError) {
    console.warn(`Could not fully clean ${targetPath}: ${fallbackError.message}`);
    process.exitCode = 1;
  }
}

removeBuildDir(buildDir);
