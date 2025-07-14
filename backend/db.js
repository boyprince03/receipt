// db.js
const Database = require('better-sqlite3');
const db = new Database('./rentaldb.sqlite');

// 建立資料表
db.exec(`
CREATE TABLE IF NOT EXISTS tenant (
  tenantId INTEGER PRIMARY KEY AUTOINCREMENT,
  roomNo TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  rentStart TEXT,
  rentEnd TEXT,
  rentfee INTEGER,
  deposit INTEGER,
  isActive INTEGER DEFAULT 1,
  isPaid INTEGER DEFAULT 0,
  note TEXT,
  FOREIGN KEY (roomNo) REFERENCES rooms(roomNo)
);

CREATE TABLE IF NOT EXISTS houses (
  houseId INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL,
  name TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS rooms (
  roomNo TEXT PRIMARY KEY,
  houseId INTEGER NOT NULL,
  roomType TEXT,
  area REAL,
  floor INTEGER,
  defaultRentfee INTEGER,
  isActive INTEGER DEFAULT 1,
  description TEXT,
  FOREIGN KEY (houseId) REFERENCES houses(houseId)
);

CREATE TABLE IF NOT EXISTS electricity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roomNo TEXT NOT NULL,
  meterStart REAL,
  meterEnd REAL,
  usage REAL,
  unitPrice REAL,
  amount INTEGER,
  period TEXT,
  isPaid INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (roomNo) REFERENCES rooms(roomNo)
);
CREATE TABLE IF NOT EXISTS payment_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  roomNo TEXT NOT NULL,
  tenantName TEXT,
  payDate TEXT,
  month TEXT,
  meterStart REAL,
  meterEnd REAL,
  usage REAL,
  unitPrice REAL,
  avgUnitPrice REAL,
  rentfee INTEGER,
  elecfee INTEGER,
  isRentPaid INTEGER DEFAULT 0,
  isElecPaid INTEGER DEFAULT 0,
  note TEXT,
  FOREIGN KEY (roomNo) REFERENCES rooms(roomNo)
);
`);

// 範例初始資料
db.exec(`
INSERT OR IGNORE INTO houses (houseId, address, name, description) VALUES
  (1, '基隆市中山區復興路389-3號4-5樓', '經國管理學院分租套房', '近學區'),
  (2, '桃園市桃園區復興路10樓', '建國大廈', '三鐵共構、等都更');

INSERT OR IGNORE INTO rooms (roomNo, houseId, roomType, area, floor, defaultRentfee, isActive, description) VALUES
    ('401', 1, '分租套房', 10, 4, 7000, 1, '邊間安靜、獨立洗衣機、冰箱、電視'),
    ('402', 1, '分租套房', 10, 4, 7000, 1, '邊間安靜、獨立洗衣機、冰箱、電視'),
    ('403', 1, '分租套房', 12, 4, 10000, 1, '邊間安靜、獨立洗衣機、冰箱、電視'),
    ('501', 1, '分租套房', 7, 5, 5500, 1, '邊間安靜、獨立洗衣機、冰箱、電視'),
    ('502', 1, '分租套房', 6, 5, 5500, 1, '邊間安靜、共用飲水機、冰箱、洗衣機'),
    ('503', 1, '分租套房', 6, 5, 5000, 1, '邊間安靜、共用飲水機、冰箱、洗衣機'),
    ('504', 1, '分租套房', 5.5, 5, 4000, 1, '邊間安靜、共用飲水機、冰箱、洗衣機'),
    ('10-22', 2, '獨立門牌套房', 14.02,10 , 12500, 1, '高樓層、獨立電錶、水電自付');

-- 這邊初始化幾位租客（可自由增減）
INSERT OR IGNORE INTO tenant (roomNo, name, phone, email, rentStart, rentEnd, rentfee, deposit, isActive, isPaid, note) VALUES
  ('401', '王小明', '0912345678', 'ming@mail.com', '2024-06-01', '2025-06-01', 7000, 14000, 1, 1, '準時繳租'),
  ('402', '林小華', '0988777666', 'hua@mail.com', '2024-07-01', NULL, 7000, 7000, 1, 0, ''),
  ('10-22', '陳大文', '0977123456', NULL, '2024-03-15', '2025-03-14', 12500, 25000, 1, 1, '預付半年租');
  
  -- 範例：初始化一筆繳費紀錄
INSERT OR IGNORE INTO payment_record (
  roomNo, tenantName, payDate, month, meterStart, meterEnd, usage, unitPrice, avgUnitPrice, rentfee, elecfee, isRentPaid, isElecPaid, note
) VALUES (
  '401', '王小明', '2024-07-10', '2024-07', 1200, 1230, 30, 6, 5.8, 7000, 180, 1, 1, '本月繳清'
);
`);

module.exports = db;
