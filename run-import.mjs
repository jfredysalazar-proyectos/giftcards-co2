// Simple script to call the import endpoint
const url = 'https://giftcards-web-production.up.railway.app/api/trpc/importData.importAll';

const payload = {
  "0": {
    "json": {
      "secret": "import-data-2025"
    }
  }
};

console.log('🚀 Calling import endpoint...');
console.log('URL:', url);

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  console.log('\n📊 Status:', response.status);
  console.log('📄 Response:', JSON.stringify(data, null, 2));

  if (response.ok) {
    console.log('\n✅ Import completed successfully!');
  } else {
    console.log('\n❌ Import failed');
  }
} catch (error) {
  console.error('\n❌ Error:', error.message);
}
