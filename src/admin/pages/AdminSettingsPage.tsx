import { ImagePlus, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { saveSiteSettings } from '../../services/settingsService'
import { STORAGE_BUCKETS, uploadImage } from '../../services/storageService'
import type { SiteSettingsInput } from '../../types'

type SettingsForm = {
  business_name: string
  phone: string
  whatsapp_number: string
  email: string
  address: string
  city: string
  state: string
  instagram_url: string
  facebook_url: string
  hours: string
  hero_background: string
}

function mapSettingsToForm(settings: ReturnType<typeof useSiteSettings>['settings']): SettingsForm {
  return {
    business_name: settings.business_name,
    phone: settings.phone ?? '',
    whatsapp_number: settings.whatsapp_number ?? '',
    email: settings.email ?? '',
    address: settings.address ?? '',
    city: settings.city ?? '',
    state: settings.state ?? '',
    instagram_url: settings.instagram_url ?? '',
    facebook_url: settings.facebook_url ?? '',
    hours: settings.hours ?? '',
    hero_background: settings.hero_background ?? '',
  }
}

export function AdminSettingsPage() {
  const { settings, replaceSettings } = useSiteSettings()
  const [form, setForm] = useState<SettingsForm>(() => mapSettingsToForm(settings))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const previewBackground = useMemo(() => form.hero_background || settings.hero_background, [form.hero_background, settings])

  const updateField = (field: keyof SettingsForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const payload: SiteSettingsInput = {
        id: settings.id,
        business_name: form.business_name,
        phone: form.phone || null,
        whatsapp_number: form.whatsapp_number || null,
        email: form.email || null,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        instagram_url: form.instagram_url || null,
        facebook_url: form.facebook_url || null,
        hours: form.hours || null,
        hero_background: form.hero_background || null,
      }

      const saved = await saveSiteSettings(payload)
      replaceSettings(saved)
      setMessage('Settings updated successfully')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  const uploadHeroBackground = async (file: File | null) => {
    if (!file) {
      return
    }

    const url = await uploadImage(file, STORAGE_BUCKETS.site, 'hero')
    updateField('hero_background', url)
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Admin / Settings</p>
        <h1 className="font-display text-3xl text-white">Site Settings</h1>
      </div>

      {message ? <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      <form onSubmit={handleSave} className="space-y-5">
        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <Input
            placeholder="Business name"
            value={form.business_name}
            onChange={(event) => updateField('business_name', event.target.value)}
            required
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
          <Input
            placeholder="WhatsApp number"
            value={form.whatsapp_number}
            onChange={(event) => updateField('whatsapp_number', event.target.value)}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <Input
            placeholder="Address"
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
          />
          <Input
            placeholder="State"
            value={form.state}
            onChange={(event) => updateField('state', event.target.value)}
          />
          <Input
            placeholder="Instagram URL"
            value={form.instagram_url}
            onChange={(event) => updateField('instagram_url', event.target.value)}
          />
          <Input
            placeholder="Facebook URL"
            value={form.facebook_url}
            onChange={(event) => updateField('facebook_url', event.target.value)}
          />
          <TextArea
            placeholder="Business hours"
            value={form.hours}
            onChange={(event) => updateField('hours', event.target.value)}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-display text-xl text-white">Hero Background</h2>
          <Input
            placeholder="Hero background URL"
            value={form.hero_background}
            onChange={(event) => updateField('hero_background', event.target.value)}
            className="mt-3"
          />
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm">
            <ImagePlus size={15} />
            Upload hero image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void uploadHeroBackground(event.target.files?.[0] ?? null)
              }}
            />
          </label>

          {previewBackground ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <img src={previewBackground} alt="Hero preview" className="h-48 w-full object-cover" />
            </div>
          ) : null}
        </section>

        <Button type="submit" size="lg" disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}
