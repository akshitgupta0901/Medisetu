export default function MobileBottomNav() {
    return (
      <nav className="fixed bottom-0 left-0 w-full lg:hidden bg-[slate-800] border-t border-[slate-800] flex justify-around py-4 z-50">
  
        <div className="text-[teal-400] text-xs font-bold">
          Home
        </div>
  
        <div className="text-[slate-400] text-xs">
          Services
        </div>
  
        <div className="text-[slate-400] text-xs">
          Book
        </div>
  
        <div className="text-[slate-400] text-xs">
          Reports
        </div>
  
        <div className="text-[slate-400] text-xs">
          Settings
        </div>
  
      </nav>
    );
  }