const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '../../data/wira.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite:', DB_PATH);
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anonymous_code TEXT UNIQUE NOT NULL,
      real_name TEXT, -- encrypted
      phone TEXT, -- encrypted
      ngo_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err.message);
    } else {
      console.log('✅ Tabela users criada');
    }
  });

  // Create courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      instructor TEXT,
      duration_hours INTEGER,
      modules_count INTEGER,
      level TEXT,
      skills TEXT, -- JSON array
      is_active BOOLEAN DEFAULT 1
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela courses:', err.message);
    } else {
      console.log('✅ Tabela courses criada');
    }
  });

  // Create progress table
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      course_id TEXT,
      completed_modules TEXT, -- JSON array
      percentage INTEGER DEFAULT 0,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, course_id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela progress:', err.message);
    } else {
      console.log('✅ Tabela progress criada');
    }
  });

  // Create certificates table
  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      anonymous_code TEXT,
      course_id TEXT,
      course_title TEXT,
      date TEXT,
      code TEXT,
      instructor TEXT,
      institution TEXT,
      score INTEGER,
      qr_code TEXT,
      verified BOOLEAN DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela certificates:', err.message);
    } else {
      console.log('✅ Tabela certificates criada');
    }
  });

  // Create ngos table
  db.run(`
    CREATE TABLE IF NOT EXISTS ngos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela ngos:', err.message);
    } else {
      console.log('✅ Tabela ngos criada');
    }
  });

  // Insert sample data
  insertSampleData();
}

// Insert sample data for demonstration
function insertSampleData() {
  // Insert sample NGOs
  const ngos = [
    { id: 'ong-001', name: 'Centro de Acolhimento Maputo', contact_person: 'Ana Machel', phone: '+258 84 123 4567', email: 'ana@ongmaputo.org', address: 'Av. Eduardo Mondlane, Maputo' },
    { id: 'ong-002', name: 'Projeto Esperança', contact_person: 'João Sitoe', phone: '+258 84 987 6543', email: 'joao@projetoesperanca.org', address: 'Rua da Esperança, Matola' }
  ];

  ngos.forEach(ngo => {
    db.run(`
      INSERT OR IGNORE INTO ngos (id, name, contact_person, phone, email, address)
      VALUES (?, ?, ?, ?, ?)
    `, [ngo.id, ngo.name, ngo.contact_person, ngo.phone, ngo.email, ngo.address], (err) => {
      if (err) {
        console.error('Erro ao inserir ONG:', err.message);
      }
    });
  });

  // Insert sample users
  const users = [
    { anonymous_code: 'V0042', ngo_id: 'ong-001', real_name: 'Maria Silva' },
    { anonymous_code: 'V0038', ngo_id: 'ong-001', real_name: 'Ana Machel' },
    { anonymous_code: 'V0031', ngo_id: 'ong-002', real_name: 'João Sitoe' }
  ];

  users.forEach(user => {
    db.run(`
      INSERT OR IGNORE INTO users (anonymous_code, ngo_id, real_name)
      VALUES (?, ?, ?)
    `, [user.anonymous_code, user.ngo_id, user.real_name], (err) => {
      if (err) {
        console.error('Erro ao inserir usuário:', err.message);
      }
    });
  });

  // Insert sample courses
  const courses = [
    {
      id: 'costura',
      title: 'Costura Avançada - Uniformes Escolares',
      description: 'Curso completo de costura industrial focado em produção de uniformes escolares.',
      instructor: 'Professora Ana Machel',
      duration_hours: 40,
      modules_count: 8,
      level: 'Intermediário',
      skills: JSON.stringify(['Máquina industrial', 'Costura reta', 'Acabamentos', 'Controle qualidade'])
    },
    {
      id: 'culinaria',
      title: 'Culinária Profissional Moçambicana',
      description: 'Técnicas de cozinha profissional focadas em pratos moçambicanos.',
      instructor: 'Chef João Sitoe',
      duration_hours: 35,
      modules_count: 7,
      level: 'Básico',
      skills: JSON.stringify(['Técnicas de corte', 'Cozinha moçambicana', 'Segurança alimentar', 'Apresentação'])
    },
    {
      id: 'agricultura',
      title: 'Agricultura Sustentável',
      description: 'Técnicas modernas de cultivo de milho e hortaliças.',
      instructor: 'Eng. Maria Cossa',
      duration_hours: 30,
      modules_count: 6,
      level: 'Básico',
      skills: JSON.stringify(['Preparação do solo', 'Plantio', 'Irrigação', 'Colheita', 'Armazenamento'])
    }
  ];

  courses.forEach(course => {
    db.run(`
      INSERT OR IGNORE INTO courses (id, title, description, instructor, duration_hours, modules_count, level, skills)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [course.id, course.title, course.description, course.instructor, course.duration_hours, course.modules_count, course.level, course.skills], (err) => {
      if (err) {
        console.error('Erro ao inserir curso:', err.message);
      }
    });
  });

  console.log('✅ Dados de exemplo inseridos no banco de dados');
}

module.exports = db;