import svgPaths from "./svg-sbswbb2v5m";

function BreadcrumbButtonBase() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="_Breadcrumb button base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-nowrap">Trang chủ</p>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-right">
          <path d="M7.5 15L12.5 10L7.5 5" id="Icon" stroke="var(--stroke-0, #D0D5DD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function BreadcrumbButtonBase1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="_Breadcrumb button base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-nowrap">Công việc</p>
    </div>
  );
}

function BreadcrumbButtonBase2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="_Breadcrumb button base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Công việc tôi thực hiện</p>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Breadcrumbs">
      <BreadcrumbButtonBase />
      <ChevronRight />
      <BreadcrumbButtonBase1 />
      <ChevronRight />
      <BreadcrumbButtonBase1 />
      <ChevronRight />
      <BreadcrumbButtonBase2 />
    </div>
  );
}

function Breadcrumbs1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Breadcrumbs">
      <Breadcrumbs />
    </div>
  );
}

function Refresh() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="refresh">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="refresh">
          <path d={svgPaths.p2733c040} id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Refresh />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Tải lại</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <Frame4 />
    </div>
  );
}

function PlusLarge() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="plus-large">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="plus-large">
          <path d="M12 4V20M4 12H20" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#005cb6] content-stretch flex gap-[8px] h-[36px] items-center justify-end overflow-clip pl-[16px] pr-[20px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <PlusLarge />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white">Thêm mới</p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[240px]">
      <Frame5 />
      <Button />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="bg-clip-text bg-gradient-to-r font-['Inter:Semi_Bold',sans-serif] font-semibold from-[#003366] leading-[32px] not-italic relative shrink-0 text-[22.69px] text-nowrap to-[#3399ff]" style={{ WebkitTextFillColor: "transparent" }}>
        Danh sách phòng họp
      </p>
      <Frame49 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Content">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#667085] text-[16px] text-nowrap">-- Trạng thái --</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down">
          <path d="M6 9L12 15L18 9" id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative w-full">
          <Content />
          <ChevronDown />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function InputWithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Input with label">
      <Input />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.33%_8.34%_8.34%_8.33%]">
      <div className="absolute inset-[0_-3.75%_-3.75%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.75 20.75">
          <g id="Group 12">
            <path d="M15.5556 15.5556L20 20" id="Vector 22" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <circle cx="9.44444" cy="9.44444" id="Ellipse 50" r="8.69444" stroke="var(--stroke-0, #344054)" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="search">
      <Group />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[333px]">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] w-[262px]">Tên phòng họp</p>
      <div className="bg-[#d0d5dd] h-[24px] shrink-0 w-px" />
      <Search />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative rounded-[8px] shrink-0 w-[1186px]">
      <InputWithLabel />
      <Frame3 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame2 />
    </div>
  );
}

function SortDown() {
  return (
    <div className="relative size-[24px]" data-name="sort-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="caret-down">
          <path d={svgPaths.p3b6ec900} fill="var(--fill-0, #101828)" id="Polygon 2" />
        </g>
      </svg>
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="user">
          <g id="Icon">
            <path d={svgPaths.p248e9880} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p2e046f80} stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0">
      <User />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#475467] text-[14px] text-nowrap">Trần Thùy Linh (Linh@gmail.com)</p>
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="calendar">
          <path d={svgPaths.p276b9900} id="Icon" stroke="var(--stroke-0, #475467)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-end relative shrink-0">
      <Calendar />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#475467] text-[14px] text-nowrap">16:00 - 18:00, 21/07/2025</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <Frame44 />
      <Frame43 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Họp cuối năm 2025</p>
      <Frame45 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <Frame46 />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute bg-white content-stretch flex h-[48px] items-center justify-between left-[7px] px-[7px] py-[12px] top-[593px] w-[653px] z-[7]" data-name="Table cell">
      <div className="flex items-center justify-center relative shrink-0 size-[24px]" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg] scale-y-[-100%]">
          <SortDown />
        </div>
      </div>
      <Frame42 />
    </div>
  );
}

function TableHeaderCell() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[12px] items-start px-[16px] py-[10px] relative w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Tên phòng họp</p>
      </div>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[10px] items-start justify-center leading-[20px] not-italic p-[16px] relative size-full text-[#101828] text-[14px] text-nowrap">
          <p className="relative shrink-0">Phòng 101</p>
          <p className="relative shrink-0">PH101</p>
        </div>
      </div>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[10px] items-start justify-center leading-[20px] not-italic p-[16px] relative size-full text-[#101828] text-[14px] text-nowrap">
          <p className="relative shrink-0">Phòng 302</p>
          <p className="relative shrink-0">PH102</p>
        </div>
      </div>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[10px] items-start justify-center leading-[20px] not-italic p-[16px] relative size-full text-[#101828] text-[14px] text-nowrap">
          <p className="relative shrink-0">Phòng 311</p>
          <p className="relative shrink-0">PH311</p>
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell1 />
        <TableCell2 />
        <TableCell3 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 w-[280px] z-[6]">
      <TableHeaderCell />
      <Frame33 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Table header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Người phụ trách</p>
    </div>
  );
}

function TableHeaderCell1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <TableHeader />
        </div>
      </div>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Vũ Thị Lý</p>
        </div>
      </div>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Vũ Thị Lý</p>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell4 />
        <TableCell5 />
        <TableCell4 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 w-[166px] z-[5]">
      <TableHeaderCell1 />
      <Frame35 />
    </div>
  );
}

function TableHeader1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Table header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Vị trí</p>
    </div>
  );
}

function TableHeaderCell2() {
  return (
    <div className="bg-white relative shrink-0 w-full z-[2]" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <TableHeader1 />
        </div>
      </div>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] w-[135px]">Tầng 3</p>
        </div>
      </div>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] w-[135px]">Tầng 3</p>
        </div>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="relative shrink-0 w-full z-[1]">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell6 />
        <TableCell7 />
        <TableCell6 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col isolate items-start justify-center overflow-clip relative shrink-0 w-[171px] z-[4]">
      <TableHeaderCell2 />
      <Frame34 />
    </div>
  );
}

function TableHeader2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Table header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Sức chứa</p>
    </div>
  );
}

function TableHeaderCell3() {
  return (
    <div className="bg-white relative shrink-0 w-full z-[2]" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <TableHeader2 />
        </div>
      </div>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] w-[135px]">23</p>
        </div>
      </div>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] w-[135px]">30</p>
        </div>
      </div>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] w-[135px]">30</p>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="relative shrink-0 w-full z-[1]">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell8 />
        <TableCell9 />
        <TableCell10 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col isolate items-start justify-center overflow-clip relative shrink-0 w-[114px] z-[3]">
      <TableHeaderCell3 />
      <Frame39 />
    </div>
  );
}

function TableHeader3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Table header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Thiết bị</p>
    </div>
  );
}

function TableHeaderCell4() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <TableHeader3 />
        </div>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[417px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Màn chiếu 001, Macbook, Micro, Bảng</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[16px] relative size-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[417px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">Màn chiếu 001, Macbook, Micro, Bảng</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[16px] relative size-full">
          <Frame48 />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell11 />
        <TableCell12 />
        <TableCell11 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame24() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0 z-[2]">
      <TableHeaderCell4 />
      <Frame40 />
    </div>
  );
}

function TableHeader4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Table header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">{`Trạng thái `}</p>
    </div>
  );
}

function TableHeaderCell5() {
  return (
    <div className="bg-white relative shrink-0 w-full z-[2]" data-name="Table header cell">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <TableHeader4 />
        </div>
      </div>
    </div>
  );
}

function BadgeBase() {
  return (
    <div className="bg-[#d1fadf] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#027948] text-[12px] text-center text-nowrap">Đang diễn ra</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-start relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-nowrap">08:00 - 12:00, 23/09/2025</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start justify-center p-[16px] relative size-full">
          <Badge />
          <Frame50 />
        </div>
      </div>
    </div>
  );
}

function BadgeBase1() {
  return (
    <div className="bg-[#f2f4f7] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#344054] text-[12px] text-center text-nowrap">Trống</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase1 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Badge1 />
        </div>
      </div>
    </div>
  );
}

function BadgeBase2() {
  return (
    <div className="bg-[#f2f4f7] content-stretch flex items-center justify-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-name="_Badge base">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[#344054] text-[12px] text-center text-nowrap">Trống</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="content-stretch flex items-start mix-blend-multiply relative shrink-0" data-name="Badge">
      <BadgeBase2 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full" data-name="Table cell">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full">
          <Badge2 />
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="relative shrink-0 w-full z-[1]">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <TableCell13 />
        <TableCell14 />
        <TableCell15 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col isolate items-start justify-center overflow-clip relative shrink-0 w-[224px] z-[1]">
      <TableHeaderCell5 />
      <Frame41 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex isolate items-start overflow-clip relative shrink-0 w-[1396px]" data-name="Table">
      <TableCell />
      <Frame22 />
      <Frame25 />
      <Frame26 />
      <Frame27 />
      <Frame24 />
      <Frame23 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#d0d5dd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[10px] relative w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center text-nowrap">Hành động</p>
        </div>
      </div>
    </div>
  );
}

function Eye() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="eye">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="eye">
          <path d={svgPaths.p2b788400} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <circle cx="12" cy="12" id="Ellipse 17" r="2.25" stroke="var(--stroke-0, #101828)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Eye />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Pencil() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="pencil">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="pencil">
          <path d={svgPaths.p29d1d8f0} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Pencil />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.33%_12.5%]">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 21.5">
          <g id="Group 38113">
            <path d="M0.75 4.75H18.75" id="Vector 31" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1f536a80} id="Vector 32" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1005c880} id="Vector 33" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M7.75 10.75L7.75 14.75" id="Vector 34" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M11.75 10.75L11.75 14.75" id="Vector 35" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TrashCan() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="trash-can">
      <Group1 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <TrashCan />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Frame30 />
          <Frame11 />
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame9 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame36 />
    </div>
  );
}

function Eye1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="eye">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="eye">
          <path d={svgPaths.p2b788400} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <circle cx="12" cy="12" id="Ellipse 17" r="2.25" stroke="var(--stroke-0, #101828)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Eye1 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Pencil1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="pencil">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="pencil">
          <path d={svgPaths.p29d1d8f0} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Pencil1 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.33%_12.5%]">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 21.5">
          <g id="Group 38113">
            <path d="M0.75 4.75H18.75" id="Vector 31" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1f536a80} id="Vector 32" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1005c880} id="Vector 33" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M7.75 10.75L7.75 14.75" id="Vector 34" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M11.75 10.75L11.75 14.75" id="Vector 35" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TrashCan1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="trash-can">
      <Group2 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <TrashCan1 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white h-[76px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Frame31 />
          <Frame12 />
          <Frame15 />
        </div>
      </div>
    </div>
  );
}

function Eye2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="eye">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="eye">
          <path d={svgPaths.p2b788400} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <circle cx="12" cy="12" id="Ellipse 17" r="2.25" stroke="var(--stroke-0, #101828)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Eye2 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame16 />
    </div>
  );
}

function Pencil2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="pencil">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="pencil">
          <path d={svgPaths.p29d1d8f0} id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <Pencil2 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[8.33%_12.5%]">
      <div className="absolute inset-[-3.75%_-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 21.5">
          <g id="Group 38113">
            <path d="M0.75 4.75H18.75" id="Vector 31" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1f536a80} id="Vector 32" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p1005c880} id="Vector 33" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M7.75 10.75L7.75 14.75" id="Vector 34" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M11.75 10.75L11.75 14.75" id="Vector 35" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TrashCan2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="trash-can">
      <Group3 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-start p-[6px] relative shrink-0">
      <TrashCan2 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#f9fafb] h-[76px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Frame32 />
          <Frame17 />
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <Frame37 />
        <Frame7 />
        <Frame8 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaecf0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute content-stretch flex flex-col items-center overflow-clip right-0 top-0 w-[175px]">
      <Frame6 />
      <Frame38 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-[#eaecf0] relative rounded-[8px] shrink-0 w-[1571px]">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <Table />
        <Frame21 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#eaecf0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[2px] items-start leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap">
      <p className="relative shrink-0 text-[#101828]">20</p>
      <p className="relative shrink-0 text-[#d0d5dd]">/</p>
      <p className="relative shrink-0 text-[#101828]">Trang</p>
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-up">
          <path d="M15 12.5L10 7.5L5 12.5" id="Icon" stroke="var(--stroke-0, #101828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="[grid-area:1_/_1] bg-white ml-0 mt-0 relative rounded-[8px] w-[112px]" data-name="Button">
      <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[14px] py-[8px] relative rounded-[inherit] w-full">
        <Frame1 />
        <ChevronUp />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Button1 />
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group5 />
      <p className="[grid-area:1_/_1] font-['Inter:Regular',sans-serif] font-normal leading-[20px] ml-[130px] mt-[8px] not-italic relative text-[#101828] text-[14px] text-nowrap">Tổng số bản ghi: 915</p>
    </div>
  );
}

function ChevronLeft() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-left">
          <path d="M12.5 15L7.5 10L12.5 5" id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
      </svg>
    </div>
  );
}

function Arround() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-white content-stretch flex items-center justify-center p-[8px] relative rounded-[18px] shrink-0" data-name="arround">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <ChevronLeft />
    </div>
  );
}

function Content1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">1</p>
    </div>
  );
}

function PaginationNumberBase() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content1 />
    </div>
  );
}

function Content2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#101828] text-[14px] text-center text-nowrap">2</p>
    </div>
  );
}

function PaginationNumberBase1() {
  return (
    <div className="bg-[#f2f4f7] overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content2 />
    </div>
  );
}

function Content3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">3</p>
    </div>
  );
}

function PaginationNumberBase2() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content3 />
    </div>
  );
}

function Content4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">...</p>
    </div>
  );
}

function PaginationNumberBase3() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content4 />
    </div>
  );
}

function Content5() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">8</p>
    </div>
  );
}

function PaginationNumberBase4() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content5 />
    </div>
  );
}

function Content6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">9</p>
    </div>
  );
}

function PaginationNumberBase5() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content6 />
    </div>
  );
}

function Content7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 p-[12px] rounded-[20px] size-[40px] top-0" data-name="Content">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#667085] text-[14px] text-center text-nowrap">10</p>
    </div>
  );
}

function PaginationNumberBase6() {
  return (
    <div className="overflow-clip relative rounded-[20px] shrink-0 size-[40px]" data-name="_Pagination number base">
      <Content7 />
    </div>
  );
}

function PaginationNumbers() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0" data-name="Pagination numbers">
      <PaginationNumberBase />
      <PaginationNumberBase1 />
      <PaginationNumberBase2 />
      <PaginationNumberBase3 />
      <PaginationNumberBase4 />
      <PaginationNumberBase5 />
      <PaginationNumberBase6 />
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevron-right">
          <path d="M7.5 15L12.5 10L7.5 5" id="Icon" stroke="var(--stroke-0, #344054)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
      </svg>
    </div>
  );
}

function Arround1() {
  return (
    <div className="backdrop-blur-sm backdrop-filter bg-white content-stretch flex items-center justify-center p-[8px] relative rounded-[18px] shrink-0" data-name="arround">
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <ChevronRight1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center justify-center ml-0 mt-0 relative">
      <Arround />
      <PaginationNumbers />
      <Arround1 />
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame />
    </div>
  );
}

function PaginationFooter() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-0 py-[12px] relative shrink-0 w-full" data-name="Pagination_Footer">
      <div aria-hidden="true" className="absolute border-[#f2f4f7] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <Group6 />
      <Group4 />
    </div>
  );
}

export default function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start p-[24px] relative size-full">
      <Breadcrumbs1 />
      <Frame19 />
      <Frame29 />
      <Frame28 />
      <PaginationFooter />
    </div>
  );
}