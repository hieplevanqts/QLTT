import svgPaths from "./svg-022czgabg5";
import imgImageMappaLogo from "figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png";

function ImageMappaLogo() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Image (Mappa Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageMappaLogo} />
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[183.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[92px] not-italic text-[#101828] text-[16px] text-center top-[-1px] translate-x-[-50%] w-[184px] whitespace-pre-wrap">Xin chào, Nguyenvanan</p>
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
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-center left-[24px] top-[11.5px] w-[231.672px]" data-name="Button">
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
    <div className="absolute h-[40px] left-[425.86px] top-[11.5px] w-[576px]" data-name="GlobalSearch">
      <TextInput />
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1825)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1825">
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
        <g clipPath="url(#clip0_2303_1984)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc878d80} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1984">
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
    <div className="absolute h-[36px] left-[1326.23px] top-[13.5px] w-[185.75px]" data-name="Container">
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
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-b border-solid inset-0 pointer-events-none" />
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
          <path d={svgPaths.p37e6c200} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
        <g clipPath="url(#clip0_2303_1902)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1902">
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
          <path d={svgPaths.p30f6f500} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
          <path d={svgPaths.p3cfa9500} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-b border-solid inset-0 pointer-events-none" />
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
    <div className="h-[19.5px] relative shrink-0 w-[1488px]" data-name="Container">
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
          <path d={svgPaths.p2e7662c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pbd81000} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2a44e700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="h-[46.5px] relative rounded-[6px] shrink-0 w-[229.594px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon19 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[129.5px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%] whitespace-pre">{`Danh mục & Cấu hình`}</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[13.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2303_1955)" id="Icon">
          <path d={svgPaths.p363df2c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1955">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="bg-[#005cb6] h-[46.5px] relative rounded-[6px] shrink-0 w-[282.406px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[155px] not-italic text-[15px] text-center text-white top-[10px] translate-x-[-50%] whitespace-pre">Audit – Giám sát – Tình trạng</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[72.5px] relative rounded-[8px] shrink-0 w-[1488px]" data-name="Container">
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
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-white h-[35.5px] relative rounded-[6px] shrink-0 w-[196.359px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[110.5px] not-italic text-[#005cb6] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Trung tâm xuất dữ liệu</p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[162.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon22 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[93.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Nhật ký hệ thống</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1947)" id="Icon">
          <path d={svgPaths.p3227a460} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1947">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[163.703px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[94px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Biến động dữ liệu</p>
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12V8" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 10L8 12L10 10" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[160.859px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon24 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[92px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Nhật ký tải / xuất</p>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[164.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon25 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[94.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Cấu hình bảo mật</p>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1835)" id="Icon">
          <path d={svgPaths.p17915680} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p294d5f00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1835">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[172.047px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon26 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[98.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Trạng thái tích hợp</p>
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1931)" id="Icon">
          <path d={svgPaths.p15f82200} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p375323f0} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4H4.00667" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 12H4.00667" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1931">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button25() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[168.578px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon27 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[96px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Giám sát hệ thống</p>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1918)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1918">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[176.797px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon28 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[100px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Trạng thái hệ thống</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[59.5px] relative shrink-0 w-[1486px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start overflow-clip pb-0 pl-[12px] pr-0 pt-[12px] relative rounded-[inherit] size-full">
        <Button19 />
        <Button20 />
        <Button21 />
        <Button22 />
        <Button23 />
        <Button24 />
        <Button25 />
        <Button26 />
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Tất cả trạng thái</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Pending</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Processing</p>
    </div>
  );
}

function Option3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Completed</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Failed</p>
    </div>
  );
}

function Option5() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Cancelled</p>
    </div>
  );
}

function Option6() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Expired</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[46px] items-start left-[372px] pb-px pl-[-397px] pr-[571px] pt-[-42.5px] rounded-[8px] top-px w-[174px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
      <Option6 />
    </div>
  );
}

function Option7() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Tất cả loại dữ liệu</p>
    </div>
  );
}

function Option8() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Quy tắc thông báo</p>
    </div>
  );
}

function Option9() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Nhật ký audit</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[46px] items-start left-[558px] pb-px pl-[-583px] pr-[773px] pt-[-42.5px] rounded-[8px] top-px w-[190px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option7 />
      <Option8 />
      <Option9 />
    </div>
  );
}

function Option10() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Tất cả người yêu cầu</p>
    </div>
  );
}

function Option11() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Nguyễn Văn Admin (admin@mappa....</p>
    </div>
  );
}

function Option12() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Trần Thị Kiểm Tra (test@mappa....</p>
    </div>
  );
}

function Option13() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Lê Văn Supervisor (supervisor@...</p>
    </div>
  );
}

function Option14() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Phạm Thị Security (security@ma...</p>
    </div>
  );
}

function Option15() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Hoàng Văn Analyst (analyst@map...</p>
    </div>
  );
}

function Option16() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Đỗ Thị Manager (manager@mappa....</p>
    </div>
  );
}

function Option17() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0 whitespace-pre-wrap">Vũ Thị Director (director@mapp...</p>
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[46px] items-start left-[760px] pb-px pl-[-785px] pr-[1025px] pt-[-42.5px] rounded-[8px] top-px w-[240px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option10 />
      <Option11 />
      <Option12 />
      <Option13 />
      <Option14 />
      <Option15 />
      <Option16 />
      <Option17 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[48px] left-0 rounded-[8px] top-0 w-[360px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[16px] py-[11px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[16px] whitespace-pre">Tìm theo Job ID hoặc Tên nguồn...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p126da180} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 15.75L12.525 12.525" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[360px]" data-name="Container">
      <TextInput1 />
      <Icon29 />
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Dropdown />
        <Dropdown1 />
        <Dropdown2 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-[19px] size-[18px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p258d0c40} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 2.25V6H12" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pf844500} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 12H2.25V15.75" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-[128.484px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon30 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[77.5px] not-italic text-[#101828] text-[16px] text-center top-[11px] translate-x-[-50%] whitespace-pre">Làm mới</p>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[20px] size-[18px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M3.75 9H14.25" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 3.75V14.25" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="bg-[#005cb6] flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon31 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[105.5px] not-italic text-[16px] text-center text-white top-[11px] translate-x-[-50%] whitespace-pre">Tạo Export Mới</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[48px] relative shrink-0 w-[323.516px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <Button27 />
        <Button28 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[139.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">📅 Khoảng thời gian:</p>
      </div>
    </div>
  );
}

function DatePicker() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-[173px]" data-name="Date Picker">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[16px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#667085] text-[16px] top-[-1px] whitespace-pre">→</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48px] items-center relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <DatePicker />
      <Text5 />
      <DatePicker />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[140px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px] whitespace-pre">📊</p>
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[42px] relative shrink-0 w-[29.719px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#1976d2] text-[28px] top-0 whitespace-pre">12</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[250.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text6 />
        <Text7 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Tổng số</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[105px] items-start left-0 pl-[17px] pr-px py-[17px] rounded-[8px] top-0 w-[284.391px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container13 />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px] whitespace-pre">✅</p>
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[42px] relative shrink-0 w-[18.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#155724] text-[28px] top-0 whitespace-pre">6</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[250.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text9 />
        <Text10 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Hoàn thành</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[105px] items-start left-[300.39px] pl-[17px] pr-px py-[17px] rounded-[8px] top-0 w-[284.406px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container15 />
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px] whitespace-pre">⏳</p>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[42px] relative shrink-0 w-[12.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#856404] text-[28px] top-0 whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[250.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text12 />
        <Text13 />
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Đang xử lý</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[105px] items-start left-[600.8px] pl-[17px] pr-px py-[17px] rounded-[8px] top-0 w-[284.391px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container17 />
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px] whitespace-pre">❌</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[42px] relative shrink-0 w-[12.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#721c24] text-[28px] top-0 whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[250.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text15 />
        <Text16 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250.406px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Thất bi</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[105px] items-start left-[901.19px] pl-[17px] pr-px py-[17px] rounded-[8px] top-0 w-[284.406px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container19 />
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px] whitespace-pre">⏸️</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="h-[42px] relative shrink-0 w-[12.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#666] text-[28px] top-0 whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[250.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Text18 />
        <Text19 />
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Đang chờ</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[105px] items-start left-[1201.59px] pl-[17px] pr-px py-[17px] rounded-[8px] top-0 w-[284.391px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container21 />
      <Text20 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[105px] relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container16 />
      <Container18 />
      <Container20 />
      <Container22 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-0 top-0 w-[96.391px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Job ID</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[96.39px] top-0 w-[250px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Source Name</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[346.39px] top-0 w-[149.344px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Source Type</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[495.73px] top-0 w-[142.172px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Requested By</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[637.91px] top-0 w-[138.938px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Status</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[776.84px] top-0 w-[141.219px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Requested At</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[918.06px] top-0 w-[144.516px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Completed At</p>
    </div>
  );
}

function HeaderCell7() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[1062.58px] top-0 w-[174.766px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[87.5px] not-italic text-[#101828] text-[14px] text-center top-[16px] tracking-[0.5px] translate-x-[-50%] uppercase whitespace-pre">Download Count</p>
    </div>
  );
}

function HeaderCell8() {
  return (
    <div className="absolute border-[#d0d5dd] border-r border-solid h-[54px] left-[1237.34px] top-0 w-[173.563px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Retention Policy</p>
    </div>
  );
}

function HeaderCell9() {
  return (
    <div className="absolute h-[54px] left-[1410.91px] top-0 w-[104.5px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-[14.5px] not-italic text-[#101828] text-[14px] top-[16px] tracking-[0.5px] uppercase whitespace-pre">Action</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[54px] left-0 top-0 w-[1515.406px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
      <HeaderCell7 />
      <HeaderCell8 />
      <HeaderCell9 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f2f4f7] border-[#d0d5dd] border-b-2 border-solid h-[54px] left-[2px] top-0 w-[1515.406px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function Code() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[32px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_001</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code />
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[21px] w-[204.563px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[205px] whitespace-pre-wrap">Export Quy tắc thông báo - Q4 2025</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[27px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[21px] w-[81.453px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[82px] whitespace-pre-wrap">Nguyễn Văn Admin</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text23 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text24() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[28px] w-[109.938px]" data-name="Container">
      <Icon32 />
      <Text24 />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[21px] w-[72.844px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[73px] whitespace-pre-wrap">15/01/2025 15:30</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text25 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[33px] w-[112px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#155724] text-[14px] whitespace-pre">15/01/2025 15:32</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[71.09px] rounded-[12px] top-[26.5px] w-[32.578px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[16.5px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">5</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text27 />
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute bg-[#fff3cd] h-[26px] left-[14.5px] rounded-[8px] top-[28.5px] w-[57.469px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">7 days</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81.5px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text28 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[23px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon33 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[81.5px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button29 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81.5px] left-0 top-0 w-[1515.406px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
    </div>
  );
}

function Code1() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_002</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code1 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[207.875px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[208px] whitespace-pre-wrap">Export Danh sách người dùng - Toàn hệ thống</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[91.672px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[92px] whitespace-pre-wrap">Trần Thị Kiểm Tra</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text31 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative size-[20.075px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0747 20.0747">
        <g id="Icon">
          <path d={svgPaths.p3582a580} id="Vector" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67289" />
        </g>
      </svg>
    </div>
  );
}

function Text32() {
  return (
    <div className="bg-[#fff3cd] h-[26px] relative rounded-[12px] shrink-0 w-[87.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">Processing</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex gap-[3.963px] h-[26px] items-center left-[14.5px] pl-[-2.037px] pr-0 py-0 top-[27.5px] w-[109.938px]" data-name="Container">
      <div className="flex items-center justify-center relative shrink-0 size-[25.187px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[107.522deg]">
          <Icon34 />
        </div>
      </div>
      <Text32 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container25 />
    </div>
  );
}

function Text33() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[109.188px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">15/01/2025 16:15</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text33 />
    </div>
  );
}

function Text34() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[6.453px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">-</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text34 />
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[29px] left-[70.75px] rounded-[12px] top-[26px] w-[33.25px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[17px] not-italic text-[#667085] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">0</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="absolute bg-[#d4edda] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[65.891px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">30 days</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text36 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative size-[22.584px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.584 22.584">
        <g id="Icon">
          <path d={svgPaths.p32b42e80} id="Vector" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.882" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex items-center justify-center relative shrink-0 size-[28.336px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[107.522deg]">
          <Icon35 />
        </div>
      </div>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button30 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[81.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
    </div>
  );
}

function Code2() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_003</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code2 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[200.172px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[201px] whitespace-pre-wrap">{`Export Cơ sở & Địa bàn - Miền Bắc`}</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text37 />
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text38 />
    </div>
  );
}

function Text39() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[71.813px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[72px] whitespace-pre-wrap">Lê Văn Supervisor</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text39 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1891)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1891">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text40() {
  return (
    <div className="bg-[#f8d7da] h-[26px] relative rounded-[12px] shrink-0 w-[58.141px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#721c24] text-[12px] top-[4px] whitespace-pre">Failed</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon36 />
      <Text40 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container26 />
    </div>
  );
}

function Text41() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[72.844px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[73px] whitespace-pre-wrap">15/01/2025 14:45</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text41 />
    </div>
  );
}

function Text42() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[6.453px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">-</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text42 />
    </div>
  );
}

function Text43() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[29px] left-[70.75px] rounded-[12px] top-[26px] w-[33.25px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[17px] not-italic text-[#667085] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">0</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text43 />
    </div>
  );
}

function Text44() {
  return (
    <div className="absolute bg-[#fff3cd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[57.469px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">7 days</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text44 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2303_1848)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 6V9" id="Vector_2" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 12H9.0075" id="Vector_3" stroke="var(--stroke-0, #721C24)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1848">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p258d0c40} id="Vector" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M15.75 2.25V6H12" id="Vector_2" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.pf844500} id="Vector_3" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 12H2.25V15.75" id="Vector_4" stroke="var(--stroke-0, #856404)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button32() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-start justify-center left-[14.5px] top-[22.5px] w-[76px]" data-name="Container">
      <Button31 />
      <Button32 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Container27 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[162.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function Code3() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_004</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code3 />
    </div>
  );
}

function Text45() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[175.672px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[176px] whitespace-pre-wrap">Export Audit Logs - Tháng 01/2025</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text45 />
    </div>
  );
}

function Text46() {
  return (
    <div className="absolute bg-[#fff3e0] border border-[#ffb74d] border-solid h-[28px] left-[14.5px] rounded-[6px] shadow-[0px_0px_0px_3px_rgba(230,81,0,0.1)] top-[26.5px] w-[120.344px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[18px] left-[10px] not-italic text-[#e65100] text-[12px] top-[4px] whitespace-pre">AUDIT_EXCERPT</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text46 />
    </div>
  );
}

function Text47() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[62px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[62px] whitespace-pre-wrap">Phạm Thị Security</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text47 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text48() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon39 />
      <Text48 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container28 />
    </div>
  );
}

function Text49() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.578px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">14/01/2025 23:20</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text49 />
    </div>
  );
}

function Text50() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.578px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#155724] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">14/01/2025 23:25</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text50 />
    </div>
  );
}

function Text51() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[68.05px] rounded-[12px] top-[26px] w-[38.656px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[19px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">12</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text51 />
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[65.922px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">90 days</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text52 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon40 />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button33 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute bg-[rgba(255,243,224,0.3)] border-[#e65100] border-b border-l-4 border-solid h-[81px] left-0 top-[243.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
    </div>
  );
}

function Code4() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_005</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code4 />
    </div>
  );
}

function Text53() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[170.625px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Export Danh mục - Tất cả</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text53 />
    </div>
  );
}

function Text54() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text54 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.391px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">Hoàng Văn Analyst</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text55 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1881)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #1976D2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #1976D2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1881">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text56() {
  return (
    <div className="bg-[#e3f2fd] h-[26px] relative rounded-[12px] shrink-0 w-[71px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">Pending</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon41 />
      <Text56 />
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container29 />
    </div>
  );
}

function Text57() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[72.844px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[73px] whitespace-pre-wrap">15/01/2025 16:30</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text57 />
    </div>
  );
}

function Text58() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[6.453px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">-</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text58 />
    </div>
  );
}

function Text59() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[29px] left-[70.75px] rounded-[12px] top-[26px] w-[33.25px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[17px] not-italic text-[#667085] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">0</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text59 />
    </div>
  );
}

function Text60() {
  return (
    <div className="absolute bg-[#d4edda] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[65.891px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">30 days</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text60 />
    </div>
  );
}

function Text61() {
  return (
    <div className="absolute h-[18px] left-[46.5px] top-[31.5px] w-[12px]" data-name="Text">
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[18px] left-0 text-[#9ca3af] text-[12px] top-0 whitespace-pre">—</p>
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Text61 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[324.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
    </div>
  );
}

function Code5() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_006</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code5 />
    </div>
  );
}

function Text62() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[211.031px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Export Ngân hàng - Active Only</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text62 />
    </div>
  );
}

function Text63() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text63 />
    </div>
  );
}

function Text64() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[105.938px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Đỗ Thị Manager</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text64 />
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text65() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon42 />
      <Text65 />
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container30 />
    </div>
  );
}

function Text66() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.578px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">14/01/2025 21:00</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text66 />
    </div>
  );
}

function Text67() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[110.313px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#155724] text-[14px] whitespace-pre">14/01/2025 21:01</p>
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text67 />
    </div>
  );
}

function Text68() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[70.92px] rounded-[12px] top-[26px] w-[32.922px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[16px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">3</p>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text68 />
    </div>
  );
}

function Text69() {
  return (
    <div className="absolute bg-[#fff3cd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[57.469px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">7 days</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text69 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button34() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon43 />
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button34 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[405.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
    </div>
  );
}

function Code6() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_007</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code6 />
    </div>
  );
}

function Text70() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[180.891px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[181px] whitespace-pre-wrap">Export Quy tắc thông báo - Failed Only</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text70 />
    </div>
  );
}

function Text71() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text71 />
    </div>
  );
}

function Text72() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[81.453px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[82px] whitespace-pre-wrap">Nguyễn Văn Admin</p>
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text72 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_1876)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #424242)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10 6L6 10" id="Vector_2" stroke="var(--stroke-0, #424242)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 6L10 10" id="Vector_3" stroke="var(--stroke-0, #424242)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_1876">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text73() {
  return (
    <div className="bg-[#e0e0e0] h-[26px] relative rounded-[12px] shrink-0 w-[81.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#424242] text-[12px] top-[4px] whitespace-pre">Cancelled</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon44 />
      <Text73 />
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container31 />
    </div>
  );
}

function Text74() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.172px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">13/01/2025 18:20</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text74 />
    </div>
  );
}

function Text75() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[6.453px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">-</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text75 />
    </div>
  );
}

function Text76() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[29px] left-[70.75px] rounded-[12px] top-[26px] w-[33.25px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[17px] not-italic text-[#667085] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">0</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text76 />
    </div>
  );
}

function Text77() {
  return (
    <div className="absolute bg-[#fff3cd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[57.469px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">7 days</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text77 />
    </div>
  );
}

function Text78() {
  return (
    <div className="absolute h-[18px] left-[46.5px] top-[31.5px] w-[12px]" data-name="Text">
      <p className="absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[18px] left-0 text-[#9ca3af] text-[12px] top-0 whitespace-pre">—</p>
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Text78 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[486.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
    </div>
  );
}

function Code7() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_008</p>
    </div>
  );
}

function TableCell70() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code7 />
    </div>
  );
}

function Text79() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[172.75px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[173px] whitespace-pre-wrap">Export Người dùng - Role: Supervisor</p>
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text79 />
    </div>
  );
}

function Text80() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text80 />
    </div>
  );
}

function Text81() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[99.328px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Vũ Thị Director</p>
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text81 />
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text82() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon45 />
      <Text82 />
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container32 />
    </div>
  );
}

function Text83() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[108.188px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">12/01/2025 17:15</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text83 />
    </div>
  );
}

function Text84() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[108.563px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#155724] text-[14px] whitespace-pre">12/01/2025 17:16</p>
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text84 />
    </div>
  );
}

function Text85() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[70.89px] rounded-[12px] top-[26px] w-[32.969px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[16px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">8</p>
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text85 />
    </div>
  );
}

function Text86() {
  return (
    <div className="absolute bg-[#d4edda] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[65.891px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">30 days</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text86 />
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon46 />
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button35 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[567.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell70 />
      <TableCell71 />
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
    </div>
  );
}

function Code8() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_009</p>
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code8 />
    </div>
  );
}

function Text87() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[219.109px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Export Cơ sở Đà Nẵng - Full Data</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text87 />
    </div>
  );
}

function Text88() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text88 />
    </div>
  );
}

function Text89() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[81.453px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[82px] whitespace-pre-wrap">Nguyễn Văn Admin</p>
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text89 />
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text90() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon47 />
      <Text90 />
    </div>
  );
}

function TableCell84() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container33 />
    </div>
  );
}

function Text91() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[70.219px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[71px] whitespace-pre-wrap">11/01/2025 22:20</p>
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text91 />
    </div>
  );
}

function Text92() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[112.344px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#155724] text-[14px] whitespace-pre">11/01/2025 22:22</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text92 />
    </div>
  );
}

function Text93() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[68.13px] rounded-[12px] top-[26px] w-[38.5px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[19px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">15</p>
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text93 />
    </div>
  );
}

function Text94() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[65.922px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">90 days</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text94 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon48 />
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button36 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[648.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell80 />
      <TableCell81 />
      <TableCell82 />
      <TableCell83 />
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <TableCell88 />
      <TableCell89 />
    </div>
  );
}

function Code9() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[31.5px] w-[65.891px]" data-name="Code">
      <p className="font-['Cousine:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXP_010</p>
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[-4px] top-0 w-[96.391px]" data-name="Table Cell">
      <Code9 />
    </div>
  );
}

function Text95() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[188.672px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[189px] whitespace-pre-wrap">Export Danh mục - Financial Only</p>
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[92.39px] top-0 w-[250px]" data-name="Table Cell">
      <Text95 />
    </div>
  );
}

function Text96() {
  return (
    <div className="absolute bg-[#e3f2fd] border border-[#90caf9] border-solid h-[28px] left-[14.5px] rounded-[6px] top-[26.5px] w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[10px] not-italic text-[#1976d2] text-[12px] top-[4px] whitespace-pre">REPORT_RUN</p>
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[342.39px] top-0 w-[149.344px]" data-name="Table Cell">
      <Text96 />
    </div>
  );
}

function Text97() {
  return (
    <div className="absolute h-[41px] left-[14.5px] top-[20.5px] w-[73.391px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[74px] whitespace-pre-wrap">Hoàng Văn Analyst</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[491.73px] top-0 w-[142.172px]" data-name="Table Cell">
      <Text97 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2303_2010)" id="Icon">
          <path d={svgPaths.p34e03900} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2303_2010">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text98() {
  return (
    <div className="bg-[#d4edda] h-[26px] relative rounded-[12px] shrink-0 w-[86.641px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#155724] text-[12px] top-[4px] whitespace-pre">Completed</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[26px] items-center left-[14.5px] top-[27.5px] w-[109.938px]" data-name="Container">
      <Icon49 />
      <Text98 />
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[633.91px] top-0 w-[138.938px]" data-name="Table Cell">
      <Container34 />
    </div>
  );
}

function Text99() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[112.141px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">10/01/2025 17:00</p>
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[772.84px] top-0 w-[141.219px]" data-name="Table Cell">
      <Text99 />
    </div>
  );
}

function Text100() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[14.5px] top-[32.5px] w-[109px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#155724] text-[14px] whitespace-pre">10/01/2025 17:01</p>
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[914.06px] top-0 w-[144.516px]" data-name="Table Cell">
      <Text100 />
    </div>
  );
}

function Text101() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[71.02px] rounded-[12px] top-[26px] w-[32.734px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[16.5px] not-italic text-[#1976d2] text-[14px] text-center top-[4px] translate-x-[-50%] whitespace-pre">2</p>
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1058.58px] top-0 w-[174.766px]" data-name="Table Cell">
      <Text101 />
    </div>
  );
}

function Text102() {
  return (
    <div className="absolute bg-[#fff3cd] h-[26px] left-[14.5px] rounded-[8px] top-[28px] w-[57.469px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[10px] not-italic text-[#856404] text-[12px] top-[4px] whitespace-pre">7 days</p>
    </div>
  );
}

function TableCell98() {
  return (
    <div className="absolute border-[rgba(208,213,221,0.3)] border-r border-solid h-[81px] left-[1233.34px] top-0 w-[173.563px]" data-name="Table Cell">
      <Text102 />
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #155724)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[34.5px] p-px rounded-[4px] size-[36px] top-[22.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Icon50 />
    </div>
  );
}

function TableCell99() {
  return (
    <div className="absolute h-[81px] left-[1406.91px] top-0 w-[104.5px]" data-name="Table Cell">
      <Button37 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b border-l-4 border-solid h-[81px] left-0 top-[729.5px] w-[1515.406px]" data-name="Table Row">
      <TableCell90 />
      <TableCell91 />
      <TableCell92 />
      <TableCell93 />
      <TableCell94 />
      <TableCell95 />
      <TableCell96 />
      <TableCell97 />
      <TableCell98 />
      <TableCell99 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[810.5px] left-[2px] top-[54px] w-[1515.406px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
      <TableRow10 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[865px] left-px top-px w-[1517.406px]" data-name="Table">
      <TableHeader />
      <TableBody />
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
    <div className="absolute content-stretch flex h-[16px] items-start left-[69.28px] top-px w-[14.078px]" data-name="Bold Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] whitespace-pre">10</p>
    </div>
  );
}

function BoldText2() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[172.73px] top-px w-[13.609px]" data-name="Bold Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] whitespace-pre">12</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[19.5px] left-[16px] top-[26px] w-[235.406px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0 whitespace-pre">Hiển thị</p>
      <BoldText />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[55.98px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">-</p>
      <BoldText1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[83.36px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">trong tổng số</p>
      <BoldText2 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[186.34px] not-italic text-[#667085] text-[13px] top-0 whitespace-pre">bản ghi</p>
    </div>
  );
}

function Icon51() {
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

function Button38() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.5px] min-h-px min-w-px opacity-50 relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon51 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[51.5px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%] whitespace-pre">Trước</p>
      </div>
    </div>
  );
}

function Button39() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 92, 182) 0%, rgb(0, 74, 148) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#005cb6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-px relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[13px] text-center text-white whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Button40() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-px relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] text-center whitespace-pre">2</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button39 />
        <Button40 />
      </div>
    </div>
  );
}

function Icon52() {
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

function Button41() {
  return (
    <div className="bg-white h-[37.5px] relative rounded-[8px] shrink-0 w-[69.609px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[25px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%] whitespace-pre">Sau</p>
        <Icon52 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[37.5px] items-center left-[267.41px] top-[17px] w-[243.938px]" data-name="Container">
      <Button38 />
      <Container36 />
      <Button41 />
    </div>
  );
}

function Pagination() {
  return (
    <div className="bg-white h-[70.5px] relative shrink-0 w-[527.344px]" data-name="Pagination">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container35 />
        <Container37 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[111.5px] items-center justify-center left-px pb-0 pt-px px-0 top-[866px] w-[1484px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <Pagination />
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-white h-[978.5px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Table />
        <Container38 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function ExportCenterTab() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1486px]" data-name="ExportCenterTab">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container12 />
        <Container23 />
        <Container39 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1488px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container6 />
        <ExportCenterTab />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[1594px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
        <Container40 />
      </div>
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col items-start relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <TopUtilityBar3 />
      <HorizontalNavBar />
      <AdminPage />
    </div>
  );
}