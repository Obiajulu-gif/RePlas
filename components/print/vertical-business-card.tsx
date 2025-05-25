import { Logo } from "@/components/logo"

interface VerticalBusinessCardProps {
  name: string
  title: string
  email: string
  phone: string
  website: string
}

export function VerticalBusinessCard({ name, title, email, phone, website }: VerticalBusinessCardProps) {
  return (
    <div className="w-[55mm] h-[85mm] bg-white rounded-md overflow-hidden shadow-lg flex flex-col">
      {/* Top section with logo */}
      <div className="w-full h-1/3 bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center p-4">
        <Logo size="lg" variant="white" />
      </div>

      {/* Middle section with name and title */}
      <div className="w-full p-4 bg-white border-b border-gray-100 text-center">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      {/* Bottom section with contact info */}
      <div className="w-full flex-1 p-4 bg-white flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-xs flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{phone}</span>
          </p>
          <p className="text-xs flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>{email}</span>
          </p>
          <p className="text-xs flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{website}</span>
          </p>
        </div>

        {/* QR Code */}
        <div className="w-full flex justify-center mt-2">
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
    </div>
  )
}
