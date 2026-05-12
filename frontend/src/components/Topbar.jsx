export default function Topbar() {
  return (
    <div className="w-full bg-[#000066]">
      {/* Container simulating row with flex, h-40px on desktop, and auto height on mobile */}
      <div className="flex flex-col md:flex-row items-center md:h-[40px] text-[#ffffff] text-[12px] font-sans px-[15px] pt-2 md:pt-0 pb-3 md:pb-0 max-w-[1920px] mx-auto gap-2 md:gap-0">

        {/* Left Side: Slogan/Text */}
        <div className="w-full md:flex-1 text-center md:text-left font-tamil">
          அறிவால் விளையும் உலகு
        </div>

        {/* Center: Official Info (GST/CSR) */}
        <div className="w-full md:flex-1 text-center text-[10px] md:text-[12px]">
          GSTIN:33AAAJP0951B1ZP &nbsp; CSR Reg.No: CSR00061509
        </div>

        {/* Right Side: Controls (A+ A A-) & Social Icons */}
        <div className="w-full md:flex-1 flex justify-center md:justify-end items-center gap-4">

          {/* Font Controls */}
          <div className="flex items-center">
            <span className="bg-[#dc3545] text-white px-[10px] py-[3px] font-bold text-[13px] rounded cursor-pointer ml-1 md:ml-[10px]">A+</span>
            <span className="bg-[#dc3545] text-white px-[10px] py-[3px] font-bold text-[13px] rounded cursor-pointer ml-[5px]">A</span>
            <span className="bg-[#dc3545] text-white px-[10px] py-[3px] font-bold text-[13px] rounded cursor-pointer ml-[5px]">A-</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center md:ml-[115px]">
            <a href="https://www.facebook.com/profile.php?id=100085246909314" target="_blank" rel="noreferrer" className="px-[2px] md:py-[6px]" >
              <img src="/fb.jpg" height="30" width="40" title="Facebook" className="h-[25px] md:h-[30px] w-auto" />
            </a>
            <a href="https://www.instagram.com/periyar_univesity_official/" target="_blank" rel="noreferrer" className="px-[2px] md:py-[6px]">
              <img src="/insta.jpeg" height="30" width="40" title="Instagram" className="h-[25px] md:h-[30px] w-auto" />
            </a>
            <a href="https://twitter.com/PeriyarVarsity" target="_blank" rel="noreferrer" className="px-[2px]">
              <img src="/twitter.png" height="25" width="35" title="Twitter" className="h-[20px] md:h-[25px] w-auto" />
            </a>
            <a href="https://www.youtube.com/channel/UCJqVMMa81Cnmu3LdLpsKXYw" target="_blank" rel="noreferrer" className="px-[2px]">
              <img src="/youtube.png" height="40" width="45" title="Youtube" className="h-[30px] md:h-[40px] w-auto" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
