import { useState, useRef, useEffect } from 'react'
import { searchPlantCodes, lookupPlantCode, ZONE_STYLE } from '../data/plantCodes.js'

export default function PlantCodeInput({ formData, setFormData }) {
  const [query,    setQuery]    = useState(formData.plantCode || '')
  const [results,  setResults]  = useState([])
  const [open,     setOpen]     = useState(false)
  const [focused,  setFocused]  = useState(false)
  const wrapRef = useRef(null)

  const matched = formData.plantCode ? lookupPlantCode(formData.plantCode) : null
  const zStyle  = matched ? (ZONE_STYLE[matched.zone] || ZONE_STYLE.Central) : null

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.trim().length > 0) {
      setResults(searchPlantCodes(val))
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
      setFormData({ ...formData, plantCode: '', plantZone: '', plantCity: '', plantName: '' })
    }
  }

  const handleSelect = (plant) => {
    setQuery(plant.code)
    setOpen(false)
    setResults([])
    setFormData({
      ...formData,
      plantCode: plant.code,
      plantZone: plant.zone,
      plantCity: plant.city,
      plantName: plant.name,
    })
  }

  const handleClear = () => {
    setQuery('')
    setOpen(false)
    setResults([])
    setFormData({ ...formData, plantCode: '', plantZone: '', plantCity: '', plantName: '' })
  }

  const zoneLabel = { Central: 'Central Zone', East: 'East Zone', West: 'West Zone' }

  return (
    <div ref={wrapRef} style={{ fontFamily:'Arial', marginBottom: 0 }}>

      {/* ── LABEL ROW ────────────────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
        <span style={{ fontSize:11, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:0.4 }}>
          Plant Code
        </span>
        <span style={{ fontSize:10, color:'#aaa' }}>(optional — auto-assigns to manager zone)</span>
      </div>

      {/* ── INPUT ROW ────────────────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>

        {/* Search input */}
        <div style={{ position:'relative', width:220 }}>
          <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${focused ? '#6B3FA0' : '#ccc'}`, borderRadius:7, overflow:'visible', background:'#fff', transition:'border 0.15s', boxShadow: focused ? '0 0 0 3px rgba(107,63,160,0.08)' : 'none' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:9, flexShrink:0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="e.g. 0020, Ottawa..."
              value={query}
              onChange={handleChange}
              onFocus={() => { setFocused(true); if (query.trim()) setOpen(true) }}
              onBlur={() => setFocused(false)}
              maxLength={40}
              style={{ border:'none', outline:'none', padding:'7px 8px', fontSize:12, fontFamily:'Arial', width:'100%', background:'transparent', color:'#333' }}
            />
            {query && (
              <button onClick={handleClear} style={{ border:'none', background:'none', cursor:'pointer', padding:'0 8px', color:'#bbb', fontSize:15, lineHeight:1, flexShrink:0 }}>×</button>
            )}
          </div>

          {/* Dropdown */}
          {open && results.length > 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #e0d4f7', borderRadius:8, boxShadow:'0 6px 24px rgba(107,63,160,0.13)', zIndex:999, marginTop:3, maxHeight:260, overflowY:'auto' }}>
              {results.map((plant, i) => {
                const zs = ZONE_STYLE[plant.zone] || ZONE_STYLE.Central
                return (
                  <div key={plant.code}
                    onMouseDown={() => handleSelect(plant)}
                    style={{ padding:'9px 12px', cursor:'pointer', borderBottom: i < results.length-1 ? '1px solid #f5f3ff' : 'none', display:'flex', alignItems:'flex-start', gap:10, transition:'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#faf7ff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <span style={{ fontSize:12, fontWeight:700, color:'#6B3FA0', minWidth:38, fontFamily:'monospace' }}>{plant.code}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:'#333', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plant.city}</div>
                      <div style={{ fontSize:10, color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{plant.name}</div>
                    </div>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:12, background:zs.bg, color:zs.color, border:`1px solid ${zs.border}`, whiteSpace:'nowrap', flexShrink:0 }}>
                      {plant.zone}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {open && query.trim().length > 0 && results.length === 0 && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #eee', borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.08)', zIndex:999, marginTop:3, padding:'12px 14px', fontSize:11, color:'#aaa', fontFamily:'Arial' }}>
              No plant code found for "{query}"
            </div>
          )}
        </div>

        {/* Matched info badge */}
        {matched && zStyle && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:zStyle.bg, border:`1px solid ${zStyle.border}`, borderRadius:8, padding:'5px 12px', flexWrap:'wrap', gap:6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={zStyle.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize:11, fontWeight:600, color:zStyle.color }}>{matched.city}</span>
            <span style={{ fontSize:10, color:'#888', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{matched.name}</span>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:12, background:'#fff', color:zStyle.color, border:`1px solid ${zStyle.border}` }}>
              {zoneLabel[matched.zone] || matched.zone}
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
