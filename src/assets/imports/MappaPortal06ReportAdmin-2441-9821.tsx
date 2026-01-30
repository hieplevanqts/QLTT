import svgPaths from "./svg-36585jbszh";
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
        <p className="absolute css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[92px] not-italic text-[#101828] text-[16px] text-center top-[-1px] translate-x-[-50%] w-[184px]">Xin chào, Nguyenvanan</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[67.375px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#667085] text-[12px] text-center">Quản lý cục</p>
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
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">Tìm cơ sở / hồ sơ / kế hoạch / đợt kiểm tra…</p>
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
    <div className="absolute h-[40px] left-[392.53px] top-[11.5px] w-[576px]" data-name="GlobalSearch">
      <TextInput />
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2300_1803)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2300_1803">
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
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[7px] not-italic text-[#101828] text-[14px] text-center top-0 translate-x-[-50%]">VI</p>
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
        <g clipPath="url(#clip0_2441_3324)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc878d80} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3324">
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
    <div className="absolute h-[36px] left-[1226.25px] top-[13.5px] w-[185.75px]" data-name="Container">
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[72.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Tổng quan</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[94.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Bản đồ điều hành</p>
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
        <g clipPath="url(#clip0_2300_1838)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2300_1838">
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[89px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">{`Cơ sở & Địa bàn`}</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[89px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Nguồn tin / Risk</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[105.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Kế hoạch tác nghiệp</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[108.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Nhiệm vụ hiện trường</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[83px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">Kho chứng cứ</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[82.5px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">{`Báo cáo & KPI`}</p>
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[62px] not-italic text-[#005cb6] text-[14px] text-center top-[8px] translate-x-[-50%]">Quản trị</p>
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
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[71px] not-italic text-[14px] text-center text-white top-[8px] translate-x-[-50%]">Tạo nhanh</p>
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
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0">Trang chủ</p>
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
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-0">Quản trị</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[1388px]" data-name="Container">
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
      <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[42px] left-0 not-italic text-[#101828] text-[28px] top-0">Quản trị</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0">Quản lý người dùng, phân quyền, danh mục, cấu hình và giám sát hệ thống</p>
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
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pae3c380} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="bg-[#005cb6] h-[46.5px] relative rounded-[6px] shrink-0 w-[325.031px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon18 />
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[177.5px] not-italic text-[15px] text-center text-white top-[10px] translate-x-[-50%]">{`Quản trị Người dùng & Phân quyền`}</p>
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
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[129.5px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%]">{`Danh mục & Cấu hình`}</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[24px] size-[20px] top-[13.25px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2341_563)" id="Icon">
          <path d={svgPaths.p363df2c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2341_563">
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
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[154px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%]">Audit – Giám sát – Tình trạng</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-white h-[72.5px] relative rounded-[8px] shrink-0 w-[1388px]" data-name="Container">
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
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-white h-[35.5px] relative rounded-[6px] shrink-0 w-[178.359px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[101.5px] not-italic text-[#005cb6] text-[13px] text-center top-[8px] translate-x-[-50%]">Quản lý người dùng</p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[95.703px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon22 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[60px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%]">Vai trò</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 2V10" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p34116ba0} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1fe50c00} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3c72c380} id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[145.625px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[85px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%]">Ma trận quyền</p>
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[167.578px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon24 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[96.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%]">{`Địa bàn & phạm vi`}</p>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2441_3374)" id="Icon">
          <path d={svgPaths.p241f1490} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p6b27c00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p312f7580} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3374">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button23() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[128.047px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon25 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[76px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%]">Đơn vị / Đội</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[59.5px] items-start left-px overflow-clip pb-0 pl-[12px] pr-0 pt-[12px] top-px w-[1386px]" data-name="Container">
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
      <Button23 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-[#f9fafb] h-[43px] left-0 rounded-[6px] top-0 w-[400px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[42px] pr-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">Tìm kiếm theo tên, email, SĐT...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon26() {
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

function Container7() {
  return (
    <div className="absolute h-[43px] left-0 top-0 w-[400px]" data-name="Container">
      <TextInput1 />
      <Icon26 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36bb6c80} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-[412px] rounded-[6px] top-0 w-[103.453px]" data-name="Button">
      <Icon27 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[63px] not-italic text-[#101828] text-[14px] text-center top-[10px] translate-x-[-50%]">Bộ lọc</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[43px] left-[20px] top-[20px] w-[879.359px]" data-name="Container">
      <Container7 />
      <Button24 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button25() {
  return (
    <div className="absolute bg-[#005cb6] h-[41px] left-[130.42px] rounded-[6px] top-px w-[177.766px]" data-name="Button">
      <Icon28 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[101px] not-italic text-[14px] text-center text-white top-[10px] translate-x-[-50%]">Thêm người dùng</p>
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12V8" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 10L8 12L10 10" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="absolute bg-[#005cb6] h-[41px] left-[320.19px] rounded-[6px] top-px w-[130.453px]" data-name="Button">
      <Icon29 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[77.5px] not-italic text-[14px] text-center text-white top-[10px] translate-x-[-50%]">Xuất Excel</p>
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19987d80} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 2V5.33333H10.6667" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2a3e9c80} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 10.6667H2V14" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-0 rounded-[6px] top-0 w-[118.422px]" data-name="Button">
      <Icon30 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[70.5px] not-italic text-[#101828] text-[14px] text-center top-[10px] translate-x-[-50%]">Làm mới</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[43px] left-[915.36px] top-[20px] w-[450.641px]" data-name="Container">
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[84px] relative shrink-0 w-[1386px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-0 top-0 w-[57.547px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[57.55px] top-0 w-[438.453px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Thông tin người dùng</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[496px] top-0 w-[200px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Vai trò</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[696px] top-0 w-[180px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Bộ phận</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[876px] top-0 w-[150px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Trạng thái</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[1026px] top-0 w-[180px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Đăng nhập cuối</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[1206px] top-0 w-[180px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[89.55px] not-italic text-[#101828] text-[13px] text-center top-[12px] translate-x-[-50%]">Thao tác</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[44.5px] left-0 top-0 w-[1386px]" data-name="Table Row">
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
    <div className="absolute bg-[#f2f4f7] h-[44.5px] left-0 top-0 w-[1386px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[79.5px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.42px] not-italic text-[#101828] text-[14px] text-center top-[29.5px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">nguyen văn a</p>
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon31 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">ghfgh@vhv.vn</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[54px] relative shrink-0 w-[95.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[13px] w-[406.453px]" data-name="Container">
      <Container11 />
      <Container14 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[79.5px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container15 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[27px] w-[168px]" data-name="Text">
      <Icon32 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý tài chính</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[79.5px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31.5px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[79.5px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[27px] w-[95.609px]" data-name="Text">
      <Icon33 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[79.5px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[79.5px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[24px] w-[148px]" data-name="Container">
      <Button28 />
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[79.5px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container16 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79.5px] left-0 top-0 w-[1386px]" data-name="Table Row">
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
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">2</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">C</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">cửa hàng</p>
    </div>
  );
}

function Icon38() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon38 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">cuahang@vhv.vn</p>
    </div>
  );
}

function Icon39() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon39 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0989898902</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[87px] relative shrink-0 w-[114.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container18 />
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container17 />
      <Container21 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container22 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon40 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cửa hàng</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon41 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button32() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon42 />
      </div>
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon43 />
      </div>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button34() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon44 />
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button35() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon45 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button32 />
      <Button33 />
      <Button34 />
      <Button35 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container23 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[79.5px] w-[1386px]" data-name="Table Row">
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
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.94px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">K</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">khách hàng</p>
    </div>
  );
}

function Icon46() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon46 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin666@vhv.vn</p>
    </div>
  );
}

function Icon47() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon47 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0976594507</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[87px] relative shrink-0 w-[123.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container25 />
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container24 />
      <Container28 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container29 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon48 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người dùng</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon49 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Icon50() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon50 />
      </div>
    </div>
  );
}

function Icon51() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon51 />
      </div>
    </div>
  );
}

function Icon52() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button38() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon52 />
      </div>
    </div>
  );
}

function Icon53() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button39() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon53 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container30 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[191.5px] w-[1386px]" data-name="Table Row">
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

function TableCell21() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.75px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">4</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">C</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">cục trưởng</p>
    </div>
  );
}

function Icon54() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon54 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin777@vhv.vn</p>
    </div>
  );
}

function Icon55() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon55 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0123456789</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[87px] relative shrink-0 w-[121.641px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container32 />
        <Container33 />
        <Container34 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container31 />
      <Container35 />
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container36 />
    </div>
  );
}

function Icon56() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon56 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ quản lý dữ liệu</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[134.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">Đội quản lý trường 02</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[18px] relative shrink-0 w-[148px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[63px]">02 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[41.5px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[35.25px] w-[148px]" data-name="Container">
      <Text17 />
      <Container37 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Container38 />
    </div>
  );
}

function Icon57() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon57 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text19 />
    </div>
  );
}

function Icon58() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon58 />
      </div>
    </div>
  );
}

function Icon59() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button41() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon59 />
      </div>
    </div>
  );
}

function Icon60() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon60 />
      </div>
    </div>
  );
}

function Icon61() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button43() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon61 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button40 />
      <Button41 />
      <Button42 />
      <Button43 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container39 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[303.5px] w-[1386px]" data-name="Table Row">
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.11px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">5</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 888</p>
    </div>
  );
}

function Icon62() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon62 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin888@vhv.vn</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[54px] relative shrink-0 w-[123.313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container41 />
        <Container42 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container40 />
      <Container43 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container44 />
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text20 />
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text21 />
    </div>
  );
}

function Icon63() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon63 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text23 />
    </div>
  );
}

function Icon64() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button44() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon64 />
      </div>
    </div>
  );
}

function Icon65() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button45() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon65 />
      </div>
    </div>
  );
}

function Icon66() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button46() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon66 />
      </div>
    </div>
  );
}

function Icon67() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button47() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon67 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button44 />
      <Button45 />
      <Button46 />
      <Button47 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container45 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[415.5px] w-[1386px]" data-name="Table Row">
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.92px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">6</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 999</p>
    </div>
  );
}

function Icon68() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon68 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin999@vhv.vn</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[54px] relative shrink-0 w-[123.375px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container46 />
      <Container49 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container50 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text25 />
    </div>
  );
}

function Icon69() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon69 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text27 />
    </div>
  );
}

function Icon70() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button48() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon70 />
      </div>
    </div>
  );
}

function Icon71() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button49() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon71 />
      </div>
    </div>
  );
}

function Icon72() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button50() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon72 />
      </div>
    </div>
  );
}

function Icon73() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button51() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon73 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button48 />
      <Button49 />
      <Button50 />
      <Button51 />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container51 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[494.5px] w-[1386px]" data-name="Table Row">
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.8px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">7</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon74() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon74 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">lamdd@vhv.vn</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[54px] relative shrink-0 w-[132.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container53 />
        <Container54 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container52 />
      <Container55 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container56 />
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function Icon75() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon75 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text31 />
    </div>
  );
}

function Icon76() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button52() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon76 />
      </div>
    </div>
  );
}

function Icon77() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button53() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon77 />
      </div>
    </div>
  );
}

function Icon78() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button54() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon78 />
      </div>
    </div>
  );
}

function Icon79() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button55() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon79 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button52 />
      <Button53 />
      <Button54 />
      <Button55 />
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container57 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[573.5px] w-[1386px]" data-name="Table Row">
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.94px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">8</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon80() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon80 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">phuongdd@vhv.vn</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[54px] relative shrink-0 w-[132.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container59 />
        <Container60 />
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container58 />
      <Container61 />
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container62 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text32 />
    </div>
  );
}

function Text33() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text33 />
    </div>
  );
}

function Icon81() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text34() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon81 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text34 />
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text35 />
    </div>
  );
}

function Icon82() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button56() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon82 />
      </div>
    </div>
  );
}

function Icon83() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button57() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon83 />
      </div>
    </div>
  );
}

function Icon84() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button58() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon84 />
      </div>
    </div>
  );
}

function Icon85() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button59() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon85 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button56 />
      <Button57 />
      <Button58 />
      <Button59 />
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container63 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[652.5px] w-[1386px]" data-name="Table Row">
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.92px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">9</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon86() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon86 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin3555511@vhv.vn</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[54px] relative shrink-0 w-[150.578px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container65 />
        <Container66 />
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container64 />
      <Container67 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container68 />
    </div>
  );
}

function Text36() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text36 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text37 />
    </div>
  );
}

function Icon87() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon87 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text38 />
    </div>
  );
}

function Text39() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text39 />
    </div>
  );
}

function Icon88() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button60() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon88 />
      </div>
    </div>
  );
}

function Icon89() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button61() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon89 />
      </div>
    </div>
  );
}

function Icon90() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button62() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon90 />
      </div>
    </div>
  );
}

function Icon91() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button63() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon91 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button60 />
      <Button61 />
      <Button62 />
      <Button63 />
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container69 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[731.5px] w-[1386px]" data-name="Table Row">
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.5px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">10</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon92() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon92 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin32111@vhv.vn</p>
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[54px] relative shrink-0 w-[132.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container71 />
        <Container72 />
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container70 />
      <Container73 />
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container74 />
    </div>
  );
}

function Text40() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text40 />
    </div>
  );
}

function Text41() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text41 />
    </div>
  );
}

function Icon93() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text42() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon93 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text42 />
    </div>
  );
}

function Text43() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text43 />
    </div>
  );
}

function Icon94() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button64() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon94 />
      </div>
    </div>
  );
}

function Icon95() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button65() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon95 />
      </div>
    </div>
  );
}

function Icon96() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button66() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon96 />
      </div>
    </div>
  );
}

function Icon97() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button67() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon97 />
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button64 />
      <Button65 />
      <Button66 />
      <Button67 />
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container75 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[810.5px] w-[1386px]" data-name="Table Row">
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

function TableCell70() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.08px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">11</p>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322</p>
    </div>
  );
}

function Icon98() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon98 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin32@vhv.vn</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[54px] relative shrink-0 w-[114.719px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container77 />
        <Container78 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container76 />
      <Container79 />
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container80 />
    </div>
  );
}

function Text44() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text44 />
    </div>
  );
}

function Text45() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text45 />
    </div>
  );
}

function Icon99() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text46() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon99 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text46 />
    </div>
  );
}

function Text47() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text47 />
    </div>
  );
}

function Icon100() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button68() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon100 />
      </div>
    </div>
  );
}

function Icon101() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button69() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon101 />
      </div>
    </div>
  );
}

function Icon102() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button70() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon102 />
      </div>
    </div>
  );
}

function Icon103() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button71() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon103 />
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button68 />
      <Button69 />
      <Button70 />
      <Button71 />
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container81 />
    </div>
  );
}

function TableRow11() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[889.5px] w-[1386px]" data-name="Table Row">
      <TableCell70 />
      <TableCell71 />
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.16px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">12</p>
    </div>
  );
}

function Container82() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Đ</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Đặng Đình Phương</p>
    </div>
  );
}

function Icon104() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon104 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin3@vhv.vn</p>
    </div>
  );
}

function Icon105() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container85() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon105 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0976594507</p>
    </div>
  );
}

function Container86() {
  return (
    <div className="h-[87px] relative shrink-0 w-[124.906px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container83 />
        <Container84 />
        <Container85 />
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container82 />
      <Container86 />
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container87 />
    </div>
  );
}

function Icon106() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text48() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon106 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người dùng</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text48 />
    </div>
  );
}

function Text49() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[114.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[115px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[18px] relative shrink-0 w-[148px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[60px]">01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[24.5px] w-[148px]" data-name="Container">
      <Text49 />
      <Container88 />
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Container89 />
    </div>
  );
}

function Icon107() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text50() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon107 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text50 />
    </div>
  );
}

function Text51() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text51 />
    </div>
  );
}

function Icon108() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button72() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon108 />
      </div>
    </div>
  );
}

function Icon109() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button73() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon109 />
      </div>
    </div>
  );
}

function Icon110() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button74() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon110 />
      </div>
    </div>
  );
}

function Icon111() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button75() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon111 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button72 />
      <Button73 />
      <Button74 />
      <Button75 />
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container90 />
    </div>
  );
}

function TableRow12() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[968.5px] w-[1386px]" data-name="Table Row">
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
      <TableCell80 />
      <TableCell81 />
      <TableCell82 />
      <TableCell83 />
    </div>
  );
}

function TableCell84() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.59px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">13</p>
    </div>
  );
}

function Container91() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Nguyễn Văn Bình</p>
    </div>
  );
}

function Icon112() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container93() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon112 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin2@vhv.vn</p>
    </div>
  );
}

function Icon113() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container94() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon113 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">098989898</p>
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[87px] relative shrink-0 w-[115.719px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container92 />
        <Container93 />
        <Container94 />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container91 />
      <Container95 />
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container96 />
    </div>
  );
}

function Icon114() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon114 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text52 />
    </div>
  );
}

function Text53() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[114.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[115px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[18px] relative shrink-0 w-[148px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[60px]">01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[24.5px] w-[148px]" data-name="Container">
      <Text53 />
      <Container97 />
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Container98 />
    </div>
  );
}

function Icon115() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text54() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon115 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text54 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text55 />
    </div>
  );
}

function Icon116() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button76() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon116 />
      </div>
    </div>
  );
}

function Icon117() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button77() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon117 />
      </div>
    </div>
  );
}

function Icon118() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button78() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon118 />
      </div>
    </div>
  );
}

function Icon119() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button79() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon119 />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button76 />
      <Button77 />
      <Button78 />
      <Button79 />
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container99 />
    </div>
  );
}

function TableRow13() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[1080.5px] w-[1386px]" data-name="Table Row">
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <TableCell88 />
      <TableCell89 />
      <TableCell90 />
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.39px] not-italic text-[#101828] text-[14px] text-center top-[20px] translate-x-[-50%]">14</p>
    </div>
  );
}

function Container100() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">U</p>
      </div>
    </div>
  );
}

function Icon120() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container101() {
  return (
    <div className="h-[33px] relative shrink-0 w-[141.047px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon120 />
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">hieplv.37@gmail.com</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[36px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container100 />
      <Container101 />
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute h-[61px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container102 />
    </div>
  );
}

function Text56() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[22px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute h-[61px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text56 />
    </div>
  );
}

function Text57() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[22px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute h-[61px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text57 />
    </div>
  );
}

function Icon121() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text58() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[17.5px] w-[95.609px]" data-name="Text">
      <Icon121 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute h-[61px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text58 />
    </div>
  );
}

function Text59() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[22px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute h-[61px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text59 />
    </div>
  );
}

function Icon122() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button80() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon122 />
      </div>
    </div>
  );
}

function Icon123() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button81() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon123 />
      </div>
    </div>
  );
}

function Icon124() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button82() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon124 />
      </div>
    </div>
  );
}

function Icon125() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button83() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon125 />
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[14.5px] w-[148px]" data-name="Container">
      <Button80 />
      <Button81 />
      <Button82 />
      <Button83 />
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute h-[61px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container103 />
    </div>
  );
}

function TableRow14() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[61px] left-0 top-[1192.5px] w-[1386px]" data-name="Table Row">
      <TableCell91 />
      <TableCell92 />
      <TableCell93 />
      <TableCell94 />
      <TableCell95 />
      <TableCell96 />
      <TableCell97 />
    </div>
  );
}

function TableCell98() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.77px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">15</p>
    </div>
  );
}

function Container104() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">S</p>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Shop 01</p>
    </div>
  );
}

function Icon126() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon126 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">shop01@gmail.com</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[54px] relative shrink-0 w-[128.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container105 />
        <Container106 />
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container104 />
      <Container107 />
    </div>
  );
}

function TableCell99() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container108 />
    </div>
  );
}

function Text60() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell100() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text60 />
    </div>
  );
}

function Text61() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell101() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text61 />
    </div>
  );
}

function Icon127() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text62() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon127 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell102() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text62 />
    </div>
  );
}

function Text63() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell103() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text63 />
    </div>
  );
}

function Icon128() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button84() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon128 />
      </div>
    </div>
  );
}

function Icon129() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button85() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon129 />
      </div>
    </div>
  );
}

function Icon130() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button86() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon130 />
      </div>
    </div>
  );
}

function Icon131() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button87() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon131 />
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button84 />
      <Button85 />
      <Button86 />
      <Button87 />
    </div>
  );
}

function TableCell104() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container109 />
    </div>
  );
}

function TableRow15() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1253.5px] w-[1386px]" data-name="Table Row">
      <TableCell98 />
      <TableCell99 />
      <TableCell100 />
      <TableCell101 />
      <TableCell102 />
      <TableCell103 />
      <TableCell104 />
    </div>
  );
}

function TableCell105() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.58px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">16</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Đ</p>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Đặng Đình Phương</p>
    </div>
  );
}

function Icon132() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container112() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon132 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">phuongdd@vhv.com</p>
    </div>
  );
}

function Icon133() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container113() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon133 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0976594507</p>
    </div>
  );
}

function Container114() {
  return (
    <div className="h-[87px] relative shrink-0 w-[137px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container111 />
        <Container112 />
        <Container113 />
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container110 />
      <Container114 />
    </div>
  );
}

function TableCell106() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container115 />
    </div>
  );
}

function Icon134() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text64() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon134 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
    </div>
  );
}

function TableCell107() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text64 />
    </div>
  );
}

function Text65() {
  return (
    <div className="h-[16px] relative shrink-0 w-[137.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">Cục quản lý thị trường</p>
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="h-[18px] relative shrink-0 w-[148px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[62px]">QT • Cấp 1</p>
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[41.5px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[35.25px] w-[148px]" data-name="Container">
      <Text65 />
      <Container116 />
    </div>
  );
}

function TableCell108() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Container117 />
    </div>
  );
}

function Icon135() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text66() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon135 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell109() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text66 />
    </div>
  );
}

function Text67() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell110() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text67 />
    </div>
  );
}

function Icon136() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button88() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon136 />
      </div>
    </div>
  );
}

function Icon137() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button89() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon137 />
      </div>
    </div>
  );
}

function Icon138() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button90() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon138 />
      </div>
    </div>
  );
}

function Icon139() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button91() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon139 />
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button88 />
      <Button89 />
      <Button90 />
      <Button91 />
    </div>
  );
}

function TableCell111() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container118 />
    </div>
  );
}

function TableRow16() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[1332.5px] w-[1386px]" data-name="Table Row">
      <TableCell105 />
      <TableCell106 />
      <TableCell107 />
      <TableCell108 />
      <TableCell109 />
      <TableCell110 />
      <TableCell111 />
    </div>
  );
}

function TableCell112() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.45px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">17</p>
    </div>
  );
}

function Container119() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">L</p>
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Lê Văn Chung</p>
    </div>
  );
}

function Icon140() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container121() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon140 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">le.van.c@mappa.gov.vn</p>
    </div>
  );
}

function Icon141() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2441_3379)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3379">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon141 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">098787878787</p>
    </div>
  );
}

function Container123() {
  return (
    <div className="h-[87px] relative shrink-0 w-[158.516px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container120 />
        <Container121 />
        <Container122 />
      </div>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container119 />
      <Container123 />
    </div>
  );
}

function TableCell113() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container124 />
    </div>
  );
}

function Icon142() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2bec7a00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text68() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[168px]" data-name="Text">
      <Icon142 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
    </div>
  );
}

function TableCell114() {
  return (
    <div className="absolute h-[112px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text68 />
    </div>
  );
}

function Text69() {
  return (
    <div className="h-[16px] relative shrink-0 w-[134.328px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">Đội quản lý trường 02</p>
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="h-[18px] relative shrink-0 w-[148px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[63px]">02 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container126() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[41.5px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[35.25px] w-[148px]" data-name="Container">
      <Text69 />
      <Container125 />
    </div>
  );
}

function TableCell115() {
  return (
    <div className="absolute h-[112px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Container126 />
    </div>
  );
}

function Icon143() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text70() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon143 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell116() {
  return (
    <div className="absolute h-[112px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text70 />
    </div>
  );
}

function Text71() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell117() {
  return (
    <div className="absolute h-[112px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text71 />
    </div>
  );
}

function Icon144() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button92() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon144 />
      </div>
    </div>
  );
}

function Icon145() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button93() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon145 />
      </div>
    </div>
  );
}

function Icon146() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button94() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon146 />
      </div>
    </div>
  );
}

function Icon147() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button95() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon147 />
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[148px]" data-name="Container">
      <Button92 />
      <Button93 />
      <Button94 />
      <Button95 />
    </div>
  );
}

function TableCell118() {
  return (
    <div className="absolute h-[112px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container127 />
    </div>
  );
}

function TableRow17() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[1444.5px] w-[1386px]" data-name="Table Row">
      <TableCell112 />
      <TableCell113 />
      <TableCell114 />
      <TableCell115 />
      <TableCell116 />
      <TableCell117 />
      <TableCell118 />
    </div>
  );
}

function TableCell119() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.59px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">18</p>
    </div>
  );
}

function Container128() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Nguyễn Văn A 2</p>
    </div>
  );
}

function Icon148() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container130() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon148 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">nguyen.van.a@mappa.gov.vn</p>
    </div>
  );
}

function Container131() {
  return (
    <div className="h-[54px] relative shrink-0 w-[195.984px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container129 />
        <Container130 />
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container128 />
      <Container131 />
    </div>
  );
}

function TableCell120() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container132 />
    </div>
  );
}

function Text72() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell121() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text72 />
    </div>
  );
}

function Text73() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell122() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text73 />
    </div>
  );
}

function Icon149() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text74() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon149 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell123() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text74 />
    </div>
  );
}

function Text75() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell124() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text75 />
    </div>
  );
}

function Icon150() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button96() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon150 />
      </div>
    </div>
  );
}

function Icon151() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button97() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon151 />
      </div>
    </div>
  );
}

function Icon152() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button98() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon152 />
      </div>
    </div>
  );
}

function Icon153() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button99() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon153 />
      </div>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button96 />
      <Button97 />
      <Button98 />
      <Button99 />
    </div>
  );
}

function TableCell125() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container133 />
    </div>
  );
}

function TableRow18() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1556.5px] w-[1386px]" data-name="Table Row">
      <TableCell119 />
      <TableCell120 />
      <TableCell121 />
      <TableCell122 />
      <TableCell123 />
      <TableCell124 />
      <TableCell125 />
    </div>
  );
}

function TableCell126() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.58px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">19</p>
    </div>
  );
}

function Container134() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container135() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Nhân Viên Nhập Liệu</p>
    </div>
  );
}

function Icon154() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container136() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon154 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">dataentry@mappa.gov.vn</p>
    </div>
  );
}

function Container137() {
  return (
    <div className="h-[54px] relative shrink-0 w-[170.281px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container135 />
        <Container136 />
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container134 />
      <Container137 />
    </div>
  );
}

function TableCell127() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container138 />
    </div>
  );
}

function Text76() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell128() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text76 />
    </div>
  );
}

function Text77() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell129() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text77 />
    </div>
  );
}

function Icon155() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text78() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon155 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell130() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text78 />
    </div>
  );
}

function Text79() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell131() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text79 />
    </div>
  );
}

function Icon156() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button100() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon156 />
      </div>
    </div>
  );
}

function Icon157() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button101() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon157 />
      </div>
    </div>
  );
}

function Icon158() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button102() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon158 />
      </div>
    </div>
  );
}

function Icon159() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button103() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon159 />
      </div>
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button100 />
      <Button101 />
      <Button102 />
      <Button103 />
    </div>
  );
}

function TableCell132() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container139 />
    </div>
  );
}

function TableRow19() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1635.5px] w-[1386px]" data-name="Table Row">
      <TableCell126 />
      <TableCell127 />
      <TableCell128 />
      <TableCell129 />
      <TableCell130 />
      <TableCell131 />
      <TableCell132 />
    </div>
  );
}

function TableCell133() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.08px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">20</p>
    </div>
  );
}

function Container140() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">P</p>
      </div>
    </div>
  );
}

function Container141() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Phạm Thị D</p>
    </div>
  );
}

function Icon160() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pcd45380} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p9deeb00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Container142() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon160 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">pham.thi.d@mappa.gov.vn</p>
    </div>
  );
}

function Container143() {
  return (
    <div className="h-[54px] relative shrink-0 w-[176.828px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container141 />
        <Container142 />
      </div>
    </div>
  );
}

function Container144() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[406.453px]" data-name="Container">
      <Container140 />
      <Container143 />
    </div>
  );
}

function TableCell134() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[438.453px]" data-name="Table Cell">
      <Container144 />
    </div>
  );
}

function Text80() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[6.453px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">-</p>
    </div>
  );
}

function TableCell135() {
  return (
    <div className="absolute h-[79px] left-[496px] top-0 w-[200px]" data-name="Table Cell">
      <Text80 />
    </div>
  );
}

function Text81() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell136() {
  return (
    <div className="absolute h-[79px] left-[696px] top-0 w-[180px]" data-name="Table Cell">
      <Text81 />
    </div>
  );
}

function Icon161() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text82() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon161 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[26px] not-italic text-[#059669] text-[12px] top-[4px]">Hoạt động</p>
    </div>
  );
}

function TableCell137() {
  return (
    <div className="absolute h-[79px] left-[876px] top-0 w-[150px]" data-name="Table Cell">
      <Text82 />
    </div>
  );
}

function Text83() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[109.203px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa đăng nhập</p>
    </div>
  );
}

function TableCell138() {
  return (
    <div className="absolute h-[79px] left-[1026px] top-0 w-[180px]" data-name="Table Cell">
      <Text83 />
    </div>
  );
}

function Icon162() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button104() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon162 />
      </div>
    </div>
  );
}

function Icon163() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p85cdd00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button105() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon163 />
      </div>
    </div>
  );
}

function Icon164() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button106() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon164 />
      </div>
    </div>
  );
}

function Icon165() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12949080} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 2V5.33333H5.33333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button107() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon165 />
      </div>
    </div>
  );
}

function Container145() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[148px]" data-name="Container">
      <Button104 />
      <Button105 />
      <Button106 />
      <Button107 />
    </div>
  );
}

function TableCell139() {
  return (
    <div className="absolute h-[79px] left-[1206px] top-0 w-[180px]" data-name="Table Cell">
      <Container145 />
    </div>
  );
}

function TableRow20() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1714.5px] w-[1386px]" data-name="Table Row">
      <TableCell133 />
      <TableCell134 />
      <TableCell135 />
      <TableCell136 />
      <TableCell137 />
      <TableCell138 />
      <TableCell139 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[1793.5px] left-0 top-[44.5px] w-[1386px]" data-name="Table Body">
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
      <TableRow11 />
      <TableRow12 />
      <TableRow13 />
      <TableRow14 />
      <TableRow15 />
      <TableRow16 />
      <TableRow17 />
      <TableRow18 />
      <TableRow19 />
      <TableRow20 />
    </div>
  );
}

function Table() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1386px]" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <TableHeader />
        <TableBody />
      </div>
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[54.36px] top-[2px] w-[6.047px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">1</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[93.3px] top-[2px] w-[18.266px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">20</p>
    </div>
  );
}

function BoldText2() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[207.81px] top-[2px] w-[18.078px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">24</p>
    </div>
  );
}

function Container146() {
  return (
    <div className="absolute h-[21px] left-[20px] top-[41.75px] w-[304.75px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0">Hiển thị</p>
      <BoldText />
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[60.41px] not-italic text-[#667085] text-[14px] top-0 w-[33px]">đến</p>
      <BoldText1 />
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[111.56px] not-italic text-[#667085] text-[14px] top-0 w-[97px]">trong tổng số</p>
      <BoldText2 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[225.89px] not-italic text-[#667085] text-[14px] top-0">người dùng</p>
    </div>
  );
}

function BoldText3() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[50.48px] top-px w-[5.5px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">1</p>
    </div>
  );
}

function BoldText4() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[69.28px] top-px w-[16.688px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">20</p>
    </div>
  );
}

function BoldText5() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[175.34px] top-px w-[16.563px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">24</p>
    </div>
  );
}

function Container147() {
  return (
    <div className="absolute h-[19.5px] left-[16px] top-[25px] w-[240.969px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0">Hiển thị</p>
      <BoldText3 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[55.98px] not-italic text-[#667085] text-[13px] top-0">-</p>
      <BoldText4 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[85.97px] not-italic text-[#667085] text-[13px] top-0">trong tổng số</p>
      <BoldText5 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[191.91px] not-italic text-[#667085] text-[13px] top-0">bản ghi</p>
    </div>
  );
}

function Icon166() {
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

function Button108() {
  return (
    <div className="bg-white flex-[1_0_0] h-[37.5px] min-h-px min-w-px opacity-50 relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon166 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[51.5px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%]">Trước</p>
      </div>
    </div>
  );
}

function Button109() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button" style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 92, 182) 0%, rgb(0, 74, 148) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#005cb6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-px relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[13px] text-center text-white">1</p>
      </div>
    </div>
  );
}

function Button110() {
  return (
    <div className="bg-white flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] py-px relative size-full">
          <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px] text-center">2</p>
        </div>
      </div>
    </div>
  );
}

function Container148() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button109 />
        <Button110 />
      </div>
    </div>
  );
}

function Icon167() {
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

function Button111() {
  return (
    <div className="bg-white h-[37.5px] relative rounded-[8px] shrink-0 w-[69.609px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[25px] not-italic text-[#101828] text-[13px] text-center top-[9px] translate-x-[-50%]">Sau</p>
        <Icon167 />
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[37.5px] items-center left-[272.97px] top-[16px] w-[243.938px]" data-name="Container">
      <Button108 />
      <Container148 />
      <Button111 />
    </div>
  );
}

function Pagination() {
  return (
    <div className="absolute bg-white border-[#d0d5dd] border-solid border-t h-[70.5px] left-[833.09px] top-[17px] w-[532.906px]" data-name="Pagination">
      <Container147 />
      <Container149 />
    </div>
  );
}

function Container150() {
  return (
    <div className="bg-white h-[103.5px] relative shrink-0 w-[1386px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container146 />
        <Pagination />
      </div>
    </div>
  );
}

function UserListTabNew() {
  return (
    <div className="absolute content-stretch flex flex-col h-[2026px] items-start left-px top-[60.5px] w-[1386px]" data-name="UserListTabNew">
      <Container10 />
      <Table />
      <Container150 />
    </div>
  );
}

function Icon168() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="flex-[1_0_0] h-[27px] min-h-px min-w-px relative" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-px">Chỉnh sửa người dùng</p>
      </div>
    </div>
  );
}

function Icon169() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button112() {
  return (
    <div className="relative rounded-[6px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon169 />
      </div>
    </div>
  );
}

function UserModal() {
  return (
    <div className="absolute bg-white content-stretch flex gap-[12px] h-[81px] items-center left-[414px] pb-px pt-0 px-[24px] rounded-tl-[8px] rounded-tr-[8px] top-[92.75px] w-[560px]" data-name="UserModal">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-b border-solid inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px]" />
      <Icon168 />
      <Heading1 />
      <Button112 />
    </div>
  );
}

function Container151() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1388px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container6 />
        <UserListTabNew />
        <UserModal />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[2356.5px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
        <Container151 />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[2476.5px] items-start left-0 top-0 w-[1436px]" data-name="MainLayout">
      <TopUtilityBar3 />
      <HorizontalNavBar />
      <AdminPage />
    </div>
  );
}

function Text84() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[43.63px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[512px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Email</p>
      <Text84 />
    </div>
  );
}

function Small() {
  return (
    <div className="absolute h-[18px] left-0 top-[84px] w-[512px]" data-name="Small">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#667085] text-[12px] top-0">Email không thể thay đổi</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[47px] left-0 opacity-60 rounded-[6px] top-0 w-[512px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[12px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">ghfgh@vhv.vn</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon170() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container152() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[512px]" data-name="Container">
      <EmailInput />
      <Icon170 />
    </div>
  );
}

function Container153() {
  return (
    <div className="h-[102px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Label />
        <Small />
        <Container152 />
      </div>
    </div>
  );
}

function Text85() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[71.27px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[512px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Họ và tên</p>
      <Text85 />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="absolute bg-white h-[47px] left-0 rounded-[6px] top-0 w-[512px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[12px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">nguyen văn a</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon171() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container154() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[512px]" data-name="Container">
      <TextInput2 />
      <Icon171 />
    </div>
  );
}

function Container155() {
  return (
    <div className="h-[76px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Label1 />
        <Container154 />
      </div>
    </div>
  );
}

function Container156() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">🤖 Tự động tạo</p>
    </div>
  );
}

function Container157() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#667085] text-[12px] top-0">Tên đăng nhập được tạo tự động từ Phòng ban + Họ tên</p>
    </div>
  );
}

function Container158() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[41px] items-start left-[68px] top-[12px] w-[432px]" data-name="Container">
      <Container156 />
      <Container157 />
    </div>
  );
}

function Container159() {
  return <div className="bg-white h-[20px] rounded-[9999px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] shrink-0 w-full" data-name="Container" />;
}

function Container160() {
  return (
    <div className="absolute bg-[#d0d5dd] content-stretch flex flex-col h-[24px] items-start left-[12px] pb-0 pl-[2px] pr-[22px] pt-[2px] rounded-[9999px] top-[20.5px] w-[44px]" data-name="Container">
      <Container159 />
    </div>
  );
}

function Container161() {
  return (
    <div className="bg-[#f2f4f7] h-[65px] relative rounded-[6px] shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container158 />
        <Container160 />
      </div>
    </div>
  );
}

function Text86() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[107.05px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[512px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Tên đăng nhập</p>
      <Text86 />
    </div>
  );
}

function Small1() {
  return (
    <div className="absolute h-[18px] left-0 top-[84px] w-[512px]" data-name="Small">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#005cb6] text-[12px] top-0">✅ Tên đăng nhập được tạo tự động</p>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[47px] left-0 opacity-60 rounded-[6px] top-0 w-[512px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[12px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">ANV</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon172() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container162() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[512px]" data-name="Container">
      <TextInput3 />
      <Icon172 />
    </div>
  );
}

function Container163() {
  return (
    <div className="h-[102px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Label2 />
        <Small1 />
        <Container162 />
      </div>
    </div>
  );
}

function Text87() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[94.67px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label3() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[512px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Số điện thoại</p>
      <Text87 />
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="absolute bg-white h-[47px] left-0 rounded-[6px] top-0 w-[512px]" data-name="Phone Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[12px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">0912345678</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon173() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[15.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2441_3342)" id="Icon">
          <path d={svgPaths.p2a44c680} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2441_3342">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container164() {
  return (
    <div className="absolute h-[47px] left-0 top-[29px] w-[512px]" data-name="Container">
      <PhoneInput />
      <Icon173 />
    </div>
  );
}

function Container165() {
  return (
    <div className="h-[76px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Label3 />
        <Container164 />
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[512px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Phòng ban</p>
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">-- Chọn phòng ban (không bắt buộc) --</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Cục quản lý thị trường (QT)</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ Chi cục quản lý thị trường Hà Nội (01)</p>
    </div>
  );
}

function Option3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ Đội quản lý trường 02 (02)</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ Đội quản lý trường 01 (01)</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[512px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pl-[-462px] pr-[974px] pt-[-692.75px] relative size-full">
        <Option />
        <Option1 />
        <Option2 />
        <Option3 />
        <Option4 />
      </div>
    </div>
  );
}

function Small2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[512px]" data-name="Small">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#667085] text-[12px] top-0">Phòng ban không bắt buộc. Nếu chọn, tên đăng nhập sẽ bao gồm mã phòng ban.</p>
      </div>
    </div>
  );
}

function Container166() {
  return (
    <div className="h-[100px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label4 />
        <Dropdown />
        <Small2 />
      </div>
    </div>
  );
}

function Text88() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[74.95px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label5() {
  return (
    <div className="h-[21px] relative shrink-0 w-[512px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Trạng thái</p>
        <Text88 />
      </div>
    </div>
  );
}

function Option5() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Hoạt động</p>
    </div>
  );
}

function Option6() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Đã khóa</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[512px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pl-[-462px] pr-[974px] pt-[-808.75px] relative size-full">
        <Option5 />
        <Option6 />
      </div>
    </div>
  );
}

function Container167() {
  return (
    <div className="h-[74px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label5 />
        <Dropdown1 />
      </div>
    </div>
  );
}

function Text89() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[50.48px] top-[2px] w-[7.297px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#d92d20] text-[14px]">*</p>
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[21px] relative shrink-0 w-[512px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Vai trò</p>
        <Text89 />
      </div>
    </div>
  );
}

function Checkbox() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon174() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container168() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon174 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Cán bộ quản lý dữ liệu</p>
    </div>
  );
}

function Container169() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền nhập và chỉnh sửa dữ liệu</p>
    </div>
  );
}

function Container170() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container168 />
      <Container169 />
    </div>
  );
}

function Label7() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox />
      <Container170 />
    </div>
  );
}

function Checkbox1() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon175() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container171() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon175 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Cửa hàng</p>
    </div>
  );
}

function Container172() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền cửa hàng</p>
    </div>
  );
}

function Container173() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container171 />
      <Container172 />
    </div>
  );
}

function Label8() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox1 />
      <Container173 />
    </div>
  );
}

function Checkbox2() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon176() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container174() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon176 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Người dùng</p>
    </div>
  );
}

function Container175() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền người dùng cơ bản</p>
    </div>
  );
}

function Container176() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container174 />
      <Container175 />
    </div>
  );
}

function Label9() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox2 />
      <Container176 />
    </div>
  );
}

function Checkbox3() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon177() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container177() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon177 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Người xem</p>
    </div>
  );
}

function Container178() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Chỉ được xem dữ liệu</p>
    </div>
  );
}

function Container179() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container177 />
      <Container178 />
    </div>
  );
}

function Label10() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox3 />
      <Container179 />
    </div>
  );
}

function Checkbox4() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon178() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container180() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon178 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Quản lý tài chính</p>
    </div>
  );
}

function Container181() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền quản lý tài chính</p>
    </div>
  );
}

function Container182() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container180 />
      <Container181 />
    </div>
  );
}

function Label11() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox4 />
      <Container182 />
    </div>
  );
}

function Checkbox5() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon179() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container183() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon179 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Quản lý thị trường</p>
    </div>
  );
}

function Container184() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền quản lý và giám sát</p>
    </div>
  );
}

function Container185() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container183 />
      <Container184 />
    </div>
  );
}

function Label12() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox5 />
      <Container185 />
    </div>
  );
}

function Checkbox6() {
  return <div className="absolute left-[8px] size-[18px] top-[10px]" data-name="Checkbox" />;
}

function Icon180() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container186() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <Icon180 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Quản trị viên</p>
    </div>
  );
}

function Container187() {
  return (
    <div className="content-stretch flex h-[16.797px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px]">Quyền quản trị toàn hệ thống</p>
    </div>
  );
}

function Container188() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[39.797px] items-start left-[38px] top-[8px] w-[435px]" data-name="Container">
      <Container186 />
      <Container187 />
    </div>
  );
}

function Label13() {
  return (
    <div className="h-[55.797px] relative rounded-[4px] shrink-0 w-full" data-name="Label">
      <Checkbox6 />
      <Container188 />
    </div>
  );
}

function Container189() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-px pl-[13px] pr-[18px] pt-[13px] relative rounded-[inherit] size-full">
        <Label7 />
        <Label8 />
        <Label9 />
        <Label10 />
        <Label11 />
        <Label12 />
        <Label13 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Small3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[512px]" data-name="Small">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#667085] text-[12px] top-0">Chọn 1 hoặc nhiều vai trò cho người dùng</p>
      </div>
    </div>
  );
}

function Container190() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[512px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Label6 />
        <Container189 />
        <Small3 />
      </div>
    </div>
  );
}

function Container191() {
  return (
    <div className="h-[970px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
          <Container153 />
          <Container155 />
          <Container161 />
          <Container163 />
          <Container165 />
          <Container166 />
          <Container167 />
          <Container190 />
        </div>
      </div>
    </div>
  );
}

function Button113() {
  return (
    <div className="bg-[#f2f4f7] h-[45px] relative rounded-[6px] shrink-0 w-[58.906px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-[12px] relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center">Hủy</p>
      </div>
    </div>
  );
}

function Icon181() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[14.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3c401780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56b0600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17caa400} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button114() {
  return (
    <div className="bg-[#005cb6] h-[45px] relative rounded-[6px] shrink-0 w-[81.203px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon181 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[53px] not-italic text-[14px] text-center text-white top-[12px] translate-x-[-50%]">Lưu</p>
      </div>
    </div>
  );
}

function Container192() {
  return (
    <div className="bg-white h-[78px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex gap-[12px] items-start justify-end pb-0 pl-0 pr-[24px] pt-[17px] relative size-full">
          <Button113 />
          <Button114 />
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="h-[1048px] relative shrink-0 w-[560px]" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container191 />
        <Container192 />
      </div>
    </div>
  );
}

function Container193() {
  return (
    <div className="bg-white h-[739.5px] relative rounded-[8px] shadow-[0px_10px_40px_0px_rgba(0,0,0,0.2)] shrink-0 w-[560px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[81px] px-0 relative size-full">
        <Form />
      </div>
    </div>
  );
}

function UserModal1() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.5)] content-stretch flex h-[855px] items-center justify-center left-0 top-[400px] w-[1436px]" data-name="UserModal">
      <Container193 />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <MainLayout />
      <UserModal1 />
    </div>
  );
}
