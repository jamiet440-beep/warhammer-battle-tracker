import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const WAHAPEDIA_DIR = './wahapedia_data';
const OUT_DIR = './public/data';

function buildDB() {
  console.log('Building Wahapedia JSON Database...');
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(WAHAPEDIA_DIR).filter(f => f.endsWith('.csv'));

  for (const file of files) {
    console.log(`Converting ${file} to JSON...`);
    const content = fs.readFileSync(path.join(WAHAPEDIA_DIR, file), 'utf8');
    
    // Parse the CSV using pipe |
    const records = parse(content, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true
    });

    const outName = file.replace('.csv', '.json');
    fs.writeFileSync(path.join(OUT_DIR, outName), JSON.stringify(records));
  }

  console.log('Database built successfully in public/data');
}

buildDB();
