export default function MobileBottomNav() {
    return (
      <nav className="fixed bottom-0 left-0 w-full lg:hidden bg-[#323537] border-t border-[#1E5128] flex justify-around py-4 z-50">
  
        <div className="text-[#86db70] text-xs font-bold">
          Home
        </div>
  
        <div className="text-[#c5c6cd] text-xs">
          Services
        </div>
  
        <div className="text-[#c5c6cd] text-xs">
          Book
        </div>
  
        <div className="text-[#c5c6cd] text-xs">
          Reports
        </div>
  
        <div className="text-[#c5c6cd] text-xs">
          Settings
        </div>
  
      </nav>
    );
  }