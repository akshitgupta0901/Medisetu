export default function Topbar() {
    return (
      <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-18rem)] h-20 bg-[#101415]/80 backdrop-blur-xl border-b border-[#1E5128] flex items-center justify-between px-4 lg:px-10 z-40">
  
        <h2 className="text-3xl font-bold text-[#bac7e1]">
          Patient Dashboard
        </h2>
  
        <div className="flex items-center gap-4">
  
          <div className="hidden md:flex bg-[#272a2c] rounded-full px-4 py-2 text-xs text-[#c5c6cd]">
            EN / ES / FR
          </div>
  
          <button className="w-10 h-10 rounded-full bg-[#272a2c] flex items-center justify-center hover:bg-[#323537] transition">
            🔔
          </button>
  
        </div>
  
      </header>
    );
  }