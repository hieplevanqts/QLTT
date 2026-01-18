import svgPaths from "./svg-vd5pdb2955";
import imgImageMappaLogo from "figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png";

function Section() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

function ImageMappaLogo() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Image (Mappa Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageMappaLogo} />
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[118.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[59.5px] not-italic text-[#101828] text-[16px] text-center top-[-1px] translate-x-[-50%] w-[119px] whitespace-pre-wrap">Xin chào, Ghfjh</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[67.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#667085] text-[12px] text-center whitespace-pre">Quản lý cục</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-center left-[24px] top-[11.5px] w-[166.438px]" data-name="Button">
      <ImageMappaLogo />
      <Container />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[40px] left-0 rounded-[6px] top-0 w-[576px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[44px] pr-[76px] py-0 relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Tìm cơ sở / hồ sơ / kế hoạch / đợt kiểm tra…</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[14px] size-[18px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p126da180} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 15.75L12.525 12.525" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function GlobalSearch() {
  return (
    <div className="absolute h-[40px] left-[381.7px] top-[11.5px] w-[576px]" data-name="GlobalSearch">
      <TextInput />
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2258_3364)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2258_3364">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TopUtilityBar() {
  return (
    <div className="h-[20px] relative shrink-0 w-[13.75px]" data-name="TopUtilityBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[7px] not-italic text-[#101828] text-[14px] text-center top-0 translate-x-[-50%] whitespace-pre">VI</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-center left-0 rounded-[6px] top-0 w-[53.75px]" data-name="Button">
      <Icon1 />
      <TopUtilityBar />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2258_3356)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2c05df00} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2258_3356">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[57.75px] rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function TopUtilityBar1() {
  return (
    <div className="bg-gradient-to-b from-[#005cb6] relative rounded-[33554400px] shrink-0 size-[32px] to-[#695cfb]" data-name="TopUtilityBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center justify-center left-[137.75px] rounded-[6px] top-[2px] w-[48px]" data-name="Button">
      <TopUtilityBar1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p388cb800} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p5baad20} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function TopUtilityBar2() {
  return <div className="absolute bg-[#d92d20] left-[24px] rounded-[33554400px] size-[8px] top-[4px]" data-name="TopUtilityBar" />;
}

function Button4() {
  return (
    <div className="absolute left-[97.75px] rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon4 />
      <TopUtilityBar2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[36px] left-[1324.23px] top-[13.5px] w-[185.75px]" data-name="Container">
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function TopUtilityBar3() {
  return (
    <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="TopUtilityBar">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Button />
      <GlobalSearch />
      <Container1 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pff0fc00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d76d410} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f091200} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39897300} id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon5 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[72.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Tổng quan</p>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[36px] relative shrink-0 w-[119.875px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3489cb80} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 3.84267V13.8427" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 2.15733V12.1573" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon6 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[94.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Bản đồ điều hành</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[163.922px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button6 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2258_3480)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2258_3480">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon7 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[89px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">{`Cơ sở & Địa bàn`}</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[153.781px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button7 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p27fdb880} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon8 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[89px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Nguồn tin / Risk</p>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[153.625px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button8 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p368df400} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a53aa80} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 7.33333H10.6667" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H10.6667" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 7.33333H5.34" id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 10.6667H5.34" id="Vector_6" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon9 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[105.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Kế hoạch tác nghiệp</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[36px] relative shrink-0 w-[185.172px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon10 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[108.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Nhiệm vụ hiện trường</p>
    </div>
  );
}

function Link5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[192.016px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p31ef8080} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1b1cb900} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 11.3333V14.6667" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pee6d180} id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon11 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[83px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Kho chứng cứ</p>
    </div>
  );
}

function Link6() {
  return (
    <div className="h-[36px] relative shrink-0 w-[141.375px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button11 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon12 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[82.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">{`Báo cáo & KPI`}</p>
    </div>
  );
}

function Link7() {
  return (
    <div className="h-[36px] relative shrink-0 w-[141px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button12 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14890d00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[36px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon13 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[62px] not-italic text-[#005cb6] text-[14px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Quản trị</p>
    </div>
  );
}

function Link8() {
  return (
    <div className="h-[36px] relative shrink-0 w-[101px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Button13 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 2V14" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p128dbc60} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[6px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[114.92px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="bg-[#005cb6] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon15 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[71px] not-italic text-[14px] text-center text-white top-[8px] translate-x-[-50%] whitespace-pre">Tạo nhanh</p>
        <Icon16 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[186.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function HorizontalNavBar() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-full" data-name="HorizontalNavBar">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center pb-px pl-[24px] pr-0 pt-0 relative size-full">
          <Link />
          <Link1 />
          <Link2 />
          <Link3 />
          <Link4 />
          <Link5 />
          <Link6 />
          <Link7 />
          <Link8 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[61.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0 whitespace-pre">Trang chủ</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[49.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-0 whitespace-pre">Quản trị</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[1486px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text2 />
        <Icon17 />
        <Text3 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#101828] text-[28px] top-0 whitespace-pre">Quản trị</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Quản lý người dùng, phân quyền, danh mục, cấu hình và giám sát hệ thống</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[69px] relative shrink-0 w-[494.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[13.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pae3c380} id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="h-[46.5px] relative rounded-[6px] shrink-0 w-[323.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon18 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[176.5px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%] whitespace-pre">{`Quản trị Người dùng & Phân quyền`}</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[13.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2e7662c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pbd81000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2a44e700} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="bg-[#005cb6] h-[46.5px] relative rounded-[6px] shrink-0 w-[230.625px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon19 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[129.5px] not-italic text-[15px] text-center text-white top-[10px] translate-x-[-50%] whitespace-pre">{`Danh mục & Cấu hình`}</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[13.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2258_3494)" id="Icon">
          <path d={svgPaths.p363df2c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2258_3494">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="h-[46.5px] relative rounded-[6px] shrink-0 w-[280.719px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[154px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Audit – Giám sát – Tình trạng</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[72.5px] relative rounded-[8px] shrink-0 w-[1486px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start overflow-clip pb-px pl-[13px] pr-px pt-[13px] relative rounded-[inherit] size-full">
        <Button16 />
        <Button17 />
        <Button18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2b393280} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3eea2890} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2bdcbd80} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[196.438px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[110px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Danh mục dùng chung</p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pea6a680} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3155f180} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[195.563px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon22 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[110.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Cấu hình chỉ báo rủi ro</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p299d1200} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[213.391px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[119px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Checklist theo chuyên đề</p>
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-white h-[35.5px] relative rounded-[6px] shrink-0 w-[171.328px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon24 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[98px] not-italic text-[#005cb6] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Thiết lập biểu mẫu</p>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[170.391px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon25 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[97.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Quy tắc thông báo</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[59.5px] relative shrink-0 w-[1484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start overflow-clip pb-0 pl-[12px] pr-0 pt-[12px] relative rounded-[inherit] size-full">
        <Button19 />
        <Button20 />
        <Button21 />
        <Button22 />
        <Button23 />
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả trạng thái</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Không hoạt động</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[658.48px] pb-px pl-[-704.484px] pr-[884.484px] pt-[-312.5px] rounded-[8px] top-px w-[180px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option />
      <Option1 />
      <Option2 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[18px] size-[18px] top-[11.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p258d0c40} id="Vector" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 2.25V6H12" id="Vector_2" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pf844500} id="Vector_3" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 12H2.25V15.75" id="Vector_4" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-0 rounded-[8px] top-0 w-[120.422px]" data-name="Button">
      <Icon26 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[72.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Làm mới</p>
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[18px] size-[18px] top-[11.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a382d00} id="Vector" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p678c080} id="Vector_2" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 13.5V9" id="Vector_3" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p23d38480} id="Vector_4" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-[132.42px] rounded-[8px] top-0 w-[134.453px]" data-name="Button">
      <Icon27 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[79.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Xuất Excel</p>
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[18px] size-[18px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M3.75 9H14.25" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 3.75V14.25" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="absolute bg-[#005cb6] h-[43px] left-[459.17px] rounded-[8px] top-0 w-[128.344px]" data-name="Button">
      <Icon28 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[77.5px] not-italic text-[14px] text-center text-white top-[11px] translate-x-[-50%] whitespace-pre">Thêm mới</p>
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[18px] size-[18px] top-[11.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12.75 6L9 2.25L5.25 6" id="Vector_2" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 2.25V11.25" id="Vector_3" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-[132.3px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-[278.88px] rounded-[8px] top-0 w-[168.297px]" data-name="Button">
      <Icon29 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[84.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Nhập dữ liệu</p>
      <Icon30 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[43px] left-[854.48px] top-0 w-[587.516px]" data-name="Container">
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[43px] left-0 rounded-[8px] top-0 w-[642.484px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[42px] pr-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Tìm kiếm theo mã, tên, mô tả...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[14px] size-[18px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p126da180} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 15.75L12.525 12.525" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[43px] left-0 top-0 w-[642.484px]" data-name="Container">
      <TextInput1 />
      <Icon31 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Container">
      <Dropdown />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[85px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[21px] px-[21px] relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[42.5px] left-0 top-0 w-[60px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[42.5px] left-[60px] top-0 w-[146.406px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Mã biểu mẫu</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[42.5px] left-[206.41px] top-0 w-[313.234px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Tên biểu mẫu</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[42.5px] left-[519.64px] top-0 w-[522.359px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Mô tả</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute h-[42.5px] left-[1042px] top-0 w-[110px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Số tiêu chí</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute h-[42.5px] left-[1152px] top-0 w-[130px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Trạng thái</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute h-[42.5px] left-[1282px] top-0 w-[200px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase whitespace-pre">Thao tác</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[42.5px] left-0 top-0 w-[1482px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f2f4f7] border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[42.5px] left-0 top-0 w-[1482px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[60px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[16px] not-italic text-[#101828] text-[14px] top-[29px] whitespace-pre">1</p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[28px] items-start left-[16px] px-[11px] py-[5px] rounded-[6px] top-[25.5px] w-[114.406px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#667085] text-[14px] whitespace-pre">KT_HANG_GIA</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[79px] left-[60px] top-0 w-[146.406px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[29px] w-[242.266px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Kiểm tra Cơ sở Kinh doanh Hàng giả</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[79px] left-[206.41px] top-0 w-[313.234px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[421.953px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Biểu mẫu kiểm tra nghiệp vụ cho chuyên đề kiểm tra cơ sở kin...</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[79px] left-[519.64px] top-0 w-[522.359px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[78px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[10px] not-italic text-[#005cb6] text-[14px] top-[4px] w-[44px] whitespace-pre-wrap">15 tiêu chí</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[79px] left-[1042px] top-0 w-[110px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-[10px] size-[12.063px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0625 12.0625">
        <g id="Icon">
          <path d={svgPaths.p19574080} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
          <path d={svgPaths.p3a74900} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[98px]" data-name="Text">
      <Icon32 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[28.06px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[79px] left-[1152px] top-0 w-[130px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19ef4f80} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 8.25L9 10.5L16.5 3" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pac54200} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19234b00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2804be00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M2.25 4.5H15.75" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1af4f180} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p25aaaf00} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 8.25V12.75" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[24.5px] w-[168px]" data-name="Container">
      <Button28 />
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[79px] left-[1282px] top-0 w-[200px]" data-name="Table Cell">
      <Container11 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[79px] left-0 top-0 w-[1482px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[60px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[16px] not-italic text-[#101828] text-[14px] top-[29px] whitespace-pre">2</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[28px] items-start left-[16px] px-[11px] py-[5px] rounded-[6px] top-[25.5px] w-[97.609px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#667085] text-[14px] whitespace-pre">KT_ATVSTP</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[79px] left-[60px] top-0 w-[146.406px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[29px] w-[246.391px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Kiểm tra An toàn Vệ sinh Thực phẩm</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[79px] left-[206.41px] top-0 w-[313.234px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[422.969px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Biểu mẫu kiểm tra cơ sở sản xuất, kinh doanh thực phẩm theo ...</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[79px] left-[519.64px] top-0 w-[522.359px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[78px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[10px] not-italic text-[#005cb6] text-[14px] top-[4px] w-[38px] whitespace-pre-wrap">6 tiêu chí</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[79px] left-[1042px] top-0 w-[110px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="absolute left-[10px] size-[12.063px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0625 12.0625">
        <g id="Icon">
          <path d={svgPaths.p19574080} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
          <path d={svgPaths.p1153fa80} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
        </g>
      </svg>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[98px]" data-name="Text">
      <Icon37 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[28.06px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[79px] left-[1152px] top-0 w-[130px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19ef4f80} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 8.25L9 10.5L16.5 3" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button32() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pac54200} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19234b00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2804be00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button34() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon40 />
      </div>
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M2.25 4.5H15.75" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1af4f180} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p25aaaf00} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 8.25V12.75" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon41 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[24.5px] w-[168px]" data-name="Container">
      <Button32 />
      <Button33 />
      <Button34 />
      <Button35 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[79px] left-[1282px] top-0 w-[200px]" data-name="Table Cell">
      <Container12 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[79px] left-0 top-[79px] w-[1482px]" data-name="Table Row">
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[78.5px] left-0 top-0 w-[60px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[16px] not-italic text-[#101828] text-[14px] top-[29px] whitespace-pre">3</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[28px] items-start left-[16px] px-[11px] py-[5px] rounded-[6px] top-[25.5px] w-[114.406px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#667085] text-[14px] whitespace-pre">KT_XANG_DAU</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[78.5px] left-[60px] top-0 w-[146.406px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[29px] w-[204.734px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Kiểm tra Kinh doanh Xăng dầu</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[78.5px] left-[206.41px] top-0 w-[313.234px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[432.219px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Biểu mẫu kiểm tra cửa hàng xăng dầu, đảm bảo chất lượng nhiê...</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[78.5px] left-[519.64px] top-0 w-[522.359px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[78px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[10px] not-italic text-[#005cb6] text-[14px] top-[4px] w-[38px] whitespace-pre-wrap">2 tiêu chí</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[78.5px] left-[1042px] top-0 w-[110px]" data-name="Table Cell">
      <Text17 />
    </div>
  );
}

function Icon42() {
  return (
    <div className="absolute left-[10px] size-[12.063px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0625 12.0625">
        <g id="Icon">
          <path d={svgPaths.p19574080} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
          <path d={svgPaths.p1153fa80} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.00521" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[14.5px] w-[98px]" data-name="Text">
      <Icon42 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[28.06px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[78.5px] left-[1152px] top-0 w-[130px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19ef4f80} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 8.25L9 10.5L16.5 3" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon43 />
      </div>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pac54200} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon44 />
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p19234b00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2804be00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button38() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon45 />
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M2.25 4.5H15.75" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1af4f180} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p25aaaf00} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 8.25V12.75" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M10.5 8.25V12.75" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button39() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon46 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[24.5px] w-[168px]" data-name="Container">
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[78.5px] left-[1282px] top-0 w-[200px]" data-name="Table Cell">
      <Container13 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute h-[78.5px] left-0 top-[158px] w-[1482px]" data-name="Table Row">
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[236.5px] left-0 top-[42.5px] w-[1482px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[279px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white h-[281px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Table />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]" />
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[50.48px] top-px w-[5.5px]" data-name="Bold Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] whitespace-pre">1</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[69.28px] top-px w-[8.281px]" data-name="Bold Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] whitespace-pre">3</p>
    </div>
  );
}

function BoldText2() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[166.94px] top-px w-[8.281px]" data-name="Bold Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] whitespace-pre">3</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[19.5px] left-[16px] top-[26px] w-[224.281px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0 whitespace-pre">Hiển thị</p>
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[55.98px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">-</p>
      <BoldText1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[77.56px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">trong tổng số</p>
      <BoldText2 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[175.22px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">bản ghi</p>
    </div>
  );
}

function Icon47() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[10.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.5px] min-h-px min-w-px opacity-50 relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon47 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[51.5px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%] whitespace-pre">Trước</p>
      </div>
    </div>
  );
}

function Button41() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 92, 182) 0%, rgb(0, 74, 148) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#005cb6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[13px] text-center text-white whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Text19() {
  return <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px" data-name="Text" />;
}

function Container16() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button41 />
        <Text19 />
      </div>
    </div>
  );
}

function Icon48() {
  return (
    <div className="absolute left-[40.61px] size-[16px] top-[10.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="bg-white h-[37.5px] relative rounded-[8px] shrink-0 w-[69.609px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[25px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%] whitespace-pre">Sau</p>
        <Icon48 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[37.5px] items-center left-[1224.06px] top-[17px] w-[243.938px]" data-name="Container">
      <Button40 />
      <Container16 />
      <Button42 />
    </div>
  );
}

function Pagination() {
  return (
    <div className="bg-white h-[70.5px] relative shrink-0 w-full" data-name="Pagination">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Container17 />
    </div>
  );
}

function FormTemplatesTab() {
  return (
    <div className="h-[476.5px] relative shrink-0 w-[1484px]" data-name="FormTemplatesTab">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container10 />
        <Container14 />
        <Pagination />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-white h-[600px] relative rounded-[8px] shrink-0 w-[1486px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container6 />
        <FormTemplatesTab />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[950px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pb-0 pl-[24px] pr-0 pt-[24px] relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
        <Container18 />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col h-[1070px] items-start relative shrink-0 w-full" data-name="MainLayout">
      <TopUtilityBar3 />
      <HorizontalNavBar />
      <AdminPage />
    </div>
  );
}

function PD() {
  return (
    <div className="absolute content-stretch flex flex-col h-[935px] items-start left-0 top-0 w-[1534px]" data-name="pD">
      <Section />
      <MainLayout />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[19.5px] left-[39px] top-[16px] w-[274.844px]" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#0973dc] text-[13px] top-[-1px] whitespace-pre">Chức năng sửa biểu mẫu đang được phát triển</p>
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p11304070} fill="var(--fill-0, #0973DC)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex items-center left-[13px] pl-[-1px] pr-0 py-0 size-[16px] top-[17.75px]" data-name="Container">
      <Icon49 />
    </div>
  );
}

function Toast() {
  return (
    <div className="absolute bg-[#f0f8ff] border border-[#dde7fd] border-solid h-[53.5px] left-[1154px] rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] top-[159px] w-[356px]" data-name="Toast">
      <Container19 />
      <Container20 />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <PD />
      <Toast />
    </div>
  );
}