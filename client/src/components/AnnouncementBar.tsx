import { trpc } from "@/lib/trpc";
import { Megaphone, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const { data: announcement, isLoading } = trpc.announcements.getActive.useQuery();
  const [isVisible, setIsVisible] = useState(true);

  if (isLoading || !announcement || !isVisible) {
    return null;
  }

  return (
    <div
      className="relative w-full py-2 px-4 text-center text-sm font-medium transition-all duration-300"
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <p className="flex-1">{announcement.text}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
          aria-label="Cerrar anuncio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
