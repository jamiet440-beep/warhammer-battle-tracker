import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export interface UnitStat {
  name: string;
  value: string;
}

export interface Weapon {
  name: string;
  type: 'Ranged' | 'Melee';
  stats: UnitStat[];
}

export interface UnitProfile {
  id: string;
  name: string;
  stats: UnitStat[];
  weapons: Weapon[];
  abilities: string[];
}

export interface ParsedArmy {
  name: string;
  faction: string;
  units: UnitProfile[];
}

export async function parseRosz(file: File): Promise<ParsedArmy> {
  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  
  const xmlFilename = Object.keys(zip.files).find(f => f.endsWith('.ros'));
  if (!xmlFilename) {
    throw new Error('Invalid .rosz file: No .ros file found inside.');
  }

  const xmlContent = await zip.file(xmlFilename)?.async('string');
  if (!xmlContent) throw new Error('Could not read XML content');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  const jsonObj = parser.parse(xmlContent);
  const unitsMap = new Map<string, UnitProfile>();
  
  const armyName = jsonObj.roster['@_name'] || 'Unknown Army';
  const faction = jsonObj.roster['@_gameSystemName'] || 'Warhammer 40k';

  // Recursive search to find all profiles
  const recurse = (o: any, currentUnitId?: string) => {
    if (!o) return;
    
    // Assign a new unit ID if we are at a root selection
    let trackingId = currentUnitId;
    if (o['@_type'] === 'model' || o['@_type'] === 'unit') {
      trackingId = o['@_id'];
      if (!unitsMap.has(trackingId)) {
        unitsMap.set(trackingId, {
          id: trackingId,
          name: o['@_name'] || 'Unknown Unit',
          stats: [],
          weapons: [],
          abilities: []
        });
      }
    }

    if (Array.isArray(o)) {
      o.forEach(item => recurse(item, trackingId));
    } else if (typeof o === 'object') {
      
      if (documentProfile(o, trackingId, unitsMap)) {
        // extracted profile logic handled below
      }

      // Check selections recursively
      if (o.selections && o.selections.selection) {
        recurse(o.selections.selection, trackingId);
      }
      if (o.profiles && o.profiles.profile) {
         recurse(o.profiles.profile, trackingId);
      }
    }
  };

  if (jsonObj.roster.forces && jsonObj.roster.forces.force) {
    recurse(jsonObj.roster.forces.force);
  }

  // Filter out any units that didn't get actual stats
  const finalUnits = Array.from(unitsMap.values()).filter(u => u.stats.length > 0);

  return {
    name: armyName,
    faction: faction,
    units: finalUnits
  };
}

function documentProfile(o: any, trackingId: string | undefined, unitsMap: Map<string, UnitProfile>): boolean {
  if (!trackingId || !o['@_typeName']) return false;
  
  const unit = unitsMap.get(trackingId);
  if (!unit) return false;

  const typeName = o['@_typeName'];
  const name = o['@_name'];

  if (typeName === 'Unit') {
    const stats: UnitStat[] = [];
    if (o.characteristics && o.characteristics.characteristic) {
      const chars = Array.isArray(o.characteristics.characteristic) ? o.characteristics.characteristic : [o.characteristics.characteristic];
      chars.forEach((c: any) => {
        stats.push({ name: c['@_name'], value: c['#text'] });
      });
    }
    unit.stats = stats;
    // Overwrite with actual unit profile name (e.g. 'Abaddon the Despoiler' instead of 'Abaddon')
    unit.name = name;
    return true;
  }

  if (typeName === 'Melee Weapons' || typeName === 'Ranged Weapons') {
    const wStats: UnitStat[] = [];
    if (o.characteristics && o.characteristics.characteristic) {
      const chars = Array.isArray(o.characteristics.characteristic) ? o.characteristics.characteristic : [o.characteristics.characteristic];
      chars.forEach((c: any) => {
        wStats.push({ name: c['@_name'], value: c['#text'] });
      });
    }
    unit.weapons.push({
      name: name,
      type: typeName === 'Melee Weapons' ? 'Melee' : 'Ranged',
      stats: wStats
    });
    return true;
  }

  if (typeName === 'Abilities') {
    if (o.characteristics && o.characteristics.characteristic) {
      const chars = Array.isArray(o.characteristics.characteristic) ? o.characteristics.characteristic : [o.characteristics.characteristic];
      chars.forEach((c: any) => {
        unit.abilities.push(`${c['@_name']}: ${c['#text']}`);
      });
    }
    return true;
  }
  
  return false;
}
