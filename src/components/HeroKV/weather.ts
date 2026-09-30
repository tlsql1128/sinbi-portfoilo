export type WeatherKind = 'sun' | 'partly' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm'

export type HourPoint = {
  time: string
  temp: number
  code: number
}

export type WeatherSnapshot = {
  place: string
  temp: number
  code: number
  high: number
  low: number
  hours: HourPoint[]
  utcOffsetSeconds: number
}

type ForecastResponse = {
  utc_offset_seconds: number
  current: {
    temperature_2m: number
    weather_code: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

type AdminArea = {
  name?: string
}

type RegionResponse = {
  countryName?: string
  principalSubdivision?: string
  city?: string
  locality?: string
  localityInfo?: {
    administrative?: AdminArea[]
  }
}

type NominatimResponse = {
  address?: {
    city?: string
    town?: string
    borough?: string
    suburb?: string
    city_district?: string
    county?: string
    state?: string
  }
}

export function describeWeather(code: number): { label: string; kind: WeatherKind } {
  if (code === 0 || code === 1) return { label: '맑음', kind: 'sun' }
  if (code === 2) return { label: '구름', kind: 'partly' }
  if (code === 3) return { label: '흐림', kind: 'cloud' }
  if (code === 45 || code === 48) return { label: '안개', kind: 'fog' }
  if (code === 51 || code === 53 || code === 55) return { label: '이슬비', kind: 'rain' }
  if (code === 61 || code === 63) return { label: '비', kind: 'rain' }
  if (code === 65) return { label: '폭우', kind: 'rain' }
  if (code === 56 || code === 57 || code === 66 || code === 67) return { label: '진눈깨비', kind: 'rain' }
  if (code === 71 || code === 73 || code === 77 || code === 85 || code === 86) return { label: '눈', kind: 'snow' }
  if (code === 75) return { label: '폭설', kind: 'snow' }
  if (code === 80 || code === 81 || code === 82) return { label: '소나기', kind: 'rain' }
  if (code >= 95) return { label: '뇌우', kind: 'storm' }
  return { label: '흐림', kind: 'cloud' }
}

export function formatTemp(value: number) {
  return `${Math.round(value)}°`
}

export function formatHour(iso: string) {
  return `${Number(iso.slice(11, 13))}시`
}

export function locationHourKey(offsetSeconds: number, now = Date.now()) {
  const shifted = new Date(now + offsetSeconds * 1000)
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0')
  const day = String(shifted.getUTCDate()).padStart(2, '0')
  const hour = String(shifted.getUTCHours()).padStart(2, '0')
  return `${shifted.getUTCFullYear()}-${month}-${day}T${hour}`
}

export function upcomingHours(hours: HourPoint[], offsetSeconds: number, now = Date.now()) {
  const key = locationHourKey(offsetSeconds, now)
  const index = hours.findIndex((hour) => hour.time.startsWith(key))
  const start = index >= 0 ? index : 0
  return hours.slice(start, start + 6)
}

function shortenRegion(name: string) {
  return name
    .replace(/특별자치도$/, '')
    .replace(/특별자치시$/, '')
    .replace(/특별시$/, '')
    .replace(/광역시$/, '')
    .trim()
}

function regionFromAreas(names: string[]) {
  const regions = names.filter((name) => /(시|군|구)$/.test(name))
  if (regions.length >= 2) {
    const parent = shortenRegion(regions[regions.length - 2])
    const area = regions[regions.length - 1]
    if (parent && area && !area.startsWith(parent)) return `${parent} ${area}`
    return shortenRegion(area || parent)
  }
  if (regions.length === 1) return shortenRegion(regions[0])
  return ''
}

function regionFromLookup(data: RegionResponse) {
  const country = data.countryName ?? ''
  const admins = (data.localityInfo?.administrative ?? [])
    .map((area) => area.name?.trim() ?? '')
    .filter((name) => name && name !== country && name !== '대한민국')

  return (
    regionFromAreas(admins) ||
    joinRegion(data.city || data.principalSubdivision, data.locality) ||
    shortenRegion(data.principalSubdivision || '')
  )
}

function joinRegion(parent?: string, area?: string) {
  const city = shortenRegion(parent || '')
  const local = area?.trim() || ''
  const district = /(시|군|구)$/.test(local) ? local : ''
  if (city && district && !district.startsWith(city)) return `${city} ${district}`
  return district || city
}

function regionFromAddress(address: NominatimResponse['address']) {
  if (!address) return ''
  const city = shortenRegion(address.city || address.town || address.state || '')
  const area = address.borough || address.city_district || address.suburb || address.county || ''
  if (city && area && area !== city && !area.startsWith(city)) return `${city} ${area}`
  return shortenRegion(area || city)
}

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('weather request failed')
  return response.json() as Promise<T>
}

async function fetchRegion(latitude: number, longitude: number) {
  try {
    const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
    url.searchParams.set('latitude', String(latitude))
    url.searchParams.set('longitude', String(longitude))
    url.searchParams.set('localityLanguage', 'ko')
    const region = regionFromLookup(await readJson<RegionResponse>(url.toString()))
    if (region) return region
  } catch {
    // 지역명 API가 실패하면 아래 주소 조회로 넘어간다.
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(latitude))
  url.searchParams.set('lon', String(longitude))
  url.searchParams.set('accept-language', 'ko')
  url.searchParams.set('zoom', '12')
  const region = regionFromAddress((await readJson<NominatimResponse>(url.toString())).address)
  if (!region) throw new Error('region missing')
  return region
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherSnapshot> {
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast')
  forecastUrl.searchParams.set('latitude', String(latitude))
  forecastUrl.searchParams.set('longitude', String(longitude))
  forecastUrl.searchParams.set('current', 'temperature_2m,weather_code')
  forecastUrl.searchParams.set('hourly', 'temperature_2m,weather_code')
  forecastUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min')
  forecastUrl.searchParams.set('timezone', 'auto')
  forecastUrl.searchParams.set('forecast_days', '2')

  const [forecast, place] = await Promise.all([
    readJson<ForecastResponse>(forecastUrl.toString()),
    fetchRegion(latitude, longitude),
  ])

  const hours = forecast.hourly.time.map((time, index) => ({
    time,
    temp: forecast.hourly.temperature_2m[index],
    code: forecast.hourly.weather_code[index],
  }))

  return {
    place,
    temp: forecast.current.temperature_2m,
    code: forecast.current.weather_code,
    high: forecast.daily.temperature_2m_max[0],
    low: forecast.daily.temperature_2m_min[0],
    hours,
    utcOffsetSeconds: forecast.utc_offset_seconds,
  }
}
