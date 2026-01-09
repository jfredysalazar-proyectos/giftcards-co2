import mysql from 'mysql2/promise';

const passwordHash = '$2b$12$H65zeVfPw0nRwlYBxr8NhehXVqWEJe1t0WDmYnVaaxDGtWdubXWgm';

async function insertAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    console.log('Connected to database');
    
    const [result] = await connection.execute(`
      INSERT INTO users (name, email, passwordHash, role, createdAt, lastSignedInAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        passwordHash = VALUES(passwordHash),
        role = VALUES(role),
        lastSignedInAt = NOW()
    `, ['Administrador', 'misegundoingreso2023@gmail.com', passwordHash, 'admin']);
    
    console.log('✅ Admin user created/updated successfully!');
    console.log('Email: misegundoingreso2023@gmail.com');
    console.log('Password: 75090298Juan');
    console.log('Result:', result);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

insertAdmin();
