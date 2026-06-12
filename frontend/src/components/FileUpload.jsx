import { useRef, useState } from 'react'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const FILE_META = {
  'application/pdf': {
    bg: '#fff0f0', border: '#ffb3b3', color: '#c00', label: 'PDF', icon: 'ti-file-type-pdf'
  },
  'application/msword': {
    bg: '#f0f4ff', border: '#b3c6ff', color: '#185FA5', label: 'DOC', icon: 'ti-file-type-doc'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    bg: '#f0f4ff', border: '#b3c6ff', color: '#185FA5', label: 'DOCX', icon: 'ti-file-type-doc'
  },
  'application/vnd.ms-excel': {
    bg: '#f0fff4', border: '#b3ffcc', color: '#1a6b3c', label: 'XLS', icon: 'ti-file-spreadsheet'
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    bg: '#f0fff4', border: '#b3ffcc', color: '#1a6b3c', label: 'XLSX', icon: 'ti-file-spreadsheet'
  },
}

const DEFAULT_META = {
  bg: '#f5f5f5', border: '#ddd', color: '#555', label: 'FILE', icon: 'ti-file'
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileThumbnail({ file, onRemove }) {
  const meta = FILE_META[file.type] || DEFAULT_META

  return (
    <div style={{ position: 'relative', width: 60, flexShrink: 0 }}>

      {/* REMOVE BUTTON */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(file.name) }}
        style={{
          position: 'absolute', top: -6, right: -6,
          width: 16, height: 16, borderRadius: '50%',
          background: '#666', color: 'white',
          border: 'none', cursor: 'pointer',
          fontSize: 9, lineHeight: '16px',
          textAlign: 'center', zIndex: 2, padding: 0,
        }}
        title="Remove"
      >✕</button>

      {/* CARD */}
      <div style={{
        background    : meta.bg,
        border        : `1.5px solid ${meta.border}`,
        borderRadius  : 8,
        padding       : '6px 4px',
        textAlign     : 'center',
        height        : 50,
        display       : 'flex',
        flexDirection : 'column',
        alignItems    : 'center',
        justifyContent: 'center',
        gap           : 3,
      }}>
        <i
          className={`ti ${meta.icon}`}
          style={{ fontSize: 8, color: meta.color }}
          aria-hidden="true"
        />
        <span style={{
          background   : meta.color,
          color        : 'white',
          fontSize     : 8,
          fontWeight   : 600,
          padding      : '1px 5px',
          borderRadius : 3,
          letterSpacing: 0.5,
        }}>
          {meta.label}
        </span>
      </div>

      {/* FILE NAME */}
      <div style={{
        fontSize    : 9,
        fontWeight  : 500,
        color       : '#333',
        marginTop   : 3,
        textAlign   : 'center',
        overflow    : 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace  : 'nowrap',
        maxWidth    : 60,
        fontFamily  : 'Arial',
      }} title={file.name}>
        {file.name}
      </div>

      {/* FILE SIZE */}
      <div style={{ fontSize: 8, color: '#999', textAlign: 'center', fontFamily: 'Arial' }}>
        {formatSize(file.size)}
      </div>

    </div>
  )
}

function LoadingThumbnail({ name }) {
  return (
    <div style={{ position: 'relative', width: 75, flexShrink: 0, opacity: 0.7 }}>
      <div style={{
        background    : '#f5f5f5',
        border        : '1.5px dashed #ccc',
        borderRadius  : 8,
        padding       : '6px 4px',
        textAlign     : 'center',
        height        : 65,
        display       : 'flex',
        flexDirection : 'column',
        alignItems    : 'center',
        justifyContent: 'center',
        gap           : 4,
      }}>
        <div style={{
          width      : 20,
          height     : 20,
          border     : '2px solid #e0e0e0',
          borderTop  : '2px solid #1a6b3c',
          borderRadius: '50%',
          animation  : 'fu-spin 0.7s linear infinite',
        }} />
        <div style={{ fontSize: 9, color: '#777', fontFamily: 'Arial' }}>Loading...</div>
      </div>
      <div style={{
        fontSize    : 9,
        color       : '#999',
        marginTop   : 3,
        textAlign   : 'center',
        overflow    : 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace  : 'nowrap',
        maxWidth    : 60,
        fontFamily  : 'Arial',
      }}>{name}</div>
    </div>
  )
}

function FileUpload({ files, setFiles }) {
  const inputRef                = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState([])

  const safeFiles = Array.isArray(files) ? files : []

  const processFiles = (fileList) => {
    const incoming = Array.from(fileList)
    if (!incoming.length) return

    incoming.forEach(file => {
      const ext         = file.name.split('.').pop().toLowerCase()
      const allowedExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx']
      const typeOk      = ALLOWED_TYPES.includes(file.type)
      const extOk       = allowedExts.includes(ext)

      if (!typeOk && !extOk) {
        setError(`${file.name} is not supported. PDF, Word or Excel only.`)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} exceeds 10MB limit.`)
        return
      }

      if (safeFiles.find(f => f.name === file.name)) {
        setError(`${file.name} is already added.`)
        return
      }

      setError('')
      setLoading(prev => [...prev, { name: file.name, size: file.size }])

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1]
        setLoading(prev => prev.filter(f => f.name !== file.name))
        setFiles(prev => {
          const prevSafe = Array.isArray(prev) ? prev : []
          return [...prevSafe, { name: file.name, type: file.type, size: file.size, base64 }]
        })
      }
      reader.onerror = () => {
        setError(`Failed to read ${file.name}`)
        setLoading(prev => prev.filter(f => f.name !== file.name))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemove = (fileName) => {
    setFiles(safeFiles.filter(f => f.name !== fileName))
  }

  const totalFiles = safeFiles.length + loading.length

  return (
    <div style={{ padding: '6px 0', fontFamily: 'Arial' }}>

      <style>{`@keyframes fu-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 }}>
        Upload Supporting Documents
        <span style={{ fontWeight: 400, fontSize: 10, color: '#777', marginLeft: 8 }}>
          PDF, Word, Excel — max 10MB each
        </span>
      </div>

      {/* DROP ZONE */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        style={{
          border        : `2px dashed ${dragging ? '#1a6b3c' : '#ccc'}`,
          borderRadius  : 8,
          padding       : '8px 16px',
          textAlign     : 'center',
          cursor        : 'pointer',
          background    : dragging ? '#e8f5ee' : '#fafafa',
          transition    : 'all 0.15s',
          marginBottom  : 8,
          display       : 'flex',
          flexDirection : 'column',
          alignItems    : 'center',
          justifyContent: 'center',
          gap           : 2,
        }}
      >
        <i
          className="ti ti-paperclip"
          style={{ fontSize: 16, color: dragging ? '#1a6b3c' : '#aaa' }}
          aria-hidden="true"
        />
        <div style={{ fontSize: 11, color: '#555' }}>
          Drag and drop or{' '}
          <span style={{ color: '#1a6b3c', fontWeight: 600 }}>click to browse</span>
        </div>
        <div style={{ fontSize: 10, color: '#999' }}>
          PDF · Word (.doc .docx) · Excel (.xls .xlsx)
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          style={{ display: 'none' }}
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div style={{
          background  : '#fff3f3',
          border      : '1px solid #ffbdbd',
          borderRadius: 6,
          padding     : '6px 10px',
          fontSize    : 11,
          color       : '#c00',
          marginBottom: 8,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* THUMBNAILS */}
      {totalFiles > 0 && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '4px 2px' }}>
            {safeFiles.map((file, i) => (
              <FileThumbnail key={i} file={file} onRemove={handleRemove} />
            ))}
            {loading.map((f, i) => (
              <LoadingThumbnail key={`loading-${i}`} name={f.name} size={f.size} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            {safeFiles.length} file{safeFiles.length !== 1 ? 's' : ''} ready
            {loading.length > 0 && ` · ${loading.length} loading...`}
            {' '}— will be uploaded to SharePoint on submit
          </div>
        </div>
      )}

    </div>
  )
}

export default FileUpload