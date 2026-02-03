export interface GeoTreeNode {
  title: string;
  value: string;
  key: string;
  label?: string;
  selectable?: boolean;
  children?: GeoTreeNode[];
}

const makeNode = (
  label: string,
  levelLabel: string | null,
  value: string,
  children?: GeoTreeNode[],
): GeoTreeNode => ({
  title: levelLabel ? `${label} • ${levelLabel}` : label,
  label,
  value,
  key: value,
  children,
});

const makeWard = (label: string, value: string) => makeNode(label, 'Phường/Xã', value);
const makeDistrict = (label: string, value: string, wards: GeoTreeNode[]) =>
  makeNode(label, 'Quận/Huyện', value, wards);
const makeProvince = (label: string, value: string, districts: GeoTreeNode[]) =>
  makeNode(label, 'Tỉnh/TP', value, districts);

export const vnGeoTreeData: GeoTreeNode[] = [
  {
    title: 'Tất cả địa bàn',
    value: 'ALL',
    key: 'ALL',
    label: 'Tất cả địa bàn',
  },
  {
    title: 'Việt Nam',
    value: 'VN',
    key: 'VN',
    label: 'Việt Nam',
    selectable: false,
    children: [
      makeProvince('Hà Nội', 'VN-HN', [
        makeDistrict('Quận Ba Đình', 'VN-HN-BD', [
          makeWard('Phường Trúc Bạch', 'VN-HN-BD-TB'),
          makeWard('Phường Điện Biên', 'VN-HN-BD-DB'),
          makeWard('Phường Quán Thánh', 'VN-HN-BD-QT'),
        ]),
        makeDistrict('Quận Hoàn Kiếm', 'VN-HN-HK', [
          makeWard('Phường Hàng Bạc', 'VN-HN-HK-HB'),
          makeWard('Phường Hàng Đào', 'VN-HN-HK-HD'),
          makeWard('Phường Tràng Tiền', 'VN-HN-HK-TT'),
        ]),
        makeDistrict('Quận Đống Đa', 'VN-HN-DD', [
          makeWard('Phường Láng Hạ', 'VN-HN-DD-LH'),
          makeWard('Phường Ô Chợ Dừa', 'VN-HN-DD-OCD'),
        ]),
      ]),
      makeProvince('TP. Hồ Chí Minh', 'VN-SG', [
        makeDistrict('Quận 1', 'VN-SG-Q1', [
          makeWard('Phường Bến Nghé', 'VN-SG-Q1-BN'),
          makeWard('Phường Bến Thành', 'VN-SG-Q1-BT'),
        ]),
        makeDistrict('Quận 3', 'VN-SG-Q3', [
          makeWard('Phường 6', 'VN-SG-Q3-P6'),
          makeWard('Phường 7', 'VN-SG-Q3-P7'),
        ]),
        makeDistrict('Quận Bình Thạnh', 'VN-SG-BT', [
          makeWard('Phường 12', 'VN-SG-BT-P12'),
          makeWard('Phường 25', 'VN-SG-BT-P25'),
        ]),
      ]),
      makeProvince('Đà Nẵng', 'VN-DN', [
        makeDistrict('Quận Hải Châu', 'VN-DN-HC', [
          makeWard('Phường Hải Châu 1', 'VN-DN-HC-1'),
          makeWard('Phường Hải Châu 2', 'VN-DN-HC-2'),
        ]),
        makeDistrict('Quận Sơn Trà', 'VN-DN-ST', [
          makeWard('Phường An Hải Bắc', 'VN-DN-ST-AHB'),
          makeWard('Phường Mân Thái', 'VN-DN-ST-MT'),
        ]),
      ]),
      makeProvince('Nghệ An', 'VN-NA', [
        makeDistrict('TP. Vinh', 'VN-NA-VINH', [
          makeWard('Phường Bến Thủy', 'VN-NA-VINH-BT'),
          makeWard('Phường Hưng Bình', 'VN-NA-VINH-HB'),
        ]),
        makeDistrict('Huyện Diễn Châu', 'VN-NA-DC', [
          makeWard('Xã Diễn Ngọc', 'VN-NA-DC-DN'),
          makeWard('Xã Diễn Kim', 'VN-NA-DC-DK'),
        ]),
      ]),
      makeProvince('Hải Phòng', 'VN-HP', [
        makeDistrict('Quận Lê Chân', 'VN-HP-LC', [
          makeWard('Phường An Biên', 'VN-HP-LC-AB'),
          makeWard('Phường An Dương', 'VN-HP-LC-AD'),
        ]),
        makeDistrict('Quận Hồng Bàng', 'VN-HP-HB', [
          makeWard('Phường Hùng Vương', 'VN-HP-HB-HV'),
          makeWard('Phường Quang Trung', 'VN-HP-HB-QT'),
        ]),
      ]),
    ],
  },
];

const geoValueLabelMap: Record<string, string> = {};

const walkTree = (nodes: GeoTreeNode[]) => {
  nodes.forEach((node) => {
    geoValueLabelMap[node.value] = node.label || node.title;
    if (node.children && node.children.length > 0) {
      walkTree(node.children);
    }
  });
};

walkTree(vnGeoTreeData);

export { geoValueLabelMap };

export const getGeoLabel = (value: string) => geoValueLabelMap[value] || value;
