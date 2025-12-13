import React from "react";
import Logo from "../assets/NovaLogo.png"

function LadoLogoPage() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-[#C4D0FF] text-white p-12 text-center h-full">
      <div className="select-none w-full max-w-sm">
        <img className="rounded-lg" src={Logo} alt="Logo" />

        <h2 className="font-bold text-7xl mb-10 relative mt-10 text-[#404040]">
          Clima<span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FD7702] to-orange-400">360</span>
        </h2>
      </div>
    </div>
  );
}

export default LadoLogoPage;