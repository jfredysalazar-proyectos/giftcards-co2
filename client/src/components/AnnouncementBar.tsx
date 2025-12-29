import { trpc } from "@/lib/trpc";
import { Megaphone, X } from "lucide-react";
import { useState } from "react";

function AnnouncementBar() {
  const { data: announcement, isLoading } = trpc.announcements.getActive.useQuery();
  const [isVisible, setIsVisible] = useState(true);

  if (isLoading || !announcement || !isVisible) {
    return null;
  }

  return (
    <div
      className="relative w-full py-2 px-4 text-sm font-medium overflow-hidden"
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Icon */}
        <Megaphone className="w-4 h-4 flex-shrink-0 z-10" />
        
        {/* Marquee Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="inline-block px-4">{announcement.text}</span>
            <span className="inline-block px-4">{announcement.text}</span>
            <span className="inline-block px-4">{announcement.text}</span>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 hover:opacity-75 transition-opacity z-10"
          aria-label="Cerrar anuncio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default AnnouncementBar;
