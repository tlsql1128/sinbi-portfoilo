import Calendar from './Calendar'
import MemoWidget from './MemoWidget'
import WeatherWidget from './WeatherWidget'
import './Widgets.css'

export default function WidgetStack() {
  return (
    <div className="kv-widget-stack">
      <Calendar />
      <WeatherWidget />
      <MemoWidget />
    </div>
  )
}
