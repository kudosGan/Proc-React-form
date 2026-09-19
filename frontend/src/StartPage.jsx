import { useState } from 'react'
import StartPageEN from './StartPageEN'
import StartPageFR from './StartPageFR'

// Thin language switcher — the actual landing page markup lives in
// StartPageEN.jsx / StartPageFR.jsx as fully separate components, so each
// language can be opened and troubleshot on its own.
function StartPage(props) {
  const [lang, setLang] = useState('en')
  const Page = lang === 'fr' ? StartPageFR : StartPageEN
  return <Page {...props} lang={lang} setLang={setLang} />
}

export default StartPage
