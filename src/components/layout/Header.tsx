import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-vine-100">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-vine-100 text-vine-600 text-xl"
          >
            ←
          </button>
        )}
        <h1 className="text-xl font-bold text-vine-700">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  )
}
