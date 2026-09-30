import { useEffect, useState } from 'react'
import './Widgets.css'
import {
  describeWeather,
  fetchWeather,
  formatHour,
  formatTemp,
  locationHourKey,
  upcomingHours,
  type WeatherKind,
  type WeatherSnapshot,
} from './weather'

type Status = 'loading' | 'ready' | 'denied' | 'error'

function WeatherIcon({ kind }: { kind: WeatherKind }) {
  if (kind === 'cloud' || kind === 'fog') {
    return (
      <svg className="kv-weather__icon" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5.2 12.2h6.1a2.4 2.4 0 0 0 .2-4.8 3.2 3.2 0 0 0-6.1-.7 2.2 2.2 0 0 0-.2 5.5Z"
        />
        {kind === 'fog' ? (
          <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" d="M4 13.4h8" />
        ) : null}
      </svg>
    )
  }

  if (kind === 'partly') {
    return (
      <svg className="kv-weather__icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="6.2" cy="5.4" r="2.1" fill="currentColor" />
        <path
          fill="currentColor"
          d="M6.4 13h5.4a2.1 2.1 0 0 0 .2-4.2 2.7 2.7 0 0 0-5.2-.4 1.9 1.9 0 0 0-.4 4.6Z"
        />
      </svg>
    )
  }

  if (kind === 'rain' || kind === 'storm') {
    return (
      <svg className="kv-weather__icon" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.8 9.2h6.4a2.3 2.3 0 0 0 .2-4.6 3 3 0 0 0-5.8-.6 2.1 2.1 0 0 0-.8 5.2Z"
        />
        <path
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          d={kind === 'storm' ? 'M8 10.2 6.8 13' : 'M6.2 10.6 5.4 13M9.4 10.6 8.6 13'}
        />
      </svg>
    )
  }

  if (kind === 'snow') {
    return (
      <svg className="kv-weather__icon" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.8 8.4h6.4a2.3 2.3 0 0 0 .2-4.6 3 3 0 0 0-5.8-.6 2.1 2.1 0 0 0-.8 5.2Z"
        />
        <path stroke="currentColor" strokeWidth="1" strokeLinecap="round" d="M6 10.4v2.4M8 10.2v2.8M10 10.4v2.4" />
      </svg>
    )
  }

  return (
    <svg className="kv-weather__icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M8 1.4v1.8M8 12.8v1.8M1.4 8h1.8M12.8 8h1.8M3.2 3.2l1.3 1.3M11.5 11.5l1.3 1.3M3.2 12.8l1.3-1.3M11.5 4.5l1.3-1.3" />
      </g>
    </svg>
  )
}

export default function WeatherWidget() {
  const [status, setStatus] = useState<Status>('loading')
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }

    let cancelled = false
    let timer = 0
    let fetching = false
    let coords: { latitude: number; longitude: number } | null = null
    let offsetSeconds = 0
    let loadedHour = ''

    const load = async () => {
      if (!coords || fetching) return
      fetching = true
      try {
        const next = await fetchWeather(coords.latitude, coords.longitude)
        if (cancelled) return
        offsetSeconds = next.utcOffsetSeconds
        loadedHour = locationHourKey(offsetSeconds)
        setWeather(next)
        setStatus('ready')
      } catch {
        if (!cancelled && !loadedHour) setStatus('error')
      } finally {
        fetching = false
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return
        coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        void load()
        timer = window.setInterval(() => {
          const current = Date.now()
          setNow(current)
          if (!loadedHour) return
          if (locationHourKey(offsetSeconds, current) === loadedHour) return
          void load()
        }, 60_000)
      },
      () => {
        if (!cancelled) setStatus('denied')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    )

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  if (status !== 'ready' || !weather) {
    const message =
      status === 'denied'
        ? '위치 권한이 필요합니다'
        : status === 'error'
          ? '날씨를 불러오지 못했습니다'
          : '위치 확인 중'

    return (
      <section className="kv-weather is-idle" aria-label="날씨">
        <p className="kv-weather__message">{message}</p>
      </section>
    )
  }

  const current = describeWeather(weather.code)
  const hours = upcomingHours(weather.hours, weather.utcOffsetSeconds, now)

  return (
    <section className="kv-weather" aria-label="날씨">
      <div className="kv-weather__top">
        <div className="kv-weather__main">
          <p className="kv-weather__place">{weather.place}</p>
          <p className="kv-weather__temp">{formatTemp(weather.temp)}</p>
        </div>
        <div className="kv-weather__side">
          <p className="kv-weather__range">
            H {formatTemp(weather.high)}&nbsp;&nbsp;L {formatTemp(weather.low)}
          </p>
          <p className="kv-weather__status">
            <WeatherIcon kind={current.kind} />
            <span>{current.label}</span>
          </p>
        </div>
      </div>
      <div className="kv-weather__hours">
        {hours.map((hour) => {
          const detail = describeWeather(hour.code)
          return (
            <div key={hour.time} className="kv-weather__hour">
              <span>{formatHour(hour.time)}</span>
              <WeatherIcon kind={detail.kind} />
              <span>{formatTemp(hour.temp)}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
