import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, FileText, Palette, Globe,
  Megaphone, TrendingUp, Shield, Presentation, History, Settings, Newspaper
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'

const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Generate Kit', path: ROUTES.NEW, icon: Sparkles },
  { divider: true },
  { label: 'Business Plan', path: ROUTES.BUSINESS_PLAN, icon: FileText },
  { label: 'Branding', path: ROUTES.BRANDING, icon: Palette },
  { label: 'Website', path: ROUTES.WEBSITE, icon: Globe },
  { label: 'Marketing', path: ROUTES.MARKETING, icon: Megaphone },
  { label: 'Finance', path: ROUTES.FINANCE, icon: TrendingUp },
  { label: 'Compliance', path: ROUTES.COMPLIANCE, icon: Shield },
  { label: 'Pitch Deck', path: ROUTES.PITCH_DECK, icon: Presentation },
  { label: 'AI News & Intel', path: ROUTES.NEWS, icon: Newspaper },
  { divider: true },
  { label: 'History', path: ROUTES.HISTORY, icon: History },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-[calc(100vh-4rem)] transition-colors duration-300">
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item, idx) => {
          if (item.divider) {
            return <div key={idx} className="my-2 border-t border-slate-100 dark:border-slate-700" />
          }

          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'transition-colors duration-150 group',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={17}
                className={[
                  'shrink-0 transition-colors',
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300',
                ].join(' ')}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
