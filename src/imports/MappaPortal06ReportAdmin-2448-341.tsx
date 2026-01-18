import svgPaths from "./svg-g0aeu1ujpu";
import imgImageMappaLogo from "figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png";
import imgImageMappaDashboardPreview from "figma:asset/1335c3f0fc5233b65c4a3fb13a990d8063ab0c64.png";

function ImageMappaLogo() {
  return (
    <div className="absolute left-[319px] size-[64px] top-[62.34px]" data-name="Image (MAPPA Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageMappaLogo} />
    </div>
  );
}

function Heading1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[440px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1px]">Đăng nhập</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-[440px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#667085] text-[14px] top-0">Nhập thông tin tài khoản của bạn để tiếp tục</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[65px] items-start left-[131px] top-[158.34px] w-[440px]" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2448_345)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #D92D20)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2448_345">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[18px] relative shrink-0 w-[208.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#d92d20] text-[12px] top-0">Không tìm thấy thông tin người dùng</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[rgba(217,45,32,0.1)] content-stretch flex gap-[10px] h-[44px] items-center left-[131px] pl-[17px] pr-px py-px rounded-[16px] top-[247.34px] w-[440px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(217,45,32,0.3)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Icon />
      <Text />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[21px] relative shrink-0 w-[440px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Email hoặc tên đăng nhập *</p>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-[440px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[14px] py-[11px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">admin3@vhv.vn</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ced3dd] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_0px_0px_0.049px_rgba(99,102,241,0)]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[6px] h-[72px] items-start left-0 top-0 w-[440px]" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[440px]" data-name="Label">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#101828] text-[14px] top-0">Mật khẩu *</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="absolute bg-white h-[45px] left-0 rounded-[16px] top-0 w-[440px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[14px] pr-[44px] py-[11px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#667085] text-[14px]">vhv123</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2444_160)" id="Icon">
          <path d={svgPaths.p1e0a7a40} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1ba86b40} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1ed557a0} id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M1.5 1.5L16.5 16.5" id="Vector_4" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2444_160">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[396px] rounded-[8px] size-[32px] top-[6.5px]" data-name="Button">
      <Icon1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[45px] left-0 top-[27px] w-[440px]" data-name="Container">
      <TextInput1 />
      <Button />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[72px] left-0 top-[92px] w-[440px]" data-name="Container">
      <Label1 />
      <Container3 />
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[18px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#101828] text-[12px] top-0">Ghi nhớ đăng nhập</p>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[131.234px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Checkbox />
        <Text1 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[26px] relative rounded-[8px] shrink-0 w-[108.953px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[54.5px] not-italic text-[#6366f1] text-[12px] text-center top-[4px] translate-x-[-50%]">Quên mật khẩu?</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex h-[26px] items-center justify-between left-0 top-[176px] w-[440px]" data-name="Container">
      <Label2 />
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex h-[45px] items-center justify-center left-0 px-[24px] py-[12px] rounded-[16px] shadow-[0px_4px_12px_0px_rgba(99,102,241,0.3)] top-[230px] w-[440px]" data-name="Button" style={{ backgroundImage: "linear-gradient(174.161deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)" }}>
      <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] not-italic relative shrink-0 text-[14px] text-center text-white">Đăng nhập</p>
    </div>
  );
}

function Form() {
  return (
    <div className="absolute h-[275px] left-[131px] top-[315.34px] w-[440px]" data-name="Form">
      <Container2 />
      <Container4 />
      <Container5 />
      <Button2 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[8px] size-[16px] top-[5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2444_166)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11f26280} id="Vector_2" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #667085)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2444_166">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[26px] relative rounded-[8px] shrink-0 w-[149.266px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[86.5px] not-italic text-[#667085] text-[12px] text-center top-[4px] translate-x-[-50%]">Trợ giúp đăng nhập</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[6.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#d0d5dd] text-[12px] top-0">•</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[26px] relative rounded-[8px] shrink-0 w-[129.547px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[8px] py-[4px] relative size-full">
        <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#667085] text-[12px] text-center">Chính sách bảo mật</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[43px] items-center justify-center left-[131px] pb-0 pt-px px-0 top-[614.34px] w-[440px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-solid border-t inset-0 pointer-events-none" />
      <Button3 />
      <Text2 />
      <Button4 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-white col-[1] css-3foyfs h-[719.688px] relative row-[1] shrink-0" data-name="Container">
      <ImageMappaLogo />
      <Container />
      <Container1 />
      <Form />
      <Container6 />
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[600px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[300.16px] not-italic text-[30px] text-center text-white top-0 translate-x-[-50%] w-[593px]">Quản lý hiệu quả hệ thống thị trường của bạn</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[51.188px] opacity-95 relative shrink-0 w-[600px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[25.6px] left-[300.13px] not-italic text-[16px] text-[rgba(255,255,255,0.9)] text-center top-[-2px] translate-x-[-50%] w-[575px]">Đăng nhập để truy cập dashboard MAPPA và quản lý toàn bộ hoạt động của bạn</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[139.188px] relative shrink-0 w-[600px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Heading />
        <Paragraph1 />
      </div>
    </div>
  );
}

function ImageMappaDashboardPreview() {
  return (
    <div className="h-[412.5px] relative shrink-0 w-full" data-name="Image (MAPPA Dashboard Preview)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageMappaDashboardPreview} />
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] w-[550px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageMappaDashboardPreview />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] h-[599.688px] items-center left-[51px] top-[60px] w-[600px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="col-[2] css-3foyfs h-[719.688px] overflow-clip relative row-[1] shrink-0" data-name="Container" style={{ backgroundImage: "linear-gradient(134.287deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)" }}>
      <Container10 />
    </div>
  );
}

export default function MappaPortal06ReportAdmin() {
  return (
    <div className="bg-[#f9fafb] grid grid-cols-[repeat(2,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] pb-[-140.688px] pt-0 px-0 relative size-full" data-name="MAPPA-PORTAL-06-REPORT-ADMIN">
      <Container7 />
      <Container11 />
    </div>
  );
}