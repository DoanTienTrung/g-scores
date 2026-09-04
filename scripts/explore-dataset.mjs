import fs from 'node:fs';
import zlib from 'node:zlib';
import readline from 'node:readline';

const FILE = 'dataset/diem_thi_thpt_2024.csv.gz';
const LIMIT = Number(process.argv[2]) || Infinity;

const startedAt = Date.now();

// --- the pipeline: file -> gunzip -> line reader ---
const stream = fs.createReadStream(FILE).pipe(zlib.createGunzip());
const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

// --- accumulators ---
let header = null;
let subjects = [];
const stats = {};
let totalRows = 0;

const sbdSet = new Set();
const sbdLengths = new Set();
const langCodes = new Set();
const decimalParts = new Set();
let over2Decimals = 0;
let groupAComplete = 0;

for await (const line of rl) {
  if (!line) continue;

  // first line is the header: derive subject names from it
  if (header === null) {
    header = line.split(',');
    subjects = header.slice(1, 10);
    for (const name of subjects) {
      stats[name] = { filled: 0, empty: 0, min: null, max: null };
    }
    continue;
  }

  if (totalRows >= LIMIT) break;

  const cells = line.split(',');
  totalRows++;

  const sbd = cells[0];
  sbdSet.add(sbd);
  sbdLengths.add(sbd.length);

  langCodes.add(cells[10] === '' ? '(empty)' : cells[10]);

  // 9 score columns live at index 1..9
  for (let i = 0; i < subjects.length; i++) {
    const raw = cells[i + 1];
    const s = stats[subjects[i]];

    if (raw === '') {
      s.empty++;
      continue;
    }

    const value = Number(raw);
    s.filled++;
    if (s.min === null || value < s.min) s.min = value;
    if (s.max === null || value > s.max) s.max = value;

    const dot = raw.indexOf('.');
    const frac = dot === -1 ? '' : raw.slice(dot + 1);
    decimalParts.add(frac === '' ? '(none)' : frac);
    if (frac.length > 2) over2Decimals++;
  }

  // group A = toan(1) + vat_li(4) + hoa_hoc(5)
  if (cells[1] !== '' && cells[4] !== '' && cells[5] !== '') groupAComplete++;
}

// --- report ---
const seconds = ((Date.now() - startedAt) / 1000).toFixed(2);

console.log('\n===== KẾT QUẢ KHÁM PHÁ DỮ LIỆU =====\n');

console.log('1. Tổng số dòng dữ liệu:', totalRows.toLocaleString('vi-VN'));

console.log('\n2. Số báo danh:');
console.log('   - Số SBD phân biệt :', sbdSet.size.toLocaleString('vi-VN'));
console.log('   - Có trùng lặp?    :', sbdSet.size === totalRows ? 'KHÔNG' : `CÓ (lệch ${totalRows - sbdSet.size})`);
console.log('   - Các độ dài       :', [...sbdLengths].sort((a, b) => a - b).join(', '));

console.log('\n3 & 4. Thống kê từng môn:');
console.table(stats);

console.log('5. Mã ngoại ngữ:', [...langCodes].sort().join(', '));
console.log('\n6. Các phần thập phân xuất hiện:', [...decimalParts].sort().join(', '));
console.log('   → Số ô có hơn 2 chữ số thập phân:', over2Decimals,
  over2Decimals === 0 ? '✅ Decimal(4,2) an toàn' : '❌ PHẢI SỬA SCHEMA');
console.log('\n7. Thí sinh có đủ Toán + Lý + Hóa:',
  groupAComplete.toLocaleString('vi-VN'),
  `(${(groupAComplete / totalRows * 100).toFixed(1)}%)`);

console.log('\nThời gian chạy:', seconds + 's\n');
