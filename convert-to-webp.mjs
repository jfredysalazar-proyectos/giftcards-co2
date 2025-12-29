import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'client/public/images');

async function convertToWebP(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    
    // Delete original file
    fs.unlinkSync(inputPath);
    console.log(`  Deleted original: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else {
      await convertToWebP(filePath);
    }
  }
}

console.log('🔄 Converting all images to WebP format...\n');
await processDirectory(imagesDir);
console.log('\n✅ All images converted to WebP!');
