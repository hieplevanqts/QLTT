import svgPaths from "./svg-o8ul43ju88";
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
        <g clipPath="url(#clip0_2305_512)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17940e00} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2305_512">
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
          <path d={svgPaths.p1c7eb8c0} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
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
    <div className="absolute h-[43px] left-[20px] top-[20px] w-[914.359px]" data-name="Container">
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
    <div className="absolute h-[43px] left-[950.36px] top-[20px] w-[450.641px]" data-name="Container">
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-white h-[84px] relative shrink-0 w-[1421px]" data-name="Container">
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
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[29px] not-italic text-[#101828] text-[13px] text-center top-[12px] translate-x-[-50%]">STT</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[57.55px] top-0 w-[583.453px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Thông tin người dùng</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[641px] top-0 w-[220px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Vai trò</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[861px] top-0 w-[220px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[16px] not-italic text-[#101828] text-[13px] top-[12px]">Bộ phận</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[1081px] top-0 w-[140px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[70.36px] not-italic text-[#101828] text-[13px] text-center top-[12px] translate-x-[-50%]">Trạng thái</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute border-[#d0d5dd] border-b-2 border-solid h-[44.5px] left-[1221px] top-0 w-[200px]" data-name="Header Cell">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[99.55px] not-italic text-[#101828] text-[13px] text-center top-[12px] translate-x-[-50%]">Thao tác</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[44.5px] left-0 top-0 w-[1421px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[44.5px] left-0 top-0 w-[1421px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[112.5px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.42px] not-italic text-[#101828] text-[14px] text-center top-[46px] translate-x-[-50%]">1</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">L</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Lê Văn Hùng</p>
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
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">can.bo.qltt@gmail.com</p>
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon32 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0123456789</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[13px] w-[551.453px]" data-name="Container">
      <Container11 />
      <Container15 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[112.5px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container16 />
    </div>
  );
}

function Icon33() {
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
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43.5px] w-[188px]" data-name="Text">
      <Icon33 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ Cấp Đội</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[112.5px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[169.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[170px]">ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 10</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[89px]">QT0110 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[25px] w-[188px]" data-name="Container">
      <Text5 />
      <Container17 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[112.5px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container18 />
    </div>
  );
}

function Icon34() {
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43.5px] w-[95.609px]" data-name="Text">
      <Icon34 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[112.5px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Icon35() {
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
        <Icon38 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40.5px] w-[168px]" data-name="Container">
      <Button28 />
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[112.5px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container19 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112.5px] left-0 top-0 w-[1421px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[88px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29px] not-italic text-[#101828] text-[14px] text-center top-[33.5px] translate-x-[-50%]">2</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">T</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Trần Văn Quý</p>
    </div>
  );
}

function Icon39() {
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

function Container22() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon39 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">doi.truong@gmail.com</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container21 />
        <Container22 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[17px] w-[551.453px]" data-name="Container">
      <Container20 />
      <Container23 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[88px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container24 />
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

function Text7() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[31px] w-[188px]" data-name="Text">
      <Icon40 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ Cấp Đội</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[88px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[169.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[170px]">ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 10</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[89px]">QT0110 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[12.5px] w-[188px]" data-name="Container">
      <Text8 />
      <Container25 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[88px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container26 />
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

function Text9() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[31px] w-[95.609px]" data-name="Text">
      <Icon41 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[88px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text9 />
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

function Container27() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[28px] w-[168px]" data-name="Container">
      <Button32 />
      <Button33 />
      <Button34 />
      <Button35 />
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[88px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container27 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[88px] left-0 top-[112.5px] w-[1421px]" data-name="Table Row">
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[88px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.94px] not-italic text-[#101828] text-[14px] text-center top-[33.5px] translate-x-[-50%]">3</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Nguyễn Văn Thành</p>
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

function Container30() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon46 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">cuc.truong@gmail.com</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container29 />
        <Container30 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[17px] w-[551.453px]" data-name="Container">
      <Container28 />
      <Container31 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[88px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container32 />
    </div>
  );
}

function Icon47() {
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

function Text10() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[31px] w-[188px]" data-name="Text">
      <Icon47 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ cấp Cục Quản Lý</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[88px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[180.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[181px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[76px]">QT01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[12.5px] w-[188px]" data-name="Container">
      <Text11 />
      <Container33 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[88px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container34 />
    </div>
  );
}

function Icon48() {
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

function Text12() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[31px] w-[95.609px]" data-name="Text">
      <Icon48 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[88px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text12 />
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

function Button36() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
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

function Button37() {
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
        <Icon52 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[28px] w-[168px]" data-name="Container">
      <Button36 />
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[88px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container35 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[88px] left-0 top-[200.5px] w-[1421px]" data-name="Table Row">
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[88px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.75px] not-italic text-[#101828] text-[14px] text-center top-[33.5px] translate-x-[-50%]">4</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">P</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Phan Văn Chinh</p>
    </div>
  );
}

function Icon53() {
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

function Container38() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon53 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">chinhpv@moit.gov.vn</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[17px] w-[551.453px]" data-name="Container">
      <Container36 />
      <Container39 />
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[88px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container40 />
    </div>
  );
}

function Icon54() {
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

function Text13() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[31px] w-[188px]" data-name="Text">
      <Icon54 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[88px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[169.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[170px]">ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 2</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[91px]">QT0102 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[12.5px] w-[188px]" data-name="Container">
      <Text14 />
      <Container41 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[88px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container42 />
    </div>
  );
}

function Icon55() {
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

function Text15() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[31px] w-[95.609px]" data-name="Text">
      <Icon55 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[88px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Icon56() {
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
        <Icon56 />
      </div>
    </div>
  );
}

function Icon57() {
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
        <Icon57 />
      </div>
    </div>
  );
}

function Icon58() {
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
        <Icon59 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[28px] w-[168px]" data-name="Container">
      <Button40 />
      <Button41 />
      <Button42 />
      <Button43 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[88px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container43 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[88px] left-0 top-[288.5px] w-[1421px]" data-name="Table Row">
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[88px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.11px] not-italic text-[#101828] text-[14px] text-center top-[33.5px] translate-x-[-50%]">5</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">H</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Hoàng Ánh Dương</p>
    </div>
  );
}

function Icon60() {
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

function Container46() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon60 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">duongha@moit.gov.vn</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container45 />
        <Container46 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[17px] w-[551.453px]" data-name="Container">
      <Container44 />
      <Container47 />
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[88px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container48 />
    </div>
  );
}

function Icon61() {
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
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[31px] w-[188px]" data-name="Text">
      <Icon61 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ quản lý dữ liệu</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[88px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[180.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[181px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[76px]">QT01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[12.5px] w-[188px]" data-name="Container">
      <Text17 />
      <Container49 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[88px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container50 />
    </div>
  );
}

function Icon62() {
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[31px] w-[95.609px]" data-name="Text">
      <Icon62 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[88px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Icon63() {
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
        <Icon63 />
      </div>
    </div>
  );
}

function Icon64() {
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
        <Icon66 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[28px] w-[168px]" data-name="Container">
      <Button44 />
      <Button45 />
      <Button46 />
      <Button47 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[88px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container51 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[88px] left-0 top-[376.5px] w-[1421px]" data-name="Table Row">
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[231px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.92px] not-italic text-[#101828] text-[14px] text-center top-[105px] translate-x-[-50%]">6</p>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">T</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Trần Hữu Linh</p>
    </div>
  );
}

function Icon67() {
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
      <Icon67 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">linhth@moit.gov.vn</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container53 />
        <Container54 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[88.5px] w-[551.453px]" data-name="Container">
      <Container52 />
      <Container55 />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[231px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container56 />
    </div>
  );
}

function Icon68() {
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

function Text19() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon68 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
      </div>
    </div>
  );
}

function Icon69() {
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

function Text20() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon69 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ quản lý dữ liệu</p>
      </div>
    </div>
  );
}

function Icon70() {
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

function Text21() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon70 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người xem</p>
      </div>
    </div>
  );
}

function Icon71() {
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

function Text22() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon71 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý tài chính</p>
      </div>
    </div>
  );
}

function Icon72() {
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

function Text23() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon72 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản trị viên</p>
      </div>
    </div>
  );
}

function Icon73() {
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

function Text24() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] h-[26px] relative rounded-[12px] shrink-0 w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon73 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người dùng</p>
      </div>
    </div>
  );
}

function Icon74() {
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

function Text25() {
  return (
    <div className="bg-[rgba(0,92,182,0.1)] flex-[1_0_0] min-h-px min-w-px relative rounded-[12px] w-[188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon74 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cửa hàng</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[206px] items-start left-[16px] top-[12.5px] w-[188px]" data-name="Container">
      <Text19 />
      <Text20 />
      <Text21 />
      <Text22 />
      <Text23 />
      <Text24 />
      <Text25 />
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[231px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Container57 />
    </div>
  );
}

function Text26() {
  return (
    <div className="h-[16px] relative shrink-0 w-[137.531px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">Cục quản lý thị trường</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[62px]">QT • Cấp 1</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[41.5px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[94.75px] w-[188px]" data-name="Container">
      <Text26 />
      <Container58 />
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[231px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container59 />
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

function Text27() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[102.5px] w-[95.609px]" data-name="Text">
      <Icon75 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[231px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text27 />
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

function Button48() {
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

function Button49() {
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

function Button50() {
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

function Button51() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon79 />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[99.5px] w-[168px]" data-name="Container">
      <Button48 />
      <Button49 />
      <Button50 />
      <Button51 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[231px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container60 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[231px] left-0 top-[464.5px] w-[1421px]" data-name="Table Row">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.8px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">7</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">nguyen văn a</p>
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

function Container63() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon80 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">ghfgh@vhv.vn</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container62 />
        <Container63 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container61 />
      <Container64 />
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container65 />
    </div>
  );
}

function Icon81() {
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

function Text28() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[26.5px] w-[188px]" data-name="Text">
      <Icon81 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý tài chính</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
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

function TableCell39() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function Icon82() {
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon82 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Icon83() {
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
        <Icon85 />
      </div>
    </div>
  );
}

function Icon86() {
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
        <Icon86 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button52 />
      <Button53 />
      <Button54 />
      <Button55 />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container66 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[695.5px] w-[1421px]" data-name="Table Row">
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
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.94px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">8</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">C</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">cửa hàng</p>
    </div>
  );
}

function Icon87() {
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

function Container69() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon87 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">cuahang@vhv.vn</p>
    </div>
  );
}

function Icon88() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container70() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon88 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0989898902</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container68 />
        <Container69 />
        <Container70 />
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container67 />
      <Container71 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container72 />
    </div>
  );
}

function Icon89() {
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

function Text31() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[188px]" data-name="Text">
      <Icon89 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cửa hàng</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[112px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text31 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[112px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text32 />
    </div>
  );
}

function Icon90() {
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

function Text33() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon90 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[112px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text33 />
    </div>
  );
}

function Icon91() {
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
        <Icon91 />
      </div>
    </div>
  );
}

function Icon92() {
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
        <Icon92 />
      </div>
    </div>
  );
}

function Icon93() {
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
        <Icon93 />
      </div>
    </div>
  );
}

function Icon94() {
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
        <Icon94 />
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[168px]" data-name="Container">
      <Button56 />
      <Button57 />
      <Button58 />
      <Button59 />
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[112px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container73 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[774.5px] w-[1421px]" data-name="Table Row">
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.92px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">9</p>
    </div>
  );
}

function Container74() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">K</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">khách hàng</p>
    </div>
  );
}

function Icon95() {
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

function Container76() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon95 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin666@vhv.vn</p>
    </div>
  );
}

function Icon96() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container77() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon96 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0976594507</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container75 />
        <Container76 />
        <Container77 />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container74 />
      <Container78 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container79 />
    </div>
  );
}

function Icon97() {
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

function Text34() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[188px]" data-name="Text">
      <Icon97 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người dùng</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[112px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text34 />
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[47.5px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[112px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text35 />
    </div>
  );
}

function Icon98() {
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

function Text36() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon98 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[112px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text36 />
    </div>
  );
}

function Icon99() {
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
        <Icon99 />
      </div>
    </div>
  );
}

function Icon100() {
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
        <Icon102 />
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[168px]" data-name="Container">
      <Button60 />
      <Button61 />
      <Button62 />
      <Button63 />
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[112px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container80 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[886.5px] w-[1421px]" data-name="Table Row">
      <TableCell48 />
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.5px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">10</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên Chi cục 02</p>
    </div>
  );
}

function Icon103() {
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

function Container83() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon103 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin777@vhv.vn</p>
    </div>
  );
}

function Icon104() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon104 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0123456789</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container82 />
        <Container83 />
        <Container84 />
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container81 />
      <Container85 />
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container86 />
    </div>
  );
}

function Icon105() {
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

function Text37() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[188px]" data-name="Text">
      <Icon105 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Cán bộ quản lý dữ liệu</p>
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[112px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text37 />
    </div>
  );
}

function Text38() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[169.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[170px]">ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 2</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[91px]">QT0102 • Cấp 3</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[24.5px] w-[188px]" data-name="Container">
      <Text38 />
      <Container87 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[112px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container88 />
    </div>
  );
}

function Icon106() {
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

function Text39() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon106 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[112px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text39 />
    </div>
  );
}

function Icon107() {
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
        <Icon107 />
      </div>
    </div>
  );
}

function Icon108() {
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
        <Icon110 />
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[168px]" data-name="Container">
      <Button64 />
      <Button65 />
      <Button66 />
      <Button67 />
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[112px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container89 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[998.5px] w-[1421px]" data-name="Table Row">
      <TableCell54 />
      <TableCell55 />
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.08px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">11</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 888</p>
    </div>
  );
}

function Icon111() {
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

function Container92() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon111 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">phuongdd@vhv.com</p>
    </div>
  );
}

function Container93() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container91 />
        <Container92 />
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container90 />
      <Container93 />
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container94 />
    </div>
  );
}

function Text40() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
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

function TableCell63() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text41 />
    </div>
  );
}

function Icon112() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2b283480} id="Vector" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pbc77700} id="Vector_2" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text42() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.1)] h-[26px] left-[28.47px] rounded-[12px] top-[26.5px] w-[83.047px]" data-name="Text">
      <Icon112 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[50.5px] not-italic text-[#dc2626] text-[12px] text-center top-[4px] translate-x-[-50%]">Đã khóa</p>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text42 />
    </div>
  );
}

function Icon113() {
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
        <Icon113 />
      </div>
    </div>
  );
}

function Icon114() {
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
        <Icon114 />
      </div>
    </div>
  );
}

function Icon115() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36aaca00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button70() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon115 />
      </div>
    </div>
  );
}

function Icon116() {
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
        <Icon116 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button68 />
      <Button69 />
      <Button70 />
      <Button71 />
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container95 />
    </div>
  );
}

function TableRow11() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1110.5px] w-[1421px]" data-name="Table Row">
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.16px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">12</p>
    </div>
  );
}

function Container96() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 999</p>
    </div>
  );
}

function Icon117() {
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

function Container98() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon117 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin999@vhv.vn</p>
    </div>
  );
}

function Container99() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container97 />
        <Container98 />
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container96 />
      <Container99 />
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container100 />
    </div>
  );
}

function Text43() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text43 />
    </div>
  );
}

function Text44() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text44 />
    </div>
  );
}

function Icon118() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2b283480} id="Vector" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pbc77700} id="Vector_2" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text45() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.1)] h-[26px] left-[28.47px] rounded-[12px] top-[26.5px] w-[83.047px]" data-name="Text">
      <Icon118 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[50.5px] not-italic text-[#dc2626] text-[12px] text-center top-[4px] translate-x-[-50%]">Đã khóa</p>
    </div>
  );
}

function TableCell70() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text45 />
    </div>
  );
}

function Icon119() {
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
        <Icon119 />
      </div>
    </div>
  );
}

function Icon120() {
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
        <Icon120 />
      </div>
    </div>
  );
}

function Icon121() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36aaca00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button74() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon121 />
      </div>
    </div>
  );
}

function Icon122() {
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
        <Icon122 />
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button72 />
      <Button73 />
      <Button74 />
      <Button75 />
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container101 />
    </div>
  );
}

function TableRow12() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1189.5px] w-[1421px]" data-name="Table Row">
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
      <TableCell70 />
      <TableCell71 />
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.59px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">13</p>
    </div>
  );
}

function Container102() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon123() {
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

function Container104() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon123 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">lamdd@vhv.vn</p>
    </div>
  );
}

function Container105() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container103 />
        <Container104 />
      </div>
    </div>
  );
}

function Container106() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container102 />
      <Container105 />
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container106 />
    </div>
  );
}

function Text46() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text46 />
    </div>
  );
}

function Text47() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text47 />
    </div>
  );
}

function Icon124() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2b283480} id="Vector" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pbc77700} id="Vector_2" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text48() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.1)] h-[26px] left-[28.47px] rounded-[12px] top-[26.5px] w-[83.047px]" data-name="Text">
      <Icon124 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[50.5px] not-italic text-[#dc2626] text-[12px] text-center top-[4px] translate-x-[-50%]">Đã khóa</p>
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text48 />
    </div>
  );
}

function Icon125() {
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
        <Icon125 />
      </div>
    </div>
  );
}

function Icon126() {
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
        <Icon126 />
      </div>
    </div>
  );
}

function Icon127() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36aaca00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button78() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon127 />
      </div>
    </div>
  );
}

function Icon128() {
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
        <Icon128 />
      </div>
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button76 />
      <Button77 />
      <Button78 />
      <Button79 />
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container107 />
    </div>
  );
}

function TableRow13() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1268.5px] w-[1421px]" data-name="Table Row">
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
      <TableCell77 />
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.39px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">14</p>
    </div>
  );
}

function Container108() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon129() {
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

function Container110() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon129 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">phuongdd@vhv.vn</p>
    </div>
  );
}

function Container111() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container109 />
        <Container110 />
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container108 />
      <Container111 />
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container112 />
    </div>
  );
}

function Text49() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text49 />
    </div>
  );
}

function Text50() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text50 />
    </div>
  );
}

function Icon130() {
  return (
    <div className="absolute left-[10px] size-[12px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2b283480} id="Vector" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pbc77700} id="Vector_2" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Text51() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.1)] h-[26px] left-[28.47px] rounded-[12px] top-[26.5px] w-[83.047px]" data-name="Text">
      <Icon130 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[50.5px] not-italic text-[#dc2626] text-[12px] text-center top-[4px] translate-x-[-50%]">Đã khóa</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text51 />
    </div>
  );
}

function Icon131() {
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
        <Icon131 />
      </div>
    </div>
  );
}

function Icon132() {
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
        <Icon132 />
      </div>
    </div>
  );
}

function Icon133() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p36aaca00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button82() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon133 />
      </div>
    </div>
  );
}

function Icon134() {
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
        <Icon134 />
      </div>
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button80 />
      <Button81 />
      <Button82 />
      <Button83 />
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container113 />
    </div>
  );
}

function TableRow14() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1347.5px] w-[1421px]" data-name="Table Row">
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
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.77px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">15</p>
    </div>
  );
}

function Container114() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon135() {
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

function Container116() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon135 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin3555511@vhv.vn</p>
    </div>
  );
}

function Container117() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container115 />
        <Container116 />
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container114 />
      <Container117 />
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container118 />
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text52 />
    </div>
  );
}

function Text53() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text53 />
    </div>
  );
}

function Icon136() {
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon136 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text54 />
    </div>
  );
}

function Icon137() {
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
        <Icon139 />
      </div>
    </div>
  );
}

function Icon140() {
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
        <Icon140 />
      </div>
    </div>
  );
}

function Container119() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button84 />
      <Button85 />
      <Button86 />
      <Button87 />
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container119 />
    </div>
  );
}

function TableRow15() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1426.5px] w-[1421px]" data-name="Table Row">
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <TableCell88 />
      <TableCell89 />
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.58px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">16</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322111</p>
    </div>
  );
}

function Icon141() {
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

function Container122() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon141 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin32111@vhv.vn</p>
    </div>
  );
}

function Container123() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container121 />
        <Container122 />
      </div>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container120 />
      <Container123 />
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container124 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text55 />
    </div>
  );
}

function Text56() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text56 />
    </div>
  );
}

function Icon142() {
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

function Text57() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon142 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text57 />
    </div>
  );
}

function Icon143() {
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
        <Icon143 />
      </div>
    </div>
  );
}

function Icon144() {
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
        <Icon146 />
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button88 />
      <Button89 />
      <Button90 />
      <Button91 />
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container125 />
    </div>
  );
}

function TableRow16() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1505.5px] w-[1421px]" data-name="Table Row">
      <TableCell90 />
      <TableCell91 />
      <TableCell92 />
      <TableCell93 />
      <TableCell94 />
      <TableCell95 />
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.45px] not-italic text-[#101828] text-[14px] text-center top-[29px] translate-x-[-50%]">17</p>
    </div>
  );
}

function Container126() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Q</p>
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên 322</p>
    </div>
  );
}

function Icon147() {
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

function Container128() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon147 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin32@vhv.vn</p>
    </div>
  );
}

function Container129() {
  return (
    <div className="flex-[1_0_0] h-[54px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container127 />
        <Container128 />
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container126 />
      <Container129 />
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute h-[79px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container130 />
    </div>
  );
}

function Text58() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell98() {
  return (
    <div className="absolute h-[79px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text58 />
    </div>
  );
}

function Text59() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[31px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell99() {
  return (
    <div className="absolute h-[79px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text59 />
    </div>
  );
}

function Icon148() {
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

function Text60() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[26.5px] w-[95.609px]" data-name="Text">
      <Icon148 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell100() {
  return (
    <div className="absolute h-[79px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text60 />
    </div>
  );
}

function Icon149() {
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
        <Icon149 />
      </div>
    </div>
  );
}

function Icon150() {
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
        <Icon152 />
      </div>
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[23.5px] w-[168px]" data-name="Container">
      <Button92 />
      <Button93 />
      <Button94 />
      <Button95 />
    </div>
  );
}

function TableCell101() {
  return (
    <div className="absolute h-[79px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container131 />
    </div>
  );
}

function TableRow17() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[79px] left-0 top-[1584.5px] w-[1421px]" data-name="Table Row">
      <TableCell96 />
      <TableCell97 />
      <TableCell98 />
      <TableCell99 />
      <TableCell100 />
      <TableCell101 />
    </div>
  );
}

function TableCell102() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.59px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">18</p>
    </div>
  );
}

function Container132() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">Đ</p>
      </div>
    </div>
  );
}

function Container133() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Đặng Đình Phương</p>
    </div>
  );
}

function Icon153() {
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

function Container134() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon153 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin3@vhv.vn</p>
    </div>
  );
}

function Icon154() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container135() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon154 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">0976594507</p>
    </div>
  );
}

function Container136() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container133 />
        <Container134 />
        <Container135 />
      </div>
    </div>
  );
}

function Container137() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container132 />
      <Container136 />
    </div>
  );
}

function TableCell103() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container137 />
    </div>
  );
}

function Icon155() {
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

function Text61() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[188px]" data-name="Text">
      <Icon155 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Người dùng</p>
    </div>
  );
}

function TableCell104() {
  return (
    <div className="absolute h-[112px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text61 />
    </div>
  );
}

function Text62() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[180.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[181px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[76px]">QT01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container139() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[24.5px] w-[188px]" data-name="Container">
      <Text62 />
      <Container138 />
    </div>
  );
}

function TableCell105() {
  return (
    <div className="absolute h-[112px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container139 />
    </div>
  );
}

function Icon156() {
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

function Text63() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon156 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell106() {
  return (
    <div className="absolute h-[112px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text63 />
    </div>
  );
}

function Icon157() {
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
        <Icon159 />
      </div>
    </div>
  );
}

function Icon160() {
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
        <Icon160 />
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[168px]" data-name="Container">
      <Button96 />
      <Button97 />
      <Button98 />
      <Button99 />
    </div>
  );
}

function TableCell107() {
  return (
    <div className="absolute h-[112px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container140 />
    </div>
  );
}

function TableRow18() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[1663.5px] w-[1421px]" data-name="Table Row">
      <TableCell102 />
      <TableCell103 />
      <TableCell104 />
      <TableCell105 />
      <TableCell106 />
      <TableCell107 />
    </div>
  );
}

function TableCell108() {
  return (
    <div className="absolute h-[112px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[28.58px] not-italic text-[#101828] text-[14px] text-center top-[45.5px] translate-x-[-50%]">19</p>
    </div>
  );
}

function Container141() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">N</p>
      </div>
    </div>
  );
}

function Container142() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Nguyễn Văn Bình</p>
    </div>
  );
}

function Icon161() {
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

function Container143() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon161 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">admin2@vhv.vn</p>
    </div>
  );
}

function Icon162() {
  return (
    <div className="absolute left-0 size-[12px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_2474_3249)" id="Icon">
          <path d={svgPaths.p32bcae00} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3249">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container144() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Container">
      <Icon162 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">098989898</p>
    </div>
  );
}

function Container145() {
  return (
    <div className="flex-[1_0_0] h-[87px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container142 />
        <Container143 />
        <Container144 />
      </div>
    </div>
  );
}

function Container146() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[87px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container141 />
      <Container145 />
    </div>
  );
}

function TableCell109() {
  return (
    <div className="absolute h-[112px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container146 />
    </div>
  );
}

function Icon163() {
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
    <div className="absolute bg-[rgba(0,92,182,0.1)] h-[26px] left-[16px] rounded-[12px] top-[43px] w-[188px]" data-name="Text">
      <Icon163 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[22px] not-italic text-[#005cb6] text-[12px] top-[4px]">Quản lý thị trường</p>
    </div>
  );
}

function TableCell110() {
  return (
    <div className="absolute h-[112px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text64 />
    </div>
  );
}

function Text65() {
  return (
    <div className="h-[37.5px] relative shrink-0 w-[180.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-[-1px] w-[181px]">Chi cục quản lý thị trường Hà Nội</p>
      </div>
    </div>
  );
}

function Container147() {
  return (
    <div className="h-[18px] relative shrink-0 w-[188px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0 w-[76px]">QT01 • Cấp 2</p>
      </div>
    </div>
  );
}

function Container148() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4.5px] h-[63px] items-start left-[16px] pb-0 pt-[3px] px-0 top-[24.5px] w-[188px]" data-name="Container">
      <Text65 />
      <Container147 />
    </div>
  );
}

function TableCell111() {
  return (
    <div className="absolute h-[112px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Container148 />
    </div>
  );
}

function Icon164() {
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
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[43px] w-[95.609px]" data-name="Text">
      <Icon164 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell112() {
  return (
    <div className="absolute h-[112px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text66 />
    </div>
  );
}

function Icon165() {
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
        <Icon165 />
      </div>
    </div>
  );
}

function Icon166() {
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
        <Icon166 />
      </div>
    </div>
  );
}

function Icon167() {
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
        <Icon167 />
      </div>
    </div>
  );
}

function Icon168() {
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
        <Icon168 />
      </div>
    </div>
  );
}

function Container149() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[40px] w-[168px]" data-name="Container">
      <Button100 />
      <Button101 />
      <Button102 />
      <Button103 />
    </div>
  );
}

function TableCell113() {
  return (
    <div className="absolute h-[112px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container149 />
    </div>
  );
}

function TableRow19() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[112px] left-0 top-[1775.5px] w-[1421px]" data-name="Table Row">
      <TableCell108 />
      <TableCell109 />
      <TableCell110 />
      <TableCell111 />
      <TableCell112 />
      <TableCell113 />
    </div>
  );
}

function TableCell114() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[57.547px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[29.08px] not-italic text-[#101828] text-[14px] text-center top-[20px] translate-x-[-50%]">20</p>
    </div>
  );
}

function Container150() {
  return (
    <div className="relative rounded-[18px] shrink-0 size-[36px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-white">U</p>
      </div>
    </div>
  );
}

function Icon169() {
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

function Container151() {
  return (
    <div className="flex-[1_0_0] h-[33px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon169 />
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[12px]">hieplv.37@gmail.com</p>
      </div>
    </div>
  );
}

function Container152() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[36px] items-center left-[16px] top-[12.5px] w-[551.453px]" data-name="Container">
      <Container150 />
      <Container151 />
    </div>
  );
}

function TableCell115() {
  return (
    <div className="absolute h-[61px] left-[57.55px] top-0 w-[583.453px]" data-name="Table Cell">
      <Container152 />
    </div>
  );
}

function Text67() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[22px] w-[100.313px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa có vai trò</p>
    </div>
  );
}

function TableCell116() {
  return (
    <div className="absolute h-[61px] left-[641px] top-0 w-[220px]" data-name="Table Cell">
      <Text67 />
    </div>
  );
}

function Text68() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[22px] w-[92.875px]" data-name="Text">
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px]">Chưa phân bộ</p>
    </div>
  );
}

function TableCell117() {
  return (
    <div className="absolute h-[61px] left-[861px] top-0 w-[220px]" data-name="Table Cell">
      <Text68 />
    </div>
  );
}

function Icon170() {
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

function Text69() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.1)] h-[26px] left-[22.19px] rounded-[12px] top-[17.5px] w-[95.609px]" data-name="Text">
      <Icon170 />
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[56px] not-italic text-[#059669] text-[12px] text-center top-[4px] translate-x-[-50%]">Hoạt động</p>
    </div>
  );
}

function TableCell118() {
  return (
    <div className="absolute h-[61px] left-[1081px] top-0 w-[140px]" data-name="Table Cell">
      <Text69 />
    </div>
  );
}

function Icon171() {
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
        <Icon171 />
      </div>
    </div>
  );
}

function Icon172() {
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
        <Icon172 />
      </div>
    </div>
  );
}

function Icon173() {
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
        <Icon173 />
      </div>
    </div>
  );
}

function Icon174() {
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
        <Icon174 />
      </div>
    </div>
  );
}

function Container153() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[32px] items-start justify-end left-[16px] top-[14.5px] w-[168px]" data-name="Container">
      <Button104 />
      <Button105 />
      <Button106 />
      <Button107 />
    </div>
  );
}

function TableCell119() {
  return (
    <div className="absolute h-[61px] left-[1221px] top-0 w-[200px]" data-name="Table Cell">
      <Container153 />
    </div>
  );
}

function TableRow20() {
  return (
    <div className="absolute border-[#d0d5dd] border-b border-solid h-[61px] left-0 top-[1887.5px] w-[1421px]" data-name="Table Row">
      <TableCell114 />
      <TableCell115 />
      <TableCell116 />
      <TableCell117 />
      <TableCell118 />
      <TableCell119 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[1948.5px] left-0 top-[44.5px] w-[1421px]" data-name="Table Body">
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
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-[1421px]" data-name="Table">
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
    <div className="absolute content-stretch flex h-[17px] items-start left-[207.81px] top-[2px] w-[18.484px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px]">30</p>
    </div>
  );
}

function Container154() {
  return (
    <div className="absolute h-[21px] left-[20px] top-[41.75px] w-[305.156px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0">Hiển thị</p>
      <BoldText />
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[60.41px] not-italic text-[#667085] text-[14px] top-0 w-[33px]">đến</p>
      <BoldText1 />
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[111.56px] not-italic text-[#667085] text-[14px] top-0 w-[97px]">trong tổng số</p>
      <BoldText2 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-[226.3px] not-italic text-[#667085] text-[14px] top-0">người dùng</p>
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
    <div className="absolute content-stretch flex h-[16px] items-start left-[175.34px] top-px w-[16.859px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#101828] text-[13px]">30</p>
    </div>
  );
}

function Container155() {
  return (
    <div className="absolute h-[19.5px] left-[16px] top-[25px] w-[241.266px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0">Hiển thị</p>
      <BoldText3 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[55.98px] not-italic text-[#667085] text-[13px] top-0">-</p>
      <BoldText4 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[85.97px] not-italic text-[#667085] text-[13px] top-0">trong tổng số</p>
      <BoldText5 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[192.2px] not-italic text-[#667085] text-[13px] top-0">bản ghi</p>
    </div>
  );
}

function Icon175() {
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
        <Icon175 />
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

function Container156() {
  return (
    <div className="h-[36px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Button109 />
        <Button110 />
      </div>
    </div>
  );
}

function Icon176() {
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
        <Icon176 />
      </div>
    </div>
  );
}

function Container157() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[37.5px] items-center left-[273.27px] top-[16px] w-[243.938px]" data-name="Container">
      <Button108 />
      <Container156 />
      <Button111 />
    </div>
  );
}

function Pagination() {
  return (
    <div className="absolute bg-white border-[#d0d5dd] border-solid border-t h-[70.5px] left-[867.8px] top-[17px] w-[533.203px]" data-name="Pagination">
      <Container155 />
      <Container157 />
    </div>
  );
}

function Container158() {
  return (
    <div className="bg-white h-[103.5px] relative shrink-0 w-[1421px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container154 />
        <Pagination />
      </div>
    </div>
  );
}

function UserListTabNew() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1421px]" data-name="UserListTabNew">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container10 />
        <Table />
        <Container158 />
      </div>
    </div>
  );
}

function Container159() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1423px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container6 />
        <UserListTabNew />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[2511.5px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
        <Container159 />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[2631.5px] items-start left-0 top-0 w-[1471px]" data-name="MainLayout">
      <TopUtilityBar3 />
      <HorizontalNavBar />
      <AdminPage />
    </div>
  );
}

function Icon177() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container160() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(139, 92, 246) 0%, rgb(168, 85, 247) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon177 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] left-0 not-italic text-[#101828] text-[20px] top-0">Thêm người dùng mới</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#667085] text-[12px] top-0">Điền thông tin để tạo tài khoản mới</p>
    </div>
  );
}

function Container161() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container162() {
  return (
    <div className="h-[52px] relative shrink-0 w-[262.297px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container160 />
        <Container161 />
      </div>
    </div>
  );
}

function Icon178() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M13.5 4.5L4.5 13.5" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M4.5 4.5L13.5 13.5" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button112() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon178 />
      </div>
    </div>
  );
}

function Container163() {
  return (
    <div className="h-[97px] relative shrink-0 w-[600px]" data-name="Container" style={{ backgroundImage: "linear-gradient(170.817deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)" }}>
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px pt-0 px-[24px] relative size-full">
        <Container162 />
        <Button112 />
      </div>
    </div>
  );
}

function Icon179() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p5c184f0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2a640080} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text70() {
  return (
    <div className="absolute h-[21px] left-[61.89px] top-0 w-[7.297px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#ef4444] text-[14px] top-0">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[21px] relative shrink-0 w-[260.5px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon179 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Email</p>
        <Text70 />
      </div>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[260.5px]" data-name="Email Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[12px] py-0 relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(16,24,40,0.5)]">user@example.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container164() {
  return (
    <div className="col-[1] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label />
      <EmailInput />
    </div>
  );
}

function Icon180() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p100e7280} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p38a00300} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text71() {
  return (
    <div className="absolute h-[21px] left-[89.53px] top-0 w-[7.297px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#ef4444] text-[14px] top-0">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[260.5px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon180 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Họ và tên</p>
        <Text71 />
      </div>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[260.5px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[12px] py-0 relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(16,24,40,0.5)]">Nguyễn Văn A</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container165() {
  return (
    <div className="col-[2] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[1] self-stretch shrink-0" data-name="Container">
      <Label1 />
      <TextInput2 />
    </div>
  );
}

function Container166() {
  return (
    <div className="col-[1] css-wcqtbl gap-[16px] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] relative row-[1] self-stretch shrink-0" data-name="Container">
      <Container164 />
      <Container165 />
    </div>
  );
}

function Icon181() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2474_3184)" id="Icon">
          <path d={svgPaths.p2c04e800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2474_3184">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[537px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon181 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Số điện thoại</p>
      </div>
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[537px]" data-name="Phone Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[12px] py-0 relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(16,24,40,0.5)]">0912345678</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container167() {
  return (
    <div className="col-[1] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[2] self-stretch shrink-0" data-name="Container">
      <Label2 />
      <PhoneInput />
    </div>
  );
}

function Icon182() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[537px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon182 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Bộ phận / Phòng ban</p>
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">-- Chọn bộ phận --</p>
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
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ Chi cục quản lý thị trường Hà Nội (QT01)</p>
    </div>
  );
}

function Option3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 1 (QT0101)</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 2 (QT0102)</p>
    </div>
  );
}

function Option5() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 3 (QT0103)</p>
    </div>
  );
}

function Option6() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 4 (QT0104)</p>
    </div>
  );
}

function Option7() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 5 (QT0105)</p>
    </div>
  );
}

function Option8() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 6 (QT0106)</p>
    </div>
  );
}

function Option9() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 7 (QT0107)</p>
    </div>
  );
}

function Option10() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 8 (QT0108)</p>
    </div>
  );
}

function Option11() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 9 (QT0109)</p>
    </div>
  );
}

function Option12() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 10 (QT0110)</p>
    </div>
  );
}

function Option13() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 11 (QT0111)</p>
    </div>
  );
}

function Option14() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 12 (QT0112)</p>
    </div>
  );
}

function Option15() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 13 (QT0113)</p>
    </div>
  );
}

function Option16() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 14 (QT0114)</p>
    </div>
  );
}

function Option17() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 15 (QT0115)</p>
    </div>
  );
}

function Option18() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 16 (QT0116)</p>
    </div>
  );
}

function Option19() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 17 (QT0117)</p>
    </div>
  );
}

function Option20() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 18 (QT0118)</p>
    </div>
  );
}

function Option21() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 19 (QT0119)</p>
    </div>
  );
}

function Option22() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 20 (QT0120)</p>
    </div>
  );
}

function Option23() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 21 (QT0121)</p>
    </div>
  );
}

function Option24() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 22 (QT0122)</p>
    </div>
  );
}

function Option25() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 23 (QT0123)</p>
    </div>
  );
}

function Option26() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 24 (QT0124)</p>
    </div>
  );
}

function Option27() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 25 (QT0125)</p>
    </div>
  );
}

function Option28() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 26 (QT0126)</p>
    </div>
  );
}

function Option29() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute css-4hzbpn font-['Inter:Regular','Noto_Sans_Math:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0">├─ ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ 27 (QT0127)</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[537px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pl-[-459.5px] pr-[996.5px] pt-[-363.594px] relative size-full">
        <Option />
        <Option1 />
        <Option2 />
        <Option3 />
        <Option4 />
        <Option5 />
        <Option6 />
        <Option7 />
        <Option8 />
        <Option9 />
        <Option10 />
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
      </div>
    </div>
  );
}

function Container168() {
  return (
    <div className="col-[1] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[3] self-stretch shrink-0" data-name="Container">
      <Label3 />
      <Dropdown />
    </div>
  );
}

function Icon183() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd04fc00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text72() {
  return (
    <div className="absolute h-[21px] left-[68.77px] top-0 w-[7.297px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#ef4444] text-[14px] top-0">*</p>
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[537px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon183 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Vai trò</p>
        <Text72 />
      </div>
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text73() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Cán bộ cấp Chi Cục quản lý</p>
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox />
        <Text73 />
      </div>
    </div>
  );
}

function Checkbox1() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text74() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Cán bộ cấp Cục Quản Lý</p>
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox1 />
        <Text74 />
      </div>
    </div>
  );
}

function Checkbox2() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text75() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Cán bộ Cấp Đội</p>
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox2 />
        <Text75 />
      </div>
    </div>
  );
}

function Checkbox3() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text76() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Cán bộ quản lý dữ liệu</p>
      </div>
    </div>
  );
}

function Label8() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox3 />
        <Text76 />
      </div>
    </div>
  );
}

function Checkbox4() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text77() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Cửa hàng</p>
      </div>
    </div>
  );
}

function Label9() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox4 />
        <Text77 />
      </div>
    </div>
  );
}

function Checkbox5() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text78() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Người dùng</p>
      </div>
    </div>
  );
}

function Label10() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox5 />
        <Text78 />
      </div>
    </div>
  );
}

function Checkbox6() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text79() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Người xem</p>
      </div>
    </div>
  );
}

function Label11() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox6 />
        <Text79 />
      </div>
    </div>
  );
}

function Checkbox7() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text80() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản lý tài chính</p>
      </div>
    </div>
  );
}

function Label12() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox7 />
        <Text80 />
      </div>
    </div>
  );
}

function Checkbox8() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text81() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản lý thị trường</p>
      </div>
    </div>
  );
}

function Label13() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox8 />
        <Text81 />
      </div>
    </div>
  );
}

function Checkbox9() {
  return <div className="shrink-0 size-[18px]" data-name="Checkbox" />;
}

function Text82() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Quản trị viên</p>
      </div>
    </div>
  );
}

function Label14() {
  return (
    <div className="h-[37px] relative rounded-[6px] shrink-0 w-[496px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-0 relative size-full">
        <Checkbox9 />
        <Text82 />
      </div>
    </div>
  );
}

function Container169() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[537px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start overflow-clip pb-px pl-[13px] pr-px pt-[13px] relative rounded-[inherit] size-full">
        <Label5 />
        <Label6 />
        <Label7 />
        <Label8 />
        <Label9 />
        <Label10 />
        <Label11 />
        <Label12 />
        <Label13 />
        <Label14 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container170() {
  return (
    <div className="col-[1] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[4] self-stretch shrink-0" data-name="Container">
      <Label4 />
      <Container169 />
    </div>
  );
}

function Icon184() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1aca3780} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b92b800} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Label15() {
  return (
    <div className="h-[21px] relative shrink-0 w-[537px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon184 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[20px] not-italic text-[#101828] text-[14px] top-0">Trạng thái tài khoản</p>
      </div>
    </div>
  );
}

function Text83() {
  return (
    <div className="absolute h-[21px] left-[69px] top-[14.5px] w-[69.547px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Hoạt động</p>
    </div>
  );
}

function Container171() {
  return <div className="bg-white h-[20px] rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2)] shrink-0 w-full" data-name="Container" />;
}

function Container172() {
  return (
    <div className="absolute content-stretch flex flex-col h-[24px] items-start left-[13px] pb-0 pl-[22px] pr-[2px] pt-[2px] rounded-[12px] top-[13px] w-[44px]" data-name="Container" style={{ backgroundImage: "linear-gradient(151.39deg, rgb(139, 92, 246) 0%, rgb(168, 85, 247) 100%)" }}>
      <Container171 />
    </div>
  );
}

function Container173() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[537px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text83 />
        <Container172 />
      </div>
    </div>
  );
}

function Container174() {
  return (
    <div className="col-[1] content-stretch css-vsca90 flex flex-col gap-[8px] items-start relative row-[5] self-stretch shrink-0" data-name="Container">
      <Label15 />
      <Container173 />
    </div>
  );
}

function Icon185() {
  return (
    <div className="absolute left-[13px] size-[16px] top-[15px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function BoldText6() {
  return (
    <div className="absolute content-stretch flex h-[15px] items-start left-[114.53px] top-[2px] w-[78.594px]" data-name="Bold Text">
      <p className="css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[19.2px] not-italic relative shrink-0 text-[#101828] text-[12px]">Couppa@123</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[38.375px] left-[39px] top-[13px] w-[326.516px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[#101828] text-[12px] top-0">Mật khẩu mặc định:</p>
      <BoldText6 />
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[19.2px] left-0 not-italic text-[#101828] text-[12px] top-[19.19px]">Người dùng nên đổi mật khẩu sau lần đăng nhập đầu tiên.</p>
    </div>
  );
}

function Container175() {
  return (
    <div className="bg-[rgba(139,92,246,0.08)] col-[1] css-3foyfs relative rounded-[8px] row-[6] self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(139,92,246,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon185 />
      <Paragraph2 />
    </div>
  );
}

function Form() {
  return (
    <div className="gap-[20px] grid grid-cols-[repeat(1,_minmax(0,_1fr))] grid-rows-[______minmax(0,_69fr)_minmax(0,_69fr)_minmax(0,_69fr)_minmax(0,_229fr)_minmax(0,_79fr)_minmax(0,_1fr)] h-[679.375px] relative shrink-0 w-full" data-name="Form">
      <Container166 />
      <Container167 />
      <Container168 />
      <Container170 />
      <Container174 />
      <Container175 />
    </div>
  );
}

function Container176() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[600px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pb-0 pl-[24px] pr-[39px] pt-[24px] relative rounded-[inherit] size-full">
        <Form />
      </div>
    </div>
  );
}

function Button113() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-[68.906px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[21px] py-px relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center">Hủy</p>
      </div>
    </div>
  );
}

function Icon186() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[12px]" data-name="Icon">
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
    <div className="h-[40px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(139,92,246,0.1)] shrink-0 w-[170.031px]" data-name="Button" style={{ backgroundImage: "linear-gradient(166.762deg, rgb(139, 92, 246) 0%, rgb(168, 85, 247) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon186 />
        <p className="absolute css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[97px] not-italic text-[14px] text-center text-white top-[9.5px] translate-x-[-50%]">Tạo người dùng</p>
      </div>
    </div>
  );
}

function Container177() {
  return (
    <div className="bg-[#f2f4f7] h-[73px] relative shrink-0 w-[600px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center justify-end pb-0 pl-0 pr-[24px] pt-px relative size-full">
        <Button113 />
        <Button114 />
      </div>
    </div>
  );
}

function Container178() {
  return (
    <div className="bg-white h-[775.797px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06),0px_20px_24px_-4px_rgba(16,24,40,0.1)] shrink-0 w-[600px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container163 />
        <Container176 />
        <Container177 />
      </div>
    </div>
  );
}

function UserModal() {
  return (
    <div className="absolute bg-[rgba(16,24,40,0.5)] content-stretch flex h-[847px] items-center justify-center left-0 top-0 w-[1471px]" data-name="UserModal">
      <Container178 />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <MainLayout />
      <UserModal />
    </div>
  );
}
