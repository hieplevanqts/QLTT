import svgPaths from "./svg-bc13sznhq6";
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
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[224.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[112.5px] not-italic text-[#101828] text-[16px] text-center top-[-1px] translate-x-[-50%] w-[225px]">Xin chào, Nguyễn Văn Thành</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[164.719px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#667085] text-[12px] text-center">Phần mềm Quản lý thị trường</p>
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
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-center left-[24px] top-[11.5px] w-[272.828px]" data-name="Button">
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
    <div className="absolute h-[40px] left-[431.63px] top-[11.5px] w-[576px]" data-name="GlobalSearch">
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
    <div className="absolute h-[36px] left-[1261.22px] top-[13.5px] w-[185.75px]" data-name="Container">
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
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[89px] not-italic text-[#101828] text-[14px] text-center top-[8px] translate-x-[-50%]">{`Cơ sở quản lý`}</p>
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
          <path d={svgPaths.p388158b0} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
          <path d={svgPaths.p38c93920} id="Vector_5" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
    <div className="h-[19.5px] relative shrink-0 w-[1423px]" data-name="Container">
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
        <g clipPath="url(#clip0_2467_2102)" id="Icon">
          <path d={svgPaths.p363df2c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2467_2102">
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
    <div className="bg-white h-[72.5px] relative rounded-[8px] shrink-0 w-[1423px]" data-name="Container">
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
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[177.188px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[101.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%]">Quản lý người dùng</p>
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
          <path d={svgPaths.p14548f00} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17781bc0} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button22() {
  return (
    <div className="bg-white h-[35.5px] relative rounded-[6px] shrink-0 w-[168.297px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon24 />
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[96px] not-italic text-[#005cb6] text-[13px] text-center top-[8px] translate-x-[-50%]">{`Địa bàn & phạm vi`}</p>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2474_3240)" id="Icon">
          <path d={svgPaths.p241f1490} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p6b27c00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p312f7580} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3240">
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
    <div className="h-[59.5px] relative shrink-0 w-[1421px]" data-name="Container">
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

function Heading1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[475.453px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[31.2px] left-0 not-italic text-[#101828] text-[24px] top-0">{`Địa bàn & phạm vi`}</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[475.453px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0">Quản lý danh sách địa bàn hành chính và phạm vi quản lý toàn hệ thống</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[58.188px] items-start left-0 top-0 w-[475.453px]" data-name="Container">
      <Heading1 />
      <Paragraph1 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[21px] size-[16px] top-[13.5px]" data-name="Icon">
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

function Button24() {
  return (
    <div className="bg-white h-[43px] relative rounded-[6px] shrink-0 w-[122.422px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon26 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[73.5px] not-italic text-[#101828] text-[14px] text-center top-[11px] translate-x-[-50%]">Làm mới</p>
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[21px] size-[16px] top-[13.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12V8" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 10L8 12L10 10" id="Vector_4" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button25() {
  return (
    <div className="bg-white h-[43px] relative rounded-[6px] shrink-0 w-[145.625px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon27 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[85px] not-italic text-[#101828] text-[14px] text-center top-[11px] translate-x-[-50%]">Xuất dữ liệu</p>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[12.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="bg-[#005cb6] flex-[1_0_0] h-[41px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon28 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[89px] not-italic text-[14px] text-center text-white top-[10px] translate-x-[-50%]">Thêm địa bàn</p>
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[21px] size-[16px] top-[13.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26e09a00} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 2V10" id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="bg-white h-[43px] relative rounded-[6px] shrink-0 w-[150.297px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon29 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[87.5px] not-italic text-[#101828] text-[14px] text-center top-[11px] translate-x-[-50%]">Nhập dữ liệu</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[43px] items-center left-[763.67px] top-0 w-[609.328px]" data-name="Container">
      <Button24 />
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[58.188px] relative shrink-0 w-[1373px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p27c543b0} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2d59bff0} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] relative rounded-[6px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon30 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#101828] text-[30px] top-0">5</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[16.797px] relative shrink-0 w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px] tracking-[0.5px] uppercase">Tổng địa bàn</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] h-[50.797px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container11 />
        <Container12 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white col-[1] css-por8k5 h-[92.797px] relative rounded-[8px] row-[1] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[21px] py-px relative size-full">
          <Container10 />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pfb16970} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13754d00} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p281e4940} id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 6H14" id="Vector_4" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 10H14" id="Vector_5" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 14H14" id="Vector_6" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 18H14" id="Vector_7" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] relative rounded-[6px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#101828] text-[30px] top-0">5</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[16.797px] relative shrink-0 w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px] tracking-[0.5px] uppercase">Cấp Tỉnh/TP</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] h-[50.797px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-white col-[2] css-por8k5 h-[92.797px] relative rounded-[8px] row-[1] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[21px] py-px relative size-full">
          <Container15 />
          <Container18 />
        </div>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pfb16970} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13754d00} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p281e4940} id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 6H14" id="Vector_4" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 10H14" id="Vector_5" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 14H14" id="Vector_6" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 18H14" id="Vector_7" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] relative rounded-[6px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#101828] text-[30px] top-0">3</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[16.797px] relative shrink-0 w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px] tracking-[0.5px] uppercase">Cấp Xã/Phường</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[50.797px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-white col-[3] css-por8k5 h-[92.797px] relative rounded-[8px] row-[1] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[21px] py-px relative size-full">
          <Container20 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M20 6L9 17L4 12" id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] relative rounded-[6px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#101828] text-[30px] top-0">5</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[16.797px] relative shrink-0 w-[225.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16.8px] min-h-px min-w-px not-italic relative text-[#667085] text-[12px] tracking-[0.5px] uppercase">Đang hoạt động</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="flex-[1_0_0] h-[50.797px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-white col-[4] css-por8k5 h-[92.797px] relative rounded-[8px] row-[1] shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[21px] py-px relative size-full">
          <Container25 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[92.797px] relative shrink-0 w-[1373px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-[16px] grid grid-cols-[_____minmax(0,_331.25fr)_minmax(0,_331.25fr)_minmax(0,_331.25fr)_minmax(0,_331.25fr)_minmax(0,_1fr)] grid-rows-[repeat(1,_minmax(0,_1fr))] relative size-full">
        <Container14 />
        <Container19 />
        <Container24 />
        <Container29 />
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Tất cả cấp</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Cấp Tỉnh</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Cấp Xã</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[412px] pb-px pl-[-477px] pr-[637px] pt-[-346.484px] rounded-[6px] top-px w-[160px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option />
      <Option1 />
      <Option2 />
    </div>
  );
}

function Option3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Tất cả trạng thái</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Hoạt động</p>
    </div>
  );
}

function Option5() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">Không hoạt động</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[584px] pb-px pl-[-649px] pr-[817px] pt-[-346.484px] rounded-[6px] top-px w-[168px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option3 />
      <Option4 />
      <Option5 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[43px] left-0 rounded-[6px] top-0 w-[400px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[44px] pr-[16px] py-[10px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">Tìm kiếm theo tên, mã địa bàn...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon34() {
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

function Container31() {
  return (
    <div className="absolute h-[43px] left-0 top-0 w-[400px]" data-name="Container">
      <TextInput1 />
      <Icon34 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[43px] left-[16px] top-[16px] w-[1267px]" data-name="Container">
      <Dropdown />
      <Dropdown1 />
      <Container31 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36bb6c80} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button28() {
  return (
    <div className="absolute bg-white content-stretch flex h-[38px] items-center justify-center left-[1299px] p-px rounded-[6px] top-[18.5px] w-[58px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon35 />
    </div>
  );
}

function Container33() {
  return (
    <div className="bg-[#f2f4f7] h-[75px] relative rounded-[8px] shrink-0 w-[1373px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container32 />
        <Button28 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[26px] left-[16px] rounded-[4px] top-[20px] w-[44.813px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Cousine:Bold',sans-serif] leading-[18px] left-[8px] not-italic text-[#005cb6] text-[12px] top-[4px]">DB01</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[65.5px] left-0 top-0 w-[132.672px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24.5px] w-[44.828px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Hà Nội</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[65.5px] left-[132.67px] top-0 w-[216.266px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] border-solid h-[32px] left-[16px] rounded-[16px] top-[17px] w-[71.266px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#4f46e5] text-[12px] top-[6px]">Tỉnh/TP</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[65.5px] left-[348.94px] top-0 w-[176.547px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24.5px] w-[120.047px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Thành phố Hà Nội</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[65.5px] left-[525.48px] top-0 w-[221.156px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24.5px] w-[14px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Italic',sans-serif] font-normal italic leading-[21px] relative shrink-0 text-[#667085] text-[14px]">—</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[65.5px] left-[746.64px] top-0 w-[211.797px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] border-solid h-[32px] left-[46.81px] rounded-[16px] top-[17px] w-[103.609px]" data-name="Text">
      <Icon36 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[60px] not-italic text-[#059669] text-[12px] text-center top-[6px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[65.5px] left-[958.44px] top-0 w-[197.25px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Icon37() {
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

function Button29() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Icon38() {
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

function Button30() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M2 4H14" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p64eb800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56ef700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 7.33333V11.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-end left-[16px] top-[15px] w-[183.313px]" data-name="Container">
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[65.5px] left-[1155.69px] top-0 w-[215.313px]" data-name="Table Cell">
      <Container34 />
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[65.5px] left-0 top-0 w-[1371px]" data-name="Table Row">
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

function Text10() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[26px] left-[16px] rounded-[4px] top-[19.5px] w-[59.219px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Cousine:Bold',sans-serif] leading-[18px] left-[8px] not-italic text-[#005cb6] text-[12px] top-[4px]">DB0102</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[65px] left-0 top-0 w-[132.672px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[110.516px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Hà Nội - Ba Đình</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[65px] left-[132.67px] top-0 w-[216.266px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] border-solid h-[32px] left-[16px] rounded-[16px] top-[16.5px] w-[89.375px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#ea580c] text-[12px] top-[6px]">Xã/Phường</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[65px] left-[348.94px] top-0 w-[176.547px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[120.047px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Thành phố Hà Nội</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[65px] left-[525.48px] top-0 w-[221.156px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[107.172px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Phường Ba Đình</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[65px] left-[746.64px] top-0 w-[211.797px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] border-solid h-[32px] left-[46.81px] rounded-[16px] top-[16.5px] w-[103.609px]" data-name="Text">
      <Icon40 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[60px] not-italic text-[#059669] text-[12px] text-center top-[6px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[65px] left-[958.44px] top-0 w-[197.25px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Icon41() {
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
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon41 />
      </div>
    </div>
  );
}

function Icon42() {
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
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
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
          <path d="M2 4H14" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p64eb800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56ef700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 7.33333V11.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button34() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon43 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-end left-[16px] top-[14.5px] w-[183.313px]" data-name="Container">
      <Button32 />
      <Button33 />
      <Button34 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[65px] left-[1155.69px] top-0 w-[215.313px]" data-name="Table Cell">
      <Container35 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[65px] left-0 top-[65.5px] w-[1371px]" data-name="Table Row">
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

function Text16() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[26px] left-[16px] rounded-[4px] top-[19.5px] w-[52.016px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Cousine:Bold',sans-serif] leading-[18px] left-[8px] not-italic text-[#005cb6] text-[12px] top-[4px]">DB002</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[65px] left-0 top-0 w-[132.672px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[116.688px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Hà Nội - Hồng Hà</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[65px] left-[132.67px] top-0 w-[216.266px]" data-name="Table Cell">
      <Text17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] border-solid h-[32px] left-[16px] rounded-[16px] top-[16.5px] w-[89.375px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#ea580c] text-[12px] top-[6px]">Xã/Phường</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[65px] left-[348.94px] top-0 w-[176.547px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[120.047px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Thành phố Hà Nội</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[65px] left-[525.48px] top-0 w-[221.156px]" data-name="Table Cell">
      <Text19 />
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[113.609px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Phường Hồng Hà</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[65px] left-[746.64px] top-0 w-[211.797px]" data-name="Table Cell">
      <Text20 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] border-solid h-[32px] left-[46.81px] rounded-[16px] top-[16.5px] w-[103.609px]" data-name="Text">
      <Icon44 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[60px] not-italic text-[#059669] text-[12px] text-center top-[6px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[65px] left-[958.44px] top-0 w-[197.25px]" data-name="Table Cell">
      <Text21 />
    </div>
  );
}

function Icon45() {
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

function Button35() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon45 />
      </div>
    </div>
  );
}

function Icon46() {
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

function Button36() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon46 />
      </div>
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M2 4H14" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p64eb800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56ef700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 7.33333V11.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button37() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon47 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-end left-[16px] top-[14.5px] w-[183.313px]" data-name="Container">
      <Button35 />
      <Button36 />
      <Button37 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[65px] left-[1155.69px] top-0 w-[215.313px]" data-name="Table Cell">
      <Container36 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[65px] left-0 top-[130.5px] w-[1371px]" data-name="Table Row">
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

function Text22() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[26px] left-[16px] rounded-[4px] top-[19.5px] w-[52.016px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Cousine:Bold',sans-serif] leading-[18px] left-[8px] not-italic text-[#005cb6] text-[12px] top-[4px]">DB001</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[65px] left-0 top-0 w-[132.672px]" data-name="Table Cell">
      <Text22 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[57.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">lạng sơn</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[65px] left-[132.67px] top-0 w-[216.266px]" data-name="Table Cell">
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] border-solid h-[32px] left-[16px] rounded-[16px] top-[16.5px] w-[71.266px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#4f46e5] text-[12px] top-[6px]">Tỉnh/TP</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[65px] left-[348.94px] top-0 w-[176.547px]" data-name="Table Cell">
      <Text24 />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[95.828px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Tỉnh Lạng Sơn</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[65px] left-[525.48px] top-0 w-[221.156px]" data-name="Table Cell">
      <Text25 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[14px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Italic',sans-serif] font-normal italic leading-[21px] relative shrink-0 text-[#667085] text-[14px]">—</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[65px] left-[746.64px] top-0 w-[211.797px]" data-name="Table Cell">
      <Text26 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] border-solid h-[32px] left-[46.81px] rounded-[16px] top-[16.5px] w-[103.609px]" data-name="Text">
      <Icon48 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[60px] not-italic text-[#059669] text-[12px] text-center top-[6px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[65px] left-[958.44px] top-0 w-[197.25px]" data-name="Table Cell">
      <Text27 />
    </div>
  );
}

function Icon49() {
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

function Button38() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon49 />
      </div>
    </div>
  );
}

function Icon50() {
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

function Button39() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
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
          <path d="M2 4H14" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p64eb800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56ef700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 7.33333V11.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button40() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon51 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-end left-[16px] top-[14.5px] w-[183.313px]" data-name="Container">
      <Button38 />
      <Button39 />
      <Button40 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[65px] left-[1155.69px] top-0 w-[215.313px]" data-name="Table Cell">
      <Container37 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[65px] left-0 top-[195.5px] w-[1371px]" data-name="Table Row">
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

function Text28() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[26px] left-[16px] rounded-[4px] top-[19.5px] w-[52.016px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Cousine:Bold',sans-serif] leading-[18px] left-[8px] not-italic text-[#005cb6] text-[12px] top-[4px]">dfdsf</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[64.5px] left-0 top-0 w-[132.672px]" data-name="Table Cell">
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[35.719px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">dfdsf</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[64.5px] left-[132.67px] top-0 w-[216.266px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute bg-[rgba(249,115,22,0.1)] border border-[rgba(249,115,22,0.2)] border-solid h-[32px] left-[16px] rounded-[16px] top-[16.5px] w-[89.375px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[12px] not-italic text-[#ea580c] text-[12px] top-[6px]">Xã/Phường</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[64.5px] left-[348.94px] top-0 w-[176.547px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[83.047px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Tỉnh Lào Cai</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[64.5px] left-[525.48px] top-0 w-[221.156px]" data-name="Table Cell">
      <Text31 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[24px] w-[63.563px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">Xã Bảo Ái</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[64.5px] left-[746.64px] top-0 w-[211.797px]" data-name="Table Cell">
      <Text32 />
    </div>
  );
}

function Icon52() {
  return (
    <div className="absolute left-[12px] size-[12px] top-[9px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text33() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] border-solid h-[32px] left-[46.81px] rounded-[16px] top-[16.5px] w-[103.609px]" data-name="Text">
      <Icon52 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[60px] not-italic text-[#059669] text-[12px] text-center top-[6px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[64.5px] left-[958.44px] top-0 w-[197.25px]" data-name="Table Cell">
      <Text33 />
    </div>
  );
}

function Icon53() {
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

function Button41() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon53 />
      </div>
    </div>
  );
}

function Icon54() {
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

function Button42() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon54 />
      </div>
    </div>
  );
}

function Icon55() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M2 4H14" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p64eb800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p56ef700} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 7.33333V11.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 7.33333V11.3333" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button43() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon55 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[36px] items-center justify-end left-[16px] top-[14.5px] w-[183.313px]" data-name="Container">
      <Button41 />
      <Button42 />
      <Button43 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[64.5px] left-[1155.69px] top-0 w-[215.313px]" data-name="Table Cell">
      <Container38 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute h-[64.5px] left-0 top-[260.5px] w-[1371px]" data-name="Table Row">
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

function TableBody() {
  return (
    <div className="absolute h-[325px] left-0 top-[47px] w-[1371px]" data-name="Table Body">
      <TableRow />
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[372px] left-0 top-0 w-[1371px]" data-name="Table">
      <TableBody />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-0 top-0 w-[132.672px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#101828] text-[12px] top-[14px] tracking-[0.5px] uppercase">Mã</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[132.67px] top-0 w-[216.266px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#101828] text-[12px] top-[14px] tracking-[0.5px] uppercase">Tên địa bàn</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[348.94px] top-0 w-[176.547px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#101828] text-[12px] top-[14px] tracking-[0.5px] uppercase">Cấp</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[525.48px] top-0 w-[221.156px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#101828] text-[12px] top-[14px] tracking-[0.5px] uppercase">Tỉnh/TP</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[746.64px] top-0 w-[211.797px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#101828] text-[12px] top-[14px] tracking-[0.5px] uppercase">Xã/Phường</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[958.44px] top-0 w-[197.25px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[99.36px] not-italic text-[#101828] text-[12px] text-center top-[14px] tracking-[0.5px] translate-x-[-50%] uppercase">Trạng thái</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[47px] left-[1155.69px] top-0 w-[215.313px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[199.97px] not-italic text-[#101828] text-[12px] text-right top-[14px] tracking-[0.5px] translate-x-[-100%] uppercase">Thao tác</p>
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute h-[47px] left-0 top-0 w-[1371px]" data-name="Table Row">
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
    <div className="absolute bg-[#f2f4f7] h-[47px] left-0 top-0 w-[1371px]" data-name="Table Header">
      <TableRow5 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[372px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Table />
      <TableHeader />
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1373px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container39 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TerritoryTabNew() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1421px]" data-name="TerritoryTabNew">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container9 />
        <Container30 />
        <Container33 />
        <Container40 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1423px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container6 />
        <TerritoryTabNew />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[1038.484px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
        <Container41 />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[1158.484px] items-start left-0 top-0 w-[1471px]" data-name="MainLayout">
      <TopUtilityBar3 />
      <HorizontalNavBar />
      <AdminPage />
    </div>
  );
}

function Icon56() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">Chỉnh sửa địa bàn</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[24px] relative shrink-0 w-[158.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Icon56 />
        <Heading2 />
      </div>
    </div>
  );
}

function Icon57() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button44() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon57 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[24px] relative shrink-0 w-[800px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container42 />
        <Button44 />
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="absolute h-[24px] left-[23.69px] top-0 w-[8.328px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[24px] relative shrink-0 w-[400px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">Mã</p>
        <Text34 />
      </div>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-[400px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)]">DB01</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col h-[48px] items-start left-0 top-0 w-[400px]" data-name="Container">
      <Label />
      <TextInput2 />
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute h-[24px] left-[88.52px] top-0 w-[8.328px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[400px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">Tên địa bàn</p>
        <Text35 />
      </div>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-[400px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)]">Hà Nội</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col h-[48px] items-start left-[400px] top-0 w-[400px]" data-name="Container">
      <Label1 />
      <TextInput3 />
    </div>
  );
}

function Text36() {
  return (
    <div className="absolute h-[24px] left-[30.72px] top-0 w-[8.328px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">*</p>
    </div>
  );
}

function Label2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[400px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">Cấp</p>
        <Text36 />
      </div>
    </div>
  );
}

function Option6() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">-- Chọn cấp --</p>
    </div>
  );
}

function Option7() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Cấp Tỉnh/Thành phố</p>
    </div>
  );
}

function Option8() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Cấp Xã/Phường</p>
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="h-[22px] relative rounded-[4px] shrink-0 w-[400px]" data-name="Dropdown">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pl-[-335.5px] pr-[735.5px] pt-[-340.5px] relative size-full">
        <Option6 />
        <Option7 />
        <Option8 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-0 top-[48px] w-[400px]" data-name="Container">
      <Label2 />
      <Dropdown2 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute h-[24px] left-[76.83px] top-0 w-[8.328px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">*</p>
    </div>
  );
}

function Label3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[400px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px]">Trạng thái</p>
        <Text37 />
      </div>
    </div>
  );
}

function Option9() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Hoạt động</p>
    </div>
  );
}

function Option10() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Ngừng hoạt động</p>
    </div>
  );
}

function Dropdown3() {
  return (
    <div className="h-[22px] relative rounded-[4px] shrink-0 w-[400px]" data-name="Dropdown">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pl-[-735.5px] pr-[1135.5px] pt-[-340.5px] relative size-full">
        <Option9 />
        <Option10 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-[400px] top-[48px] w-[400px]" data-name="Container">
      <Label3 />
      <Dropdown3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[800px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#101828] text-[16px]">Chọn Tỉnh/Thành phố</p>
      </div>
    </div>
  );
}

function Option11() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">-- Chọn Tỉnh/Thành phố --</p>
    </div>
  );
}

function Option12() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Thành phố Hà Nội</p>
    </div>
  );
}

function Option13() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Thành phố Huế</p>
    </div>
  );
}

function Option14() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh An Giang</p>
    </div>
  );
}

function Option15() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Bắc Ninh</p>
    </div>
  );
}

function Option16() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Cà Mau</p>
    </div>
  );
}

function Option17() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Cao Bằng</p>
    </div>
  );
}

function Option18() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Đắk Lắk</p>
    </div>
  );
}

function Option19() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Điện Biên</p>
    </div>
  );
}

function Option20() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Đồng Nai</p>
    </div>
  );
}

function Option21() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Đồng Tháp</p>
    </div>
  );
}

function Option22() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Gia Lai</p>
    </div>
  );
}

function Option23() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Hà Tĩnh</p>
    </div>
  );
}

function Option24() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Hưng Yên</p>
    </div>
  );
}

function Option25() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Khánh Hòa</p>
    </div>
  );
}

function Option26() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Lai Châu</p>
    </div>
  );
}

function Option27() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Lâm Đồng</p>
    </div>
  );
}

function Option28() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Lạng Sơn</p>
    </div>
  );
}

function Option29() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Lào Cai</p>
    </div>
  );
}

function Option30() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Nghệ An</p>
    </div>
  );
}

function Option31() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Ninh Bình</p>
    </div>
  );
}

function Option32() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Phú Thọ</p>
    </div>
  );
}

function Option33() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Quảng Ngãi</p>
    </div>
  );
}

function Option34() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Quảng Ninh</p>
    </div>
  );
}

function Option35() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Quảng Trị</p>
    </div>
  );
}

function Option36() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Sơn La</p>
    </div>
  );
}

function Option37() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Tây Ninh</p>
    </div>
  );
}

function Option38() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Thái Nguyên</p>
    </div>
  );
}

function Option39() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Thanh Hóa</p>
    </div>
  );
}

function Option40() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Tuyên Quang</p>
    </div>
  );
}

function Option41() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tỉnh Vĩnh Long</p>
    </div>
  );
}

function Option42() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tp Cần Thơ</p>
    </div>
  );
}

function Option43() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tp Đà Nẵng</p>
    </div>
  );
}

function Option44() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tp Hải Phòng</p>
    </div>
  );
}

function Option45() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Tp Hồ Chí Minh</p>
    </div>
  );
}

function Dropdown4() {
  return (
    <div className="h-[22px] relative rounded-[4px] shrink-0 w-[800px]" data-name="Dropdown">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pl-[-335.5px] pr-[1135.5px] pt-[-386.5px] relative size-full">
        <Option11 />
        <Option12 />
        <Option13 />
        <Option14 />
        <Option15 />
        <Option16 />
        <Option17 />
        <Option18 />
        <Option19 />
        <Option20 />
        <Option21 />
        <Option22 />
        <Option23 />
        <Option24 />
        <Option25 />
        <Option26 />
        <Option27 />
        <Option28 />
        <Option29 />
        <Option30 />
        <Option31 />
        <Option32 />
        <Option33 />
        <Option34 />
        <Option35 />
        <Option36 />
        <Option37 />
        <Option38 />
        <Option39 />
        <Option40 />
        <Option41 />
        <Option42 />
        <Option43 />
        <Option44 />
        <Option45 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-0 top-[94px] w-[800px]" data-name="Container">
      <Label4 />
      <Dropdown4 />
    </div>
  );
}

function Label5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[800px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#101828] text-[16px]">Chọn Xã/Phường</p>
      </div>
    </div>
  );
}

function Option46() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">-- Chọn Xã/Phường --</p>
    </div>
  );
}

function Option47() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Ba Đình</p>
    </div>
  );
}

function Option48() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Bạch Mai</p>
    </div>
  );
}

function Option49() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Bồ Đề</p>
    </div>
  );
}

function Option50() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Cầu Giấy</p>
    </div>
  );
}

function Option51() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Chương Mỹ</p>
    </div>
  );
}

function Option52() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Cửa Nam</p>
    </div>
  );
}

function Option53() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Đại Mỗ</p>
    </div>
  );
}

function Option54() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Định Công</p>
    </div>
  );
}

function Option55() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Đống Đa</p>
    </div>
  );
}

function Option56() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Đông Ngạc</p>
    </div>
  );
}

function Option57() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Dương Nội</p>
    </div>
  );
}

function Option58() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Giảng Võ</p>
    </div>
  );
}

function Option59() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hà Đông</p>
    </div>
  );
}

function Option60() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hai Bà Trưng</p>
    </div>
  );
}

function Option61() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hoàn Kiếm</p>
    </div>
  );
}

function Option62() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hoàng Liệt</p>
    </div>
  );
}

function Option63() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hoàng Mai</p>
    </div>
  );
}

function Option64() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Hồng Hà</p>
    </div>
  );
}

function Option65() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Khương Đình</p>
    </div>
  );
}

function Option66() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Kiến Hưng</p>
    </div>
  );
}

function Option67() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Kim Liên</p>
    </div>
  );
}

function Option68() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Láng</p>
    </div>
  );
}

function Option69() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Lĩnh Nam</p>
    </div>
  );
}

function Option70() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Long Biên</p>
    </div>
  );
}

function Option71() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Nghĩa Đô</p>
    </div>
  );
}

function Option72() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Ngọc Hà</p>
    </div>
  );
}

function Option73() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Ô Chợ Dừa</p>
    </div>
  );
}

function Option74() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Phú Diễn</p>
    </div>
  );
}

function Option75() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Phú Lương</p>
    </div>
  );
}

function Option76() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Phú Thượng</p>
    </div>
  );
}

function Option77() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Phúc Lợi</p>
    </div>
  );
}

function Option78() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Phương Liệt</p>
    </div>
  );
}

function Option79() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Sơn Tây</p>
    </div>
  );
}

function Option80() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Tây Hồ</p>
    </div>
  );
}

function Option81() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Tây Mỗ</p>
    </div>
  );
}

function Option82() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Tây Tựu</p>
    </div>
  );
}

function Option83() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Thanh Liệt</p>
    </div>
  );
}

function Option84() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Thanh Xuân</p>
    </div>
  );
}

function Option85() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Thượng Cát</p>
    </div>
  );
}

function Option86() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Từ Liêm</p>
    </div>
  );
}

function Option87() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Tùng Thiện</p>
    </div>
  );
}

function Option88() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Tương Mai</p>
    </div>
  );
}

function Option89() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Văn Miếu - Quốc Tử Giám</p>
    </div>
  );
}

function Option90() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Việt Hưng</p>
    </div>
  );
}

function Option91() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Vĩnh Hưng</p>
    </div>
  );
}

function Option92() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Vĩnh Tuy</p>
    </div>
  );
}

function Option93() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Xuân Đỉnh</p>
    </div>
  );
}

function Option94() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Xuân Phương</p>
    </div>
  );
}

function Option95() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Yên Hoà</p>
    </div>
  );
}

function Option96() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Yên Nghĩa</p>
    </div>
  );
}

function Option97() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Phường Yên Sở</p>
    </div>
  );
}

function Option98() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Xã An Khánh</p>
    </div>
  );
}

function Option99() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Xã Ba Vì</p>
    </div>
  );
}

function Option100() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Xã Bất Bạt</p>
    </div>
  );
}

function Option101() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Xã Bát Tràng</p>
    </div>
  );
}

function Option102() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[16px] top-0 w-0">Xã Bình Minh</p>
    </div>
  );
}

function Dropdown5() {
  return (
    <div className="h-[22px] relative rounded-[4px] shrink-0 w-[800px]" data-name="Dropdown">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pl-[-335.5px] pr-[1135.5px] pt-[-432.5px] relative size-full">
        <Option46 />
        <Option47 />
        <Option48 />
        <Option49 />
        <Option50 />
        <Option51 />
        <Option52 />
        <Option53 />
        <Option54 />
        <Option55 />
        <Option56 />
        <Option57 />
        <Option58 />
        <Option59 />
        <Option60 />
        <Option61 />
        <Option62 />
        <Option63 />
        <Option64 />
        <Option65 />
        <Option66 />
        <Option67 />
        <Option68 />
        <Option69 />
        <Option70 />
        <Option71 />
        <Option72 />
        <Option73 />
        <Option74 />
        <Option75 />
        <Option76 />
        <Option77 />
        <Option78 />
        <Option79 />
        <Option80 />
        <Option81 />
        <Option82 />
        <Option83 />
        <Option84 />
        <Option85 />
        <Option86 />
        <Option87 />
        <Option88 />
        <Option89 />
        <Option90 />
        <Option91 />
        <Option92 />
        <Option93 />
        <Option94 />
        <Option95 />
        <Option96 />
        <Option97 />
        <Option98 />
        <Option99 />
        <Option100 />
        <Option101 />
        <Option102 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-0 top-[140px] w-[800px]" data-name="Container">
      <Label5 />
      <Dropdown5 />
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[800px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#101828] text-[16px]">Mô tả</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-[800px]" data-name="Text Area">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)]">Nhập mô tả về địa bàn...</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col h-[124px] items-start left-0 top-[186px] w-[800px]" data-name="Container">
      <Label6 />
      <TextArea />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[310px] relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
    </div>
  );
}

function Button45() {
  return (
    <div className="h-[24px] relative rounded-[4px] shrink-0 w-[30.75px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#101828] text-[16px] text-center">Hủy</p>
      </div>
    </div>
  );
}

function Button46() {
  return (
    <div className="h-[24px] relative rounded-[4px] shrink-0 w-[28.797px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Lưu</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Button45 />
      <Button46 />
    </div>
  );
}

function Form() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[800px]" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function AreaModal() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.5)] content-stretch flex flex-col h-[358px] items-start left-[335.5px] rounded-[6px] top-[555.5px] w-[800px]" data-name="AreaModal">
      <Container43 />
      <Form />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <MainLayout />
      <AreaModal />
    </div>
  );
}
