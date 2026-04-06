import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

async function testParse() {
  const filePath = path.join(process.cwd(), 'test-data', 'Share TSons.rosz');
  const buffer = fs.readFileSync(filePath);
  
  const zip = await JSZip.loadAsync(buffer);
  const xmlFilename = Object.keys(zip.files).find(f => f.endsWith('.ros'));
  
  if (!xmlFilename) {
    console.error('No .ros file found inside .rosz');
    return;
  }
  
  const xmlContent = await zip.file(xmlFilename).async('string');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });
  const jsonObj = parser.parse(xmlContent);
  
  fs.writeFileSync('test-data/parsed.json', JSON.stringify(jsonObj, null, 2));
  console.log('Parsed successfully to test-data/parsed.json');
}

testParse().catch(console.error);
