import { useNavigate } from 'react-router-dom'
import { IconChevronLeft } from '../ui/Icons'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-vine-100 text-vine-500 -ml-1"
          >
            <IconChevronLeft size={22} strokeWidth={2.5} />
          </button>
        )}
        <h1 className="text-lg font-bold text-vine-800 tracking-tight">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  )
}
