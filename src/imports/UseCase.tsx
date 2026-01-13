import svgPaths from "./svg-iukxwjlxhj";

function XSmall() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="x-small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="x-small">
          <path d="M18 6L6 18M6 6L18 18" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[30px] not-italic relative shrink-0 text-[#101828] text-[20px] text-nowrap">Nhập excel</p>
      <XSmall />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#101828]">Tài liệu đính kèm</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[#f04438]">*</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#7f56d9] text-[14px] text-nowrap">Tải về tài liệu mẫu</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame3 />
      <Frame7 />
    </div>
  );
}

function Upload() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="upload">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="upload">
          <path d="M17 8L12 3M12 3L7 8M12 3V15" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29565380} id="Vector 21" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p29565380} id="Vector 20" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center p-[16px] relative w-full">
          <Upload />
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Tải hoặc kéo thả file</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[#667085] text-[12px] text-nowrap">Hỗ trợ file: .xls, .xlsx. Tối đa 10MB</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Frame5 />
    </div>
  );
}

function Upload1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Upload">
      <Frame6 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center px-[4px] py-[2px] relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center text-nowrap">Hủy bỏ</p>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[4px] py-[2px] relative shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">Tải lên</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#7f56d9] content-stretch flex items-center justify-center px-[20px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full">
      <Button />
      <Button1 />
    </div>
  );
}

export default function UseCase() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[16px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] size-full" data-name="Use case">
      <Frame2 />
      <Upload1 />
      <Frame4 />
    </div>
  );
}