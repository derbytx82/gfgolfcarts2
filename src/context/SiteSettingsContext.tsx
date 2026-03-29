import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { fallbackSettings } from '../data/fallback'
import { getSiteSettings } from '../services/settingsService'
import type { SiteSettings } from '../types'

type SiteSettingsContextValue = {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
  replaceSettings: (nextSettings: SiteSettings) => void
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)

export function SiteSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const response = await getSiteSettings()

      if (response) {
        setSettings(response)
      }
    } catch {
      setSettings(fallbackSettings)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const replaceSettings = useCallback((nextSettings: SiteSettings) => {
    setSettings(nextSettings)
  }, [])

  const value = useMemo<SiteSettingsContextValue>(
    () => ({
      settings,
      loading,
      refresh,
      replaceSettings,
    }),
    [loading, refresh, replaceSettings, settings],
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettingsContext() {
  const context = useContext(SiteSettingsContext)

  if (!context) {
    throw new Error('useSiteSettingsContext must be used within SiteSettingsProvider')
  }

  return context
}
