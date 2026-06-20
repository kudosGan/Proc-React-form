// AAFC Plant Code Reference — sourced from "Copy of Plant Code.pdf"
// Service Centre → Zone mapping:
//   Central Service Centre → Central
//   Eastern Service Centre → East
//   Western Service Centre → West

export const PLANT_CODES = [
  // ── CENTRAL SERVICE CENTRE ─────────────────────────────────────
  { code:'0222', postalCode:'N4B 2W9', city:'Delhi',                   name:'Southern Crop Protection Ctr.',           zone:'Central' },
  { code:'0221', postalCode:'N1G 5C9', city:'Guelph',                  name:'Guelph Research and Development Centre',  zone:'Central' },
  { code:'2060', postalCode:'N1G 4T1', city:'Guelph',                  name:'POL-Farm Debt Mediation - Ont',           zone:'Central' },
  { code:'3060', postalCode:'N1G 4S9', city:'Guelph',                  name:'CSB Operation Div - Guelph',              zone:'Central' },
  { code:'3120', postalCode:'N1G 4S9', city:'Guelph',                  name:'Human Resources Branch',                  zone:'Central' },
  { code:'5060', postalCode:'N1G 4S9', city:'Guelph',                  name:'Human Resources Branch',                  zone:'Central' },
  { code:'0220', postalCode:'N0R 1G0', city:'Harrow',                  name:'Harrow Research & Development Centre',    zone:'Central' },
  { code:'0141', postalCode:'P5N 2Y3', city:'Kapuskasing',             name:'Ferme de rech. Kapuskasing',              zone:'Central' },
  { code:'0200', postalCode:'N5V 4T3', city:'London',                  name:'Southern Crop Protection Ctr.',           zone:'Central' },
  { code:'6160', postalCode:'N1G 4S9', city:'Ontario',                 name:'MISB - Ontario Region',                   zone:'Central' },
  { code:'0020', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Science and Technology Branch',           zone:'Central' },
  { code:'0240', postalCode:'K1A 0C6', city:'Ottawa',                  name:'Ottawa Research and Development Center',  zone:'Central' },
  { code:'0400', postalCode:'K1A 0C6', city:'Ottawa',                  name:'C.E.F. Integrated Services',              zone:'Central' },
  { code:'2000', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Strategic Policy Branch',                 zone:'Central' },
  { code:'3000', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Information Systems Branch',              zone:'Central' },
  { code:'3010', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Corporate Materiel Manag. Cen.',          zone:'Central' },
  { code:'3140', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Corporate Management Branch',             zone:'Central' },
  { code:'4000', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Communications & Consul Branch',          zone:'Central' },
  { code:'4200', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Review Branch',                           zone:'Central' },
  { code:'4400', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Minister & Deputy Minister',              zone:'Central' },
  { code:'4600', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Legal Services',                          zone:'Central' },
  { code:'5000', postalCode:'K1A 0C5', city:'Ottawa',                  name:'Human Resources Branch',                  zone:'Central' },
  { code:'6020', postalCode:'K1A 0C5', city:'Ottawa',                  name:'MISB-Operations',                         zone:'Central' },
  { code:'6260', postalCode:'K1A 0C6', city:'Ottawa',                  name:'Farm Products Council of Canada',         zone:'Central' },

  // ── EASTERN SERVICE CENTRE ─────────────────────────────────────
  { code:'0081', postalCode:'E4S 2J2', city:'Bouctouche',              name:'Ferme Senateur Hérve J. Michaud',         zone:'East' },
  { code:'0280', postalCode:'R7A 5Y3', city:'Brandon',                 name:'Agriculture & Agri-Food Canada',          zone:'East' },
  { code:'0060', postalCode:'C1A 4N6', city:'Charlottetown',           name:'Agriculture & Agri-Food Canada',          zone:'East' },
  { code:'6040', postalCode:'C1N 4N6', city:'Charlottetown',           name:'MISB - PEI Regional Office',              zone:'East' },
  { code:'3020', postalCode:'E1A 5R4', city:'Dieppe',                  name:'IST - Dieppe',                            zone:'East' },
  { code:'0100', postalCode:'E3B 4Z7', city:'Fredericton',             name:'Fredericton R&D Centre',                  zone:'East' },
  { code:'2020', postalCode:'E3B 6C2', city:'Fredericton',             name:'POL-Farm Debt Mediation - N.B',           zone:'East' },
  { code:'6060', postalCode:'E3B 6C2', city:'Fredericton',             name:'MISB - New Brunswick Reg. Off.',          zone:'East' },
  { code:'6120', postalCode:'G1K 4K1', city:'Québec',                  name:'DGSIM Québec',                            zone:'East' },
  { code:'6080', postalCode:'B3J 2N7', city:'Halifax',                 name:'MISB – Atlantic Region',                  zone:'East' },
  { code:'0080', postalCode:'B4N 1J5', city:'Kentville',               name:'Kentville Research & Development Centre', zone:'East' },
  { code:'0500', postalCode:'E1C 0N5', city:'Moncton',                 name:'Agriculture & Agri-Food Canada',          zone:'East' },
  { code:'5020', postalCode:'E1C 4M2', city:'Moncton',                 name:'NB Regional Office',                      zone:'East' },
  { code:'5040', postalCode:'H3A 3N2', city:'Montréal',                name:'DG – ressources humaines',                zone:'East' },
  { code:'3040', postalCode:'H3A 3N2', city:'Montréal',                name:'DGSI - Finances - Montréal',              zone:'East' },
  { code:'6140', postalCode:'H3A 3N2', city:'Montréal',                name:'DGSIM - Montréal',                        zone:'East' },
  { code:'0061', postalCode:'B0L 1C0', city:'Nappan',                  name:'Nappan Research Farm',                    zone:'East' },
  { code:'0130', postalCode:'G8M 4K3', city:'Normandin',               name:'Ferme Rech. Normandin',                   zone:'East' },
  { code:'0120', postalCode:'G1V 2J3', city:'Québec',                  name:'CRDQ',                                    zone:'East' },
  { code:'2040', postalCode:'G1V 0B9', city:'Québec',                  name:'POL-SMMEA',                               zone:'East' },
  { code:'0180', postalCode:'J2S 8E3', city:'Saint-Hyacinthe',         name:'CRDA Ste-Hyacinthe',                      zone:'East' },
  { code:'0160', postalCode:'J3B 3E6', city:'Saint-Jean-sur-Richelieu',name:'CRDH St-Jean-sur-Richelieu',              zone:'East' },
  { code:'0140', postalCode:'J1M 0C8', city:'Sherbrooke',              name:'CRDBP Lennoxville',                       zone:'East' },
  { code:'0040', postalCode:'A1E 6J5', city:"St. John's",              name:"St-John's Research & Dev. Ctr",           zone:'East' },
  { code:'6100', postalCode:'B1C 5P9', city:"St. John's",              name:'MISB - Newfoundland Reg. Off.',           zone:'East' },
  { code:'1130', postalCode:'B2N 2T6', city:'Truro',                   name:'AESB',                                    zone:'East' },
  { code:'0223', postalCode:'L0R 2E0', city:'Vineland Station',        name:'Vineland Research Farm-SCPFRC',           zone:'East' },

  // ── WESTERN SERVICE CENTRE ─────────────────────────────────────
  { code:'0390', postalCode:'V0M 1A0', city:'Agassiz',                 name:'Agassiz Research and Development Centre', zone:'West' },
  { code:'0370', postalCode:'T0H 0C0', city:'Beaverlodge',             name:'Beaverlodge Research Farm',               zone:'West' },
  { code:'5100', postalCode:'V5C 6S7', city:'Burnaby',                 name:'BC Regional Office',                      zone:'West' },
  { code:'1040', postalCode:'T2G 4X3', city:'Calgary',                 name:'PFRA S. Alberta',                         zone:'West' },
  { code:'1020', postalCode:'T5J 4C3', city:'Edmonton',                name:'Canada Place Bldg',                       zone:'West' },
  { code:'2120', postalCode:'T5J 4C3', city:'Edmonton',                name:'POL-Farm Debt Mediation -Alta.',          zone:'West' },
  { code:'6220', postalCode:'T5J 4G5', city:'Edmonton',                name:'MISB - Alberta Region',                   zone:'West' },
  { code:'1120', postalCode:'S0G 2K0', city:'Indian Head',             name:'Shelterbelt Centre',                      zone:'West' },
  { code:'0360', postalCode:'T4L 1W1', city:'Lacombe',                 name:'Lacombe Research & Development Centre',   zone:'West' },
  { code:'0340', postalCode:'T1J 4B1', city:'Lethbridge',              name:'Lethbridge Research & Development Centre',zone:'West' },
  { code:'0290', postalCode:'R6M 1Y5', city:'Morden',                  name:'Morden Research & Development Centre',    zone:'West' },
  { code:'3100', postalCode:'V3M 1J2', city:'New Westminster',         name:'CSB Operation Div Westminster',           zone:'West' },
  { code:'6240', postalCode:'V3M 1J2', city:'New Westminster',         name:'MISB - BC Region',                        zone:'West' },
  { code:'1000', postalCode:'S4P 0M3', city:'Regina',                  name:'Western Service Centre',                  zone:'West' },
  { code:'1080', postalCode:'S4P 4L2', city:'Regina',                  name:'PFRA S. Saskatchewan',                    zone:'West' },
  { code:'2100', postalCode:'S4P 4K7', city:'Regina',                  name:'POL-Farm Debt Mediation -Sask.',          zone:'West' },
  { code:'2164', postalCode:'S4P 1Y2', city:'Regina',                  name:'FIPD - CFIP',                             zone:'West' },
  { code:'6200', postalCode:'S4P 4K7', city:'Regina',                  name:'MISB - Saskatchewan Region',              zone:'West' },
  { code:'0300', postalCode:'S7N 0X2', city:'Saskatoon',               name:'Saskatoon Research & Development Centre', zone:'West' },
  { code:'1060', postalCode:'S7N 4L5', city:'Saskatoon',               name:'PFRA N. Saskatchewan',                    zone:'West' },
  { code:'0380', postalCode:'V0H 1Z0', city:'Summerland',              name:'Summerland Research & Development Centre',zone:'West' },
  { code:'0320', postalCode:'S9H 3X2', city:'Swift Current',           name:'Swift Current Research & Development Centre', zone:'West' },
  { code:'0260', postalCode:'R3T 2M9', city:'Winnipeg',                name:'Winnipeg Integrated Services',            zone:'West' },
  { code:'1100', postalCode:'R3C 3G7', city:'Winnipeg',                name:'PFRA Manitoba',                           zone:'West' },
  { code:'2080', postalCode:'R3C 3G7', city:'Winnipeg',                name:'POL-Adaptation & Grain -MAN',             zone:'West' },
  { code:'2140', postalCode:'R3C 4L5', city:'Winnipeg',                name:'NISA',                                    zone:'West' },
  { code:'2160', postalCode:'R3C 1B2', city:'Winnipeg',                name:'AIDA',                                    zone:'West' },
  { code:'2161', postalCode:'R3B 0T6', city:'Winnipeg',                name:'AIDA Administration',                     zone:'West' },
  { code:'2162', postalCode:'R3C 4L5', city:'Winnipeg',                name:'AIDA Administration',                     zone:'West' },
  { code:'2163', postalCode:'R3C 4L5', city:'Winnipeg',                name:'NISA/AIDA Administration',                zone:'West' },
  { code:'2165', postalCode:'R3C 4N3', city:'Winnipeg',                name:'Materiel Mgmt. - Western Service Centre', zone:'West' },
  { code:'2166', postalCode:'R3C 4N3', city:'Winnipeg',                name:'SP&SAD - AgConnex',                       zone:'West' },
  { code:'3080', postalCode:'R3C 3G7', city:'Winnipeg',                name:'Agriculture & Agri-Food Canada',          zone:'West' },
  { code:'5080', postalCode:'R3C 3G7', city:'Winnipeg',                name:'Human Resources Branch',                  zone:'West' },
  { code:'6180', postalCode:'R3C 3G7', city:'Winnipeg',                name:'MISB - Manitoba Region',                  zone:'West' },
]

// Zone badge styling
export const ZONE_STYLE = {
  Central : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7' },
  East    : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b8ddc8' },
  West    : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8' },
}

// Fast lookup by code
export function lookupPlantCode(code) {
  return PLANT_CODES.find(p => p.code === code.trim()) || null
}

// Search by code, city, or name prefix
export function searchPlantCodes(query) {
  if (!query || query.trim().length < 1) return []
  const q = query.trim().toLowerCase()
  return PLANT_CODES.filter(p =>
    p.code.startsWith(q) ||
    p.city.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.postalCode.toLowerCase().includes(q)
  ).slice(0, 12)
}
