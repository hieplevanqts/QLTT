import svgPaths from "./svg-cbr7e0dcog";
import imgImageMappaLogo from "figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png";

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
    <div className="absolute h-[40px] left-[174.75px] top-[11.5px] w-[576px]" data-name="GlobalSearch">
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

function Button() {
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
        <g clipPath="url(#clip0_2269_2157)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc878d80} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2157">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
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

function Button2() {
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

function Button3() {
  return (
    <div className="absolute left-[97.75px] rounded-[6px] size-[36px] top-0" data-name="Button">
      <Icon4 />
      <TopUtilityBar2 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[36px] left-[1068.25px] top-[13.5px] w-[185.75px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function TopUtilityBar3() {
  return (
    <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="TopUtilityBar">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <GlobalSearch />
      <Container />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[61.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#667085] text-[13px] top-0 whitespace-pre">Trang chủ</p>
      </div>
    </div>
  );
}

function Icon5() {
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

function Text1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[49.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#101828] text-[13px] top-0 whitespace-pre">Quản trị</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[1230px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text />
        <Icon5 />
        <Text1 />
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

function Container2() {
  return (
    <div className="h-[69px] relative shrink-0 w-[494.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon6() {
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

function Button4() {
  return (
    <div className="h-[46.5px] relative rounded-[6px] shrink-0 w-[323.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon6 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[176.5px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%] whitespace-pre">{`Quản trị Người dùng & Phân quyền`}</p>
      </div>
    </div>
  );
}

function Icon7() {
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

function Button5() {
  return (
    <div className="bg-[#005cb6] h-[46.5px] relative rounded-[6px] shrink-0 w-[230.625px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon7 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[129.5px] not-italic text-[15px] text-center text-white top-[10px] translate-x-[-50%] whitespace-pre">{`Danh mục & Cấu hình`}</p>
      </div>
    </div>
  );
}

function Icon8() {
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

function Button6() {
  return (
    <div className="h-[46.5px] relative rounded-[6px] shrink-0 w-[280.719px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon8 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[22.5px] left-[154px] not-italic text-[#667085] text-[15px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Audit – Giám sát – Tình trạng</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white h-[72.5px] relative rounded-[8px] shrink-0 w-[1230px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start overflow-clip pb-px pl-[13px] pr-px pt-[13px] relative rounded-[inherit] size-full">
        <Button4 />
        <Button5 />
        <Button6 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon9() {
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

function Button7() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[196.438px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon9 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[110px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Danh mục dùng chung</p>
      </div>
    </div>
  );
}

function Icon10() {
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

function Button8() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[195.563px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[110.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Cấu hình chỉ báo rủi ro</p>
      </div>
    </div>
  );
}

function Icon11() {
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

function Button9() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[213.391px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[119px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Checklist theo chuyên đề</p>
      </div>
    </div>
  );
}

function Icon12() {
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

function Button10() {
  return (
    <div className="h-[35.5px] relative rounded-[6px] shrink-0 w-[170.266px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon12 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[97.5px] not-italic text-[#667085] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Thiết lập biểu mẫu</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[9.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white h-[35.5px] relative rounded-[6px] shrink-0 w-[171.313px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon13 />
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[98px] not-italic text-[#005cb6] text-[13px] text-center top-[8px] translate-x-[-50%] whitespace-pre">Quy tắc thông báo</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[59.5px] relative shrink-0 w-[1228px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-start overflow-clip pb-0 pl-[12px] pr-0 pt-[12px] relative rounded-[inherit] size-full">
        <Button7 />
        <Button8 />
        <Button9 />
        <Button10 />
        <Button11 />
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả loại sự kiện</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">SLA vượt ngưỡng</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Lead nhạy cảm</p>
    </div>
  );
}

function Option3() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Dữ liệu master thay đổi</p>
    </div>
  );
}

function Option4() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Xuất dữ liệu thất bại</p>
    </div>
  );
}

function Option5() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Truy vấn audit</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[770px] pb-px pl-[-1072px] pr-[1292px] pt-[-91.5px] rounded-[8px] top-px w-[220px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
    </div>
  );
}

function Option6() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả kênh</p>
    </div>
  );
}

function Option7() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Push</p>
    </div>
  );
}

function Option8() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Email</p>
    </div>
  );
}

function Option9() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">System</p>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[1006px] pb-px pl-[-1308px] pr-[1488px] pt-[-91.5px] rounded-[8px] top-px w-[180px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option6 />
      <Option7 />
      <Option8 />
      <Option9 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[43px] left-0 rounded-[8px] top-0 w-[754px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[42px] pr-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Tìm kiếm theo mã, tên, mô tả...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon14() {
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

function Container5() {
  return (
    <div className="absolute h-[43px] left-0 top-0 w-[754px]" data-name="Container">
      <TextInput1 />
      <Icon14 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Container">
      <Dropdown />
      <Dropdown1 />
      <Container5 />
    </div>
  );
}

function Option10() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả trạng thái</p>
    </div>
  );
}

function Option11() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function Option12() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Vô hiệu</p>
    </div>
  );
}

function Dropdown2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-0 pb-px pl-[-302px] pr-[482px] pt-[-146.5px] rounded-[8px] top-px w-[180px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option10 />
      <Option11 />
      <Option12 />
    </div>
  );
}

function Option13() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả phạm vi</p>
    </div>
  );
}

function Option14() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Đơn vị riêng</p>
    </div>
  );
}

function Option15() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Đơn vị</p>
    </div>
  );
}

function Option16() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Cấp tỉnh</p>
    </div>
  );
}

function Option17() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Toàn hệ thống</p>
    </div>
  );
}

function Option18() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Theo người tạo</p>
    </div>
  );
}

function Dropdown3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[196px] pb-px pl-[-498px] pr-[698px] pt-[-146.5px] rounded-[8px] top-px w-[200px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option13 />
      <Option14 />
      <Option15 />
      <Option16 />
      <Option17 />
      <Option18 />
    </div>
  );
}

function Option19() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Tất cả vai trò</p>
    </div>
  );
}

function Option20() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Supervisor</p>
    </div>
  );
}

function Option21() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Analyst</p>
    </div>
  );
}

function Option22() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Reporter</p>
    </div>
  );
}

function Option23() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Admin</p>
    </div>
  );
}

function Option24() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">IT</p>
    </div>
  );
}

function Option25() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-0 not-italic text-[#101828] text-[14px] top-0 w-0 whitespace-pre-wrap">Director</p>
    </div>
  );
}

function Dropdown4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[41px] items-start left-[412px] pb-px pl-[-714px] pr-[894px] pt-[-146.5px] rounded-[8px] top-px w-[180px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Option19 />
      <Option20 />
      <Option21 />
      <Option22 />
      <Option23 />
      <Option24 />
      <Option25 />
    </div>
  );
}

function Icon15() {
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

function Button12() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-0 rounded-[8px] top-0 w-[101.641px]" data-name="Button">
      <Icon15 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[63.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Reset</p>
    </div>
  );
}

function Icon16() {
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

function Button13() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-[113.64px] rounded-[8px] top-0 w-[134.453px]" data-name="Button">
      <Icon16 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[79.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Xuất Excel</p>
    </div>
  );
}

function Icon17() {
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

function Button14() {
  return (
    <div className="absolute bg-[#005cb6] h-[43px] left-[440.39px] rounded-[8px] top-0 w-[128.344px]" data-name="Button">
      <Icon17 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[77.5px] not-italic text-[14px] text-center text-white top-[11px] translate-x-[-50%] whitespace-pre">Thêm mới</p>
    </div>
  );
}

function Icon18() {
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

function Icon19() {
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

function Button15() {
  return (
    <div className="absolute bg-white border border-[#d0d5dd] border-solid h-[43px] left-[260.09px] rounded-[8px] top-0 w-[168.297px]" data-name="Button">
      <Icon18 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[84.5px] not-italic text-[#344054] text-[14px] text-center top-[10px] translate-x-[-50%] whitespace-pre">Nhập dữ liệu</p>
      <Icon19 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[43px] left-[617.27px] top-0 w-[568.734px]" data-name="Container">
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Container">
      <Dropdown2 />
      <Dropdown3 />
      <Dropdown4 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white h-[140px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[21px] px-[21px] relative size-full">
        <Container6 />
        <Container8 />
      </div>
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[78.5px] left-0 top-0 w-[197.953px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Mã Quy Tắc</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[78.5px] left-[197.95px] top-0 w-[84.188px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[12px] tracking-[0.5px] uppercase w-[29px] whitespace-pre-wrap">Tên Quy Tắc</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[78.5px] left-[282.14px] top-0 w-[154.234px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Loại Sự Kiện</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[78.5px] left-[436.38px] top-0 w-[156.625px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Vai Trò Nhận</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute h-[78.5px] left-[593px] top-0 w-[116.828px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Phạm Vi</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute h-[78.5px] left-[709.83px] top-0 w-[118.031px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Kênh</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute h-[78.5px] left-[827.86px] top-0 w-[115.391px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Trạng Thái</p>
    </div>
  );
}

function HeaderCell7() {
  return (
    <div className="absolute h-[78.5px] left-[943.25px] top-0 w-[106.047px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Ưu Tiên</p>
    </div>
  );
}

function HeaderCell8() {
  return (
    <div className="absolute h-[78.5px] left-[1049.3px] top-0 w-[176.703px]" data-name="Header Cell">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[16px] not-italic text-[#667085] text-[12px] top-[30px] tracking-[0.5px] uppercase whitespace-pre">Thao Tác</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute h-[78.5px] left-0 top-0 w-[1226px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
      <HeaderCell7 />
      <HeaderCell8 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute bg-[#f2f4f7] border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[78.5px] left-0 top-0 w-[1226px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function Code() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[78px] w-[112.078px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">SLA_RISK_HIGH</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[176px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[147px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[53px] whitespace-pre-wrap">Cảnh báo SLA vượt ngưỡng nguy hiểm</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[176px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text2 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[60px] whitespace-pre-wrap">SLA vượt ngưỡng</p>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon20 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[67px] w-[122.234px]" data-name="Container">
      <Text3 />
      <Container10 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[176px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container11 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[69px] w-[99.672px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[100px] whitespace-pre-wrap">Giám sát, Giám đốc</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[176px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[79.5px] w-[42.109px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Đơn vị</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[176px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[79.5px] w-[76.188px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Push, Email</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[176px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2228)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p3a6e4300} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2228">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[63px] w-[83.391px]" data-name="Text">
      <Icon21 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[176px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[#fce8e6] h-[29px] left-[16px] rounded-[8px] top-[73.5px] w-[51.063px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#d92d20] text-[14px] top-[4px] whitespace-pre">High</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[176px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function Icon22() {
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

function Button16() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Icon23() {
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

function Button17() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[73px] w-[144.703px]" data-name="Container">
      <Button16 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[176px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container12 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[176px] left-0 top-0 w-[1226px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
    </div>
  );
}

function Code1() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[57px] w-[119.766px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">LEAD_SENSITIVE</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[134px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code1 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[105px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[35px] whitespace-pre-wrap">Lead nhạy cảm được tạo</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[134px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Lead nhạy cảm</p>
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[106.94px] size-[14px] top-[3.5px]" data-name="Container">
      <Icon25 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[56.5px] w-[122.234px]" data-name="Container">
      <Text10 />
      <Container13 />
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[134px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container14 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[114.531px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[115px] whitespace-pre-wrap">Quản trị, IT, Giám đốc</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[134px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[53px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[53px] whitespace-pre-wrap">Toàn hệ thống</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[134px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[80.219px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[81px] whitespace-pre-wrap">Push, Email, Hệ thống</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[134px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2162)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p1e584d00} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2162">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[42px] w-[83.391px]" data-name="Text">
      <Icon26 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[134px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute bg-[#fce8e6] h-[29px] left-[16px] rounded-[8px] top-[52.5px] w-[51.063px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#d92d20] text-[14px] top-[4px] whitespace-pre">High</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[134px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Icon27() {
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

function Button19() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Icon28() {
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

function Button20() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon28 />
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[52px] w-[144.703px]" data-name="Container">
      <Button19 />
      <Button20 />
      <Button21 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[134px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container15 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[134px] left-0 top-[176px] w-[1226px]" data-name="Table Row">
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
    </div>
  );
}

function Code2() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[46.5px] w-[150.563px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">MASTER_DATA_CHANGE</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[113px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code2 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute h-[84px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[47px] whitespace-pre-wrap">Thay đổi dữ liệu master</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[113px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[96px] whitespace-pre-wrap">Dữ liệu master thay đổi</p>
    </div>
  );
}

function Icon30() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon30 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[35.5px] w-[122.234px]" data-name="Container">
      <Text17 />
      <Container16 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[113px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container17 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[48px] w-[121.813px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Quản trị, Phân tích</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[113px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[53px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[53px] whitespace-pre-wrap">Toàn hệ thống</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[113px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text19 />
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[64.656px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[65px] whitespace-pre-wrap">Hệ thống, Email</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[113px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text20 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2162)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p1e584d00} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2162">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[31.5px] w-[83.391px]" data-name="Text">
      <Icon31 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[113px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute bg-[#fff3e0] h-[29px] left-[16px] rounded-[8px] top-[42px] w-[74.047px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#f57c00] text-[14px] top-[4px] whitespace-pre">Medium</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[113px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text22 />
    </div>
  );
}

function Icon32() {
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

function Button22() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Icon33() {
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

function Button23() {
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
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button24() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[41.5px] w-[144.703px]" data-name="Container">
      <Button22 />
      <Button23 />
      <Button24 />
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[113px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container18 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[113px] left-0 top-[310px] w-[1226px]" data-name="Table Row">
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
    </div>
  );
}

function Code3() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[46.5px] w-[96.672px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXPORT_FAIL</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[113px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code3 />
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute h-[84px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[51px] whitespace-pre-wrap">Job xuất dữ liệu thất bại</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[113px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text23 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[79px] whitespace-pre-wrap">Xuất dữ liệu thất bại</p>
    </div>
  );
}

function Icon35() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon35 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[35.5px] w-[122.234px]" data-name="Container">
      <Text24 />
      <Container19 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[113px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container20 />
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[48px] w-[72.594px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">IT, Quản trị</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[113px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text25 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[75.094px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[76px] whitespace-pre-wrap">Theo người tạo</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[113px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[59.438px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[60px] whitespace-pre-wrap">Push, Hệ thống</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[113px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text27 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2162)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p1e584d00} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2162">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[31.5px] w-[83.391px]" data-name="Text">
      <Icon36 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[113px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute bg-[#fff3e0] h-[29px] left-[16px] rounded-[8px] top-[42px] w-[74.047px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#f57c00] text-[14px] top-[4px] whitespace-pre">Medium</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[113px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text29 />
    </div>
  );
}

function Icon37() {
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

function Button25() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
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
          <path d={svgPaths.p19234b00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2804be00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
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
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[41.5px] w-[144.703px]" data-name="Container">
      <Button25 />
      <Button26 />
      <Button27 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[113px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container21 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[113px] left-0 top-[423px] w-[1226px]" data-name="Table Row">
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
    </div>
  );
}

function Code4() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[57px] w-[142.859px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">AUDIT_QUERY_ALERT</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[134px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code4 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute h-[105px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[37px] whitespace-pre-wrap">Truy vấn audit quan trọng</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[134px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[94.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Truy vấn audit</p>
    </div>
  );
}

function Icon40() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[100.23px] size-[14px] top-[3.5px]" data-name="Container">
      <Icon40 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[56.5px] w-[122.234px]" data-name="Container">
      <Text31 />
      <Container22 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[134px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container23 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[94.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[95px] whitespace-pre-wrap">Quản trị, Giám đốc, IT</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[134px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text32 />
    </div>
  );
}

function Text33() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[53px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[53px] whitespace-pre-wrap">Toàn hệ thống</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[134px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text33 />
    </div>
  );
}

function Text34() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[80.219px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[81px] whitespace-pre-wrap">Push, Email, Hệ thống</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[134px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text34 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2162)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p1e584d00} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2162">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text35() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[42px] w-[83.391px]" data-name="Text">
      <Icon41 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[134px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text35 />
    </div>
  );
}

function Text36() {
  return (
    <div className="absolute bg-[#fce8e6] h-[29px] left-[16px] rounded-[8px] top-[52.5px] w-[51.063px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#d92d20] text-[14px] top-[4px] whitespace-pre">High</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[134px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text36 />
    </div>
  );
}

function Icon42() {
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

function Button28() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon42 />
      </div>
    </div>
  );
}

function Icon43() {
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

function Button29() {
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
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon44 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[52px] w-[144.703px]" data-name="Container">
      <Button28 />
      <Button29 />
      <Button30 />
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[134px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container24 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[134px] left-0 top-[536px] w-[1226px]" data-name="Table Row">
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
    </div>
  );
}

function Code5() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[67.5px] w-[127.469px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">SLA_RISK_MEDIUM</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[155px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code5 />
    </div>
  );
}

function Text37() {
  return (
    <div className="absolute h-[126px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[37px] whitespace-pre-wrap">Cảnh báo SLA mức trung bình</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[155px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text37 />
    </div>
  );
}

function Text38() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[60px] whitespace-pre-wrap">SLA vượt ngưỡng</p>
    </div>
  );
}

function Icon45() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon45 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[56.5px] w-[122.234px]" data-name="Container">
      <Text38 />
      <Container25 />
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[155px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container26 />
    </div>
  );
}

function Text39() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[58.5px] w-[99.063px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[100px] whitespace-pre-wrap">Giám sát, Phân tích</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[155px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text39 />
    </div>
  );
}

function Text40() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[69px] w-[79.875px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Đơn vị riêng</p>
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[155px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text40 />
    </div>
  );
}

function Text41() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[69px] w-[32.891px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Push</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[155px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text41 />
    </div>
  );
}

function Icon46() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2166)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p3fdc4500} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2166">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text42() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[52.5px] w-[83.391px]" data-name="Text">
      <Icon46 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[155px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text42 />
    </div>
  );
}

function Text43() {
  return (
    <div className="absolute bg-[#fff3e0] h-[29px] left-[16px] rounded-[8px] top-[63px] w-[74.047px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#f57c00] text-[14px] top-[4px] whitespace-pre">Medium</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[155px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text43 />
    </div>
  );
}

function Icon47() {
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

function Button31() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon47 />
      </div>
    </div>
  );
}

function Icon48() {
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

function Button32() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon48 />
      </div>
    </div>
  );
}

function Icon49() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon49 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[62.5px] w-[144.703px]" data-name="Container">
      <Button31 />
      <Button32 />
      <Button33 />
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[155px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container27 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[155px] left-0 top-[670px] w-[1226px]" data-name="Table Row">
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
    </div>
  );
}

function Code6() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[57px] w-[165.953px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">PROVINCE_DATA_UPDATE</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[134px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code6 />
    </div>
  );
}

function Text44() {
  return (
    <div className="absolute h-[105px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[52px] whitespace-pre-wrap">Cập nhật dữ liệu cấp tỉnh</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[134px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text44 />
    </div>
  );
}

function Text45() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[96px] whitespace-pre-wrap">Dữ liệu master thay đổi</p>
    </div>
  );
}

function Icon50() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon50 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[46px] w-[122.234px]" data-name="Container">
      <Text45 />
      <Container28 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[134px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container29 />
    </div>
  );
}

function Text46() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[104.188px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[105px] whitespace-pre-wrap">Giám đốc, Phân tích</p>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[134px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text46 />
    </div>
  );
}

function Text47() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[58.5px] w-[55.125px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Cấp tỉnh</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[134px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text47 />
    </div>
  );
}

function Text48() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[48px] w-[61.859px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[62px] whitespace-pre-wrap">Email, Hệ thống</p>
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[134px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text48 />
    </div>
  );
}

function Icon51() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2166)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p3fdc4500} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2166">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text49() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[42px] w-[83.391px]" data-name="Text">
      <Icon51 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[134px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text49 />
    </div>
  );
}

function Text50() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[16px] rounded-[8px] top-[52.5px] w-[47.75px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#1976d2] text-[14px] top-[4px] whitespace-pre">Low</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[134px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text50 />
    </div>
  );
}

function Icon52() {
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

function Button34() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon52 />
      </div>
    </div>
  );
}

function Icon53() {
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

function Button35() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon53 />
      </div>
    </div>
  );
}

function Icon54() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button36() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon54 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[52px] w-[144.703px]" data-name="Container">
      <Button34 />
      <Button35 />
      <Button36 />
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[134px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container30 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[134px] left-0 top-[825px] w-[1226px]" data-name="Table Row">
      <TableCell54 />
      <TableCell55 />
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

function Code7() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[46.5px] w-[142.859px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">EXPORT_AUDIT_FAIL</p>
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute h-[113px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code7 />
    </div>
  );
}

function Text51() {
  return (
    <div className="absolute h-[84px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[51px] whitespace-pre-wrap">Xuất audit log thất bại</p>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[113px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text51 />
    </div>
  );
}

function Text52() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[79px] whitespace-pre-wrap">Xuất dữ liệu thất bại</p>
    </div>
  );
}

function Icon55() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon55 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[35.5px] w-[122.234px]" data-name="Container">
      <Text52 />
      <Container31 />
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[113px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container32 />
    </div>
  );
}

function Text53() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[114.531px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[115px] whitespace-pre-wrap">IT, Quản trị, Giám đốc</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[113px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text53 />
    </div>
  );
}

function Text54() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[53px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-[53px] whitespace-pre-wrap">Toàn hệ thống</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[113px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text54 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[80.219px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[81px] whitespace-pre-wrap">Push, Email, Hệ thống</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[113px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text55 />
    </div>
  );
}

function Icon56() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2166)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p3fdc4500} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2166">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text56() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[31.5px] w-[83.391px]" data-name="Text">
      <Icon56 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[113px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text56 />
    </div>
  );
}

function Text57() {
  return (
    <div className="absolute bg-[#fce8e6] h-[29px] left-[16px] rounded-[8px] top-[42px] w-[51.063px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#d92d20] text-[14px] top-[4px] whitespace-pre">High</p>
    </div>
  );
}

function TableCell70() {
  return (
    <div className="absolute h-[113px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text57 />
    </div>
  );
}

function Icon57() {
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
        <Icon57 />
      </div>
    </div>
  );
}

function Icon58() {
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
        <Icon58 />
      </div>
    </div>
  );
}

function Icon59() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button39() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon59 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[41.5px] w-[144.703px]" data-name="Container">
      <Button37 />
      <Button38 />
      <Button39 />
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute h-[113px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container33 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[113px] left-0 top-[959px] w-[1226px]" data-name="Table Row">
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
      <TableCell70 />
      <TableCell71 />
    </div>
  );
}

function Code8() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[46.5px] w-[73.578px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">LEAD_VIP</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute h-[113px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code8 />
    </div>
  );
}

function Text58() {
  return (
    <div className="absolute h-[84px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[35px] whitespace-pre-wrap">Lead VIP được tạo</p>
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute h-[113px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text58 />
    </div>
  );
}

function Text59() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[100.938px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Lead nhạy cảm</p>
    </div>
  );
}

function Icon60() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[106.94px] size-[14px] top-[3.5px]" data-name="Container">
      <Icon60 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[21px] left-[16px] top-[46px] w-[122.234px]" data-name="Container">
      <Text59 />
      <Container34 />
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute h-[113px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container35 />
    </div>
  );
}

function Text60() {
  return (
    <div className="absolute h-[38px] left-[16px] top-[37.5px] w-[104.797px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-[-2px] w-[105px] whitespace-pre-wrap">Giám đốc, Giám sát</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute h-[113px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text60 />
    </div>
  );
}

function Text61() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[48px] w-[42.109px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Đơn vị</p>
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute h-[113px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text61 />
    </div>
  );
}

function Text62() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[48px] w-[76.188px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Push, Email</p>
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute h-[113px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text62 />
    </div>
  );
}

function Icon61() {
  return (
    <div className="absolute left-[10px] size-[12.563px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5625 12.5625">
        <g clipPath="url(#clip0_2269_2223)" id="Icon">
          <path d={svgPaths.p1f04f880} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04687" />
          <path d={svgPaths.p2ccf5280} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04687" />
          <path d={svgPaths.p32920900} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.04687" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2223">
            <rect fill="white" height="12.5625" width="12.5625" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text63() {
  return (
    <div className="absolute bg-[#f2f4f7] h-[50px] left-[16px] rounded-[8px] top-[31.5px] w-[83.391px]" data-name="Text">
      <Icon61 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[28.56px] not-italic text-[#667085] text-[14px] top-[4px] w-[29px] whitespace-pre-wrap">Vô hiệu</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute h-[113px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text63 />
    </div>
  );
}

function Text64() {
  return (
    <div className="absolute bg-[#fff3e0] h-[29px] left-[16px] rounded-[8px] top-[42px] w-[74.047px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#f57c00] text-[14px] top-[4px] whitespace-pre">Medium</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[113px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text64 />
    </div>
  );
}

function Icon62() {
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

function Button40() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon62 />
      </div>
    </div>
  );
}

function Icon63() {
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

function Button41() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon63 />
      </div>
    </div>
  );
}

function Icon64() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2208)" id="Icon">
          <path d={svgPaths.pa641000} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6.75 8.25L9 10.5L16.5 3" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2208">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon64 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[41.5px] w-[144.703px]" data-name="Container">
      <Button40 />
      <Button41 />
      <Button42 />
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute h-[113px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container36 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[113px] left-0 top-[1072px] w-[1226px]" data-name="Table Row">
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
      <TableCell80 />
    </div>
  );
}

function Code9() {
  return (
    <div className="absolute bg-[#f2f4f7] content-stretch flex h-[21px] items-start left-[16px] px-[6px] py-[2px] rounded-[4px] top-[57px] w-[104.375px]" data-name="Code">
      <p className="font-['Consolas:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">SLA_RISK_LOW</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute h-[133.5px] left-0 top-0 w-[197.953px]" data-name="Table Cell">
      <Code9 />
    </div>
  );
}

function Text65() {
  return (
    <div className="absolute h-[105px] left-[16px] top-[14.5px] w-[52.188px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[36px] whitespace-pre-wrap">Cảnh báo SLA mức thấp</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute h-[133.5px] left-[197.95px] top-0 w-[84.188px]" data-name="Table Cell">
      <Text65 />
    </div>
  );
}

function Text66() {
  return (
    <div className="absolute h-[42px] left-0 top-0 w-[102.234px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 w-[60px] whitespace-pre-wrap">SLA vượt ngưỡng</p>
    </div>
  );
}

function Icon65() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
            <path d={svgPaths.p13f5b400} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-1/2 top-1/2" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 2.91667V0.583333" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/2 right-[49.96%] top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[108.23px] size-[14px] top-[14px]" data-name="Container">
      <Icon65 />
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute h-[42px] left-[16px] top-[46px] w-[122.234px]" data-name="Container">
      <Text66 />
      <Container37 />
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute h-[133.5px] left-[282.14px] top-0 w-[154.234px]" data-name="Table Cell">
      <Container38 />
    </div>
  );
}

function Text67() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[58.5px] w-[123.266px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Báo cáo, Phân tích</p>
    </div>
  );
}

function TableCell84() {
  return (
    <div className="absolute h-[133.5px] left-[436.38px] top-0 w-[156.625px]" data-name="Table Cell">
      <Text67 />
    </div>
  );
}

function Text68() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[58.5px] w-[79.875px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] whitespace-pre">Đơn vị riêng</p>
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute h-[133.5px] left-[593px] top-0 w-[116.828px]" data-name="Table Cell">
      <Text68 />
    </div>
  );
}

function Text69() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[16px] top-[58.5px] w-[60.625px]" data-name="Text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#667085] text-[14px] whitespace-pre">Hệ thống</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute h-[133.5px] left-[709.83px] top-0 w-[118.031px]" data-name="Table Cell">
      <Text69 />
    </div>
  );
}

function Icon66() {
  return (
    <div className="absolute left-[10px] size-[9.609px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.60938 9.60938">
        <g clipPath="url(#clip0_2269_2166)" id="Icon">
          <path d={svgPaths.p3fd8ad00} id="Vector" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
          <path d={svgPaths.p3fdc4500} id="Vector_2" stroke="var(--stroke-0, #0F9D58)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.800781" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2166">
            <rect fill="white" height="9.60938" width="9.60938" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text70() {
  return (
    <div className="absolute bg-[#e6f4ea] h-[50px] left-[16px] rounded-[8px] top-[42px] w-[83.391px]" data-name="Text">
      <Icon66 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[25.61px] not-italic text-[#0f9d58] text-[14px] top-[4px] w-[35px] whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute h-[133.5px] left-[827.86px] top-0 w-[115.391px]" data-name="Table Cell">
      <Text70 />
    </div>
  );
}

function Text71() {
  return (
    <div className="absolute bg-[#e3f2fd] h-[29px] left-[16px] rounded-[8px] top-[52.5px] w-[47.75px]" data-name="Text">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[10px] not-italic text-[#1976d2] text-[14px] top-[4px] whitespace-pre">Low</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute h-[133.5px] left-[943.25px] top-0 w-[106.047px]" data-name="Table Cell">
      <Text71 />
    </div>
  );
}

function Icon67() {
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

function Button43() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon67 />
      </div>
    </div>
  );
}

function Icon68() {
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

function Button44() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon68 />
      </div>
    </div>
  );
}

function Icon69() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2269_2253)" id="Icon">
          <path d={svgPaths.p1dc5c00} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1d4b5880} id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 1.5V4.5" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2253">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button45() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[30px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon69 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[30px] items-start left-[16px] top-[52px] w-[144.703px]" data-name="Container">
      <Button43 />
      <Button44 />
      <Button45 />
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[133.5px] left-[1049.3px] top-0 w-[176.703px]" data-name="Table Cell">
      <Container39 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute h-[133.5px] left-0 top-[1185px] w-[1226px]" data-name="Table Row">
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

function TableBody() {
  return (
    <div className="absolute h-[1318.5px] left-0 top-[78.5px] w-[1226px]" data-name="Table Body">
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
    <div className="h-[1397px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white h-[1399px] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <Table />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)]" />
    </div>
  );
}

function NotificationRulesTab() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1228px]" data-name="NotificationRulesTab">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[20px] items-start relative size-full">
        <Container9 />
        <Container40 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[1230px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container4 />
        <NotificationRulesTab />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AdminPage() {
  return (
    <div className="bg-[#f9fafb] h-[1909.5px] relative shrink-0 w-full" data-name="AdminPage">
      <div className="content-stretch flex flex-col gap-[20px] items-start pl-[24px] pr-0 py-[24px] relative size-full">
        <Container1 />
        <Container2 />
        <Container3 />
        <Container41 />
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[1973.5px] items-start left-0 pl-[256px] pr-0 py-0 top-0 w-[1534px]" data-name="MainLayout">
      <TopUtilityBar3 />
      <AdminPage />
    </div>
  );
}

function ImageMappaLogo() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Image (Mappa Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageMappaLogo} />
    </div>
  );
}

function Text72() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-1px] whitespace-pre">Mappa</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[32px] relative shrink-0 w-[97.266px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <ImageMappaLogo />
        <Text72 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[64px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px pl-[16px] pr-[141.734px] pt-0 relative size-full">
        <Container42 />
      </div>
    </div>
  );
}

function Icon70() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Icon71() {
  return (
    <div className="absolute left-[213px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button46() {
  return (
    <div className="bg-[#005cb6] h-[32px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon70 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[69px] not-italic text-[14px] text-center text-white top-[6px] translate-x-[-50%] whitespace-pre">Tạo nhanh</p>
      <Icon71 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[49px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[8px] px-[8px] relative size-full">
        <Button46 />
      </div>
    </div>
  );
}

function Icon72() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1fc96a00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p33089d00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p49cfa80} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1cfbf300} id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text73() {
  return (
    <div className="h-[20px] relative shrink-0 w-[71.219px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Tổng quan</p>
      </div>
    </div>
  );
}

function VerticalSidebar() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon72 />
      <Text73 />
    </div>
  );
}

function Link() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar />
    </div>
  );
}

function Icon73() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p8706b00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M12.5 4.80334V17.3033" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M7.5 2.69666V15.1967" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text74() {
  return (
    <div className="h-[20px] relative shrink-0 w-[115.172px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Bản đồ điều hành</p>
      </div>
    </div>
  );
}

function VerticalSidebar1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon73 />
      <Text74 />
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar1 />
    </div>
  );
}

function Icon74() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2269_2193)" id="Icon">
          <path d={svgPaths.p37143280} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1d7f0000} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2b722f80} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 5H11.6667" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 8.33333H11.6667" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 11.6667H11.6667" id="Vector_6" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M8.33333 15H11.6667" id="Vector_7" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2269_2193">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text75() {
  return (
    <div className="h-[20px] relative shrink-0 w-[105.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">{`Cơ sở & Địa bàn`}</p>
      </div>
    </div>
  );
}

function VerticalSidebar2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon74 />
      <Text75 />
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar2 />
    </div>
  );
}

function Icon75() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3453ec00} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 7.5V10.8333" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 14.1667H10.0083" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text76() {
  return (
    <div className="h-[20px] relative shrink-0 w-[104.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Nguồn tin / Risk</p>
      </div>
    </div>
  );
}

function VerticalSidebar3() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon75 />
      <Text76 />
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar3 />
    </div>
  );
}

function Icon76() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p31104300} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p258f0b00} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 9.16667H13.3333" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H13.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 9.16667H6.675" id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 13.3333H6.675" id="Vector_6" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text77() {
  return (
    <div className="h-[20px] relative shrink-0 w-[135.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Kế hoạch tác nghiệp</p>
      </div>
    </div>
  );
}

function VerticalSidebar4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon76 />
      <Text77 />
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar4 />
    </div>
  );
}

function Icon77() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text78() {
  return (
    <div className="h-[20px] relative shrink-0 w-[142.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Nhiệm vụ hiện trường</p>
      </div>
    </div>
  );
}

function VerticalSidebar5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon77 />
      <Text78 />
    </div>
  );
}

function Link5() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar5 />
    </div>
  );
}

function Icon78() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p197959c0} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3542d440} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5.83333 14.1667V18.3333" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3d4c8400} id="Vector_5" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text79() {
  return (
    <div className="h-[20px] relative shrink-0 w-[92.438px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">Kho chứng cứ</p>
      </div>
    </div>
  );
}

function VerticalSidebar6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon78 />
      <Text79 />
    </div>
  );
}

function Link6() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar6 />
    </div>
  );
}

function Icon79() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p140c1100} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M15 14.1667V7.5" id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.8333 14.1667V4.16667" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 14.1667V11.6667" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text80() {
  return (
    <div className="h-[20px] relative shrink-0 w-[92.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#667085] text-[14px] top-0 whitespace-pre">{`Báo cáo & KPI`}</p>
      </div>
    </div>
  );
}

function VerticalSidebar7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon79 />
      <Text80 />
    </div>
  );
}

function Link7() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar7 />
    </div>
  );
}

function Icon80() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p17390300} id="Vector" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #005CB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text81() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#005cb6] text-[14px] top-0 whitespace-pre">Quản trị</p>
      </div>
    </div>
  );
}

function VerticalSidebar8() {
  return (
    <div className="absolute bg-[rgba(0,92,182,0.1)] content-stretch flex gap-[12px] h-[40px] items-center left-0 pl-[12px] pr-0 py-0 rounded-[8px] top-0 w-[239px]" data-name="VerticalSidebar">
      <Icon80 />
      <Text81 />
    </div>
  );
}

function Link8() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Link">
      <VerticalSidebar8 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[255px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start overflow-clip pb-0 pt-[8px] px-[8px] relative rounded-[inherit] size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
        <Link5 />
        <Link6 />
        <Link7 />
        <Link8 />
      </div>
    </div>
  );
}

function Icon81() {
  return (
    <div className="relative size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6H14" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p310f0e80} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button47() {
  return (
    <div className="bg-[#f9fafb] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <div className="flex items-center justify-center relative shrink-0 size-[16px]" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <Icon81 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon82() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19d57600} id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6H14" id="Vector_2" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p310f0e80} id="Vector_3" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button48() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon82 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[4px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Button47 />
      <Button48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[53px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[9px] px-[8px] relative size-full">
        <Container45 />
      </div>
    </div>
  );
}

function Icon83() {
  return (
    <div className="absolute left-[76.86px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function VerticalSidebar9() {
  return (
    <div className="absolute h-[20px] left-[106.86px] top-[6px] w-[55.281px]" data-name="VerticalSidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[28px] not-italic text-[#101828] text-[14px] text-center top-0 translate-x-[-50%] whitespace-pre">Thu gọn</p>
    </div>
  );
}

function Button49() {
  return (
    <div className="h-[32px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <Icon83 />
      <VerticalSidebar9 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[49px] relative shrink-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[9px] px-[8px] relative size-full">
        <Button49 />
      </div>
    </div>
  );
}

function VerticalSidebar10() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[952px] items-start left-0 pl-0 pr-px py-0 top-[300px] w-[256px]" data-name="VerticalSidebar">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Container43 />
      <Container44 />
      <Navigation />
      <Container46 />
      <Container47 />
    </div>
  );
}

function Text82() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[24.48px] top-[2px] w-[7.563px]" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#ef4444] text-[14px] whitespace-pre">*</p>
    </div>
  );
}

function Label() {
  return (
    <div className="h-[21px] relative shrink-0 w-[272px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Mã</p>
        <Text82 />
      </div>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[272px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-0 top-0 w-[272px]" data-name="Container">
      <Label />
      <TextInput2 />
    </div>
  );
}

function Text83() {
  return (
    <div className="absolute content-stretch flex h-[17px] items-start left-[28.53px] top-[2px] w-[7.563px]" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[#ef4444] text-[14px] whitespace-pre">*</p>
    </div>
  );
}

function Label1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[272px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Tên</p>
        <Text83 />
      </div>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[272px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-[288px] top-0 w-[272px]" data-name="Container">
      <Label1 />
      <TextInput3 />
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[272px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Sự kiện</p>
      </div>
    </div>
  );
}

function TextInput4() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[272px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-0 top-[86px] w-[272px]" data-name="Container">
      <Label2 />
      <TextInput4 />
    </div>
  );
}

function Label3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[272px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Điều kiện</p>
      </div>
    </div>
  );
}

function TextInput5() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[272px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-[288px] top-[86px] w-[272px]" data-name="Container">
      <Label3 />
      <TextInput5 />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[272px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Người nhận</p>
      </div>
    </div>
  );
}

function TextInput6() {
  return (
    <div className="bg-white h-[41px] relative rounded-[6px] shrink-0 w-[272px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[72px] items-start left-0 top-[172px] w-[272px]" data-name="Container">
      <Label4 />
      <TextInput6 />
    </div>
  );
}

function Label5() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[272px]" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Trạng thái</p>
    </div>
  );
}

function Option26() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-0 whitespace-pre-wrap">Hoạt động</p>
    </div>
  );
}

function Option27() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-[-2px] w-0 whitespace-pre-wrap">Không hoạt động</p>
    </div>
  );
}

function Dropdown5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43px] items-start left-0 pb-px pl-[-775px] pr-[1047px] pt-[-482px] rounded-[6px] top-[29px] w-[272px]" data-name="Dropdown" style={{ backgroundImage: "linear-gradient(8.98344deg, rgba(0, 0, 0, 0) 50%, rgb(16, 24, 40) 50%), linear-gradient(171.017deg, rgb(16, 24, 40) 50%, rgba(0, 0, 0, 0) 50%), linear-gradient(90deg, rgb(249, 250, 251) 0%, rgb(249, 250, 251) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option26 />
      <Option27 />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute h-[72px] left-[288px] top-[172px] w-[272px]" data-name="Container">
      <Label5 />
      <Dropdown5 />
    </div>
  );
}

function Label6() {
  return (
    <div className="h-[21px] relative shrink-0 w-[560px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0 whitespace-pre">Mô tả</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[560px]" data-name="Text Area">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip px-[14px] py-[10px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[14px] text-[rgba(16,24,40,0.5)] whitespace-pre">Mô tả chi tiết...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[114px] items-start left-0 top-[260px] w-[560px]" data-name="Container">
      <Label6 />
      <TextArea />
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute h-[374px] left-[20px] top-[88px] w-[560px]" data-name="Container">
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
      <Container54 />
    </div>
  );
}

function Button50() {
  return (
    <div className="bg-white h-[43px] relative rounded-[6px] shrink-0 w-[64.906px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[19px] py-[11px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center whitespace-pre">Hủy</p>
      </div>
    </div>
  );
}

function Icon84() {
  return (
    <div className="absolute left-[18px] size-[16px] top-[13.5px]" data-name="Icon">
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

function Button51() {
  return (
    <div className="bg-[#005cb6] h-[43px] relative rounded-[6px] shrink-0 w-[142.297px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon84 />
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[83.5px] not-italic text-[14px] text-center text-white top-[11px] translate-x-[-50%] whitespace-pre">Lưu thay đổi</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[84px] items-start justify-end left-0 pb-0 pl-0 pr-[20px] pt-[21px] top-[482px] w-[600px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Button50 />
      <Button51 />
    </div>
  );
}

function Icon85() {
  return (
    <div className="absolute left-[20px] size-[24px] top-[21.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1949c8a0} id="Vector" stroke="var(--stroke-0, #4F46E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3a911c80} id="Vector_2" stroke="var(--stroke-0, #4F46E5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[27px] left-[56px] top-[20px] w-[524px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[27px] left-0 not-italic text-[#101828] text-[18px] top-px whitespace-pre">Chỉnh sửa</p>
    </div>
  );
}

function Icon86() {
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

function Button52() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[552px] rounded-[4px] size-[32px] top-[16px]" data-name="Button">
      <Icon86 />
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid h-[68px] left-0 top-0 w-[600px]" data-name="Container">
      <Icon85 />
      <Heading1 />
      <Button52 />
    </div>
  );
}

function Form() {
  return (
    <div className="bg-white h-[566px] relative rounded-[8px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] shrink-0 w-[600px]" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container55 />
        <Container56 />
        <Container57 />
      </div>
    </div>
  );
}

function UniversalModal() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.5)] content-stretch flex h-[952px] items-center justify-center left-0 top-[300px] w-[1534px]" data-name="UniversalModal">
      <Form />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <MainLayout />
      <VerticalSidebar10 />
      <UniversalModal />
    </div>
  );
}
