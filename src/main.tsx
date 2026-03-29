import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { WhatsAppProvider } from './context/WhatsAppContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <SiteSettingsProvider>
          <AuthProvider>
            <WhatsAppProvider>
              <App />
            </WhatsAppProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </LanguageProvider>
    </HelmetProvider>
  </StrictMode>,
)
