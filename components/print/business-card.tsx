import { Logo } from "@/components/logo"

interface BusinessCardProps {
  name: string
  title: string
  email: string
  phone: string
  website: string
}

export function BusinessCard({ name, title, email, phone, website }: BusinessCardProps) {
  return (
    <div className="w-[85mm] h-[55mm] bg-white rounded-md overflow-hidden shadow-lg flex flex-col">
      {/* Front of card */}
      <div className="w-full h-1/2 p-6 bg-gradient-to-br from-primary/90 to-primary flex items-center">
        <Logo size="lg" variant="white" />
      </div>

      {/* Back of card */}
      <div className="w-full h-1/2 p-6 bg-white flex justify-between">
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          <div className="text-xs space-y-1">
            <p>{email}</p>
            <p>{phone}</p>
            <p>{website}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-14 h-14">
            <path d="M30,30 L30,45 L45,45 L45,30 L30,30 Z M35,35 L40,35 L40,40 L35,40 L35,35 Z" fill="currentColor" />
            <path d="M50,30 L50,45 L65,45 L65,30 L50,30 Z M55,35 L60,35 L60,40 L55,40 L55,35 Z" fill="currentColor" />
            <path d="M30,50 L30,65 L45,65 L45,50 L30,50 Z M35,55 L40,55 L40,60 L35,60 L35,55 Z" fill="currentColor" />
            <path d="M50,50 L50,55 L55,55 L55,50 L50,50 Z" fill="currentColor" />
            <path d="M60,50 L60,55 L65,55 L65,50 L60,50 Z" fill="currentColor" />
            <path d="M50,60 L50,65 L55,65 L55,60 L50,60 Z" fill="currentColor" />
            <path d="M60,60 L60,65 L65,65 L65,60 L60,60 Z" fill="currentColor" />
            <rect x="30" y="30" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="50" y="30" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="30" y="50" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  )
}
