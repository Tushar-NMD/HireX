const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting ChromaDB...');
console.log('Make sure you have ChromaDB installed: pip install chromadb');
console.log('');

const chromaProcess = exec('chroma run --path ./chroma_data --port 8000');

chromaProcess.stdout.on('data', (data) => {
  console.log(`ChromaDB: ${data}`);
});

chromaProcess.stderr.on('data', (data) => {
  console.error(`ChromaDB Error: ${data}`);
});

chromaProcess.on('close', (code) => {
  console.log(`ChromaDB process exited with code ${code}`);
});

console.log('✅ ChromaDB is starting on http://localhost:8000');
console.log('Press Ctrl+C to stop');
