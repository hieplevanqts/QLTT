import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '../@/components/ui/button';
import { Card, CardContent, CardHeader } from '../@/components/ui-kit/Card/Card';
import mappaLogo from '../../assets/79505e63e97894ec2d06837c57cf53a19680f611.png';
import styles from './Login.module.css';
import selectStyles from './SelectJurisdiction.module.css';

const units = [
  { id: 1, name: 'Cục Quản lý thị trường TP. Hồ Chí Minh', type: 'bureau' },
  { id: 2, name: 'Chi cục QLTT Phường 1', type: 'sub-bureau', parent: 1 },
  { id: 3, name: 'Chi cục QLTT Phường 3', type: 'sub-bureau', parent: 1 },
  { id: 4, name: 'Đội QLTT số 1', type: 'team', parent: 2 },
  { id: 5, name: 'Đội QLTT số 2', type: 'team', parent: 2 },
];

const jurisdictions = [
  'Toàn địa bàn',
  'Phường 1',
  'Phường 3',
  'Phường 5',
  'Phường 10',
  'Phường Bến Nghé',
  'Phường Bến Thành',
];

export default function SelectJurisdiction() {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('');

  const handleContinue = () => {
    if (selectedUnit && selectedJurisdiction) {
      // Store selection in localStorage or context
      localStorage.setItem('selectedUnit', selectedUnit.toString());
      localStorage.setItem('selectedJurisdiction', selectedJurisdiction);
      navigate('/overview');
    }
  };

  return (
    <div className={styles.authLayout}>
      <div className={styles.authLeft}>
        <div className={selectStyles.selectCard}>
          <div className={styles.authHeader}>
            <div className={styles.logo}>
              <img src={mappaLogo} alt="Mappa" className={styles.logoImage} />
              <span className={styles.logoText}>MAPPA</span>
            </div>
            <h1 className={styles.authTitle}>Chọn đơn vị & địa bàn</h1>
            <p className={styles.authSubtitle}>
              Chọn đơn vị và địa bàn quản lý để tiếp tục
            </p>
          </div>

          <div className={selectStyles.selectForm}>
            <Card>
              <CardHeader title="Đơn vị" />
              <CardContent>
                <div className={selectStyles.unitTree}>
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className={`${selectStyles.unitItem} ${
                        unit.type === 'sub-bureau' ? selectStyles.unitItemSub : ''
                      } ${
                        unit.type === 'team' ? selectStyles.unitItemTeam : ''
                      } ${
                        selectedUnit === unit.id ? selectStyles.unitItemSelected : ''
                      }`}
                      onClick={() => setSelectedUnit(unit.id)}
                    >
                      <span className={selectStyles.unitName}>{unit.name}</span>
                      {selectedUnit === unit.id && (
                        <span className={selectStyles.checkmark}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Địa bàn quản lý" />
              <CardContent>
                <div className={selectStyles.jurisdictionSelect}>
                  <select
                    className={selectStyles.select}
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  >
                    <option value="">Chọn địa bàn...</option>
                    {jurisdictions.map((jurisdiction) => (
                      <option key={jurisdiction} value={jurisdiction}>
                        {jurisdiction}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={selectStyles.selectIcon} size={20} />
                </div>
              </CardContent>
            </Card>

            <div className={selectStyles.actions}>
              <Button
                variant="ghost"
                onClick={() => navigate('/auth/login')}
              >
                Đăng xuất
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedUnit || !selectedJurisdiction}
              >
                Vào hệ thống
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authRightContent}>
          <h2 className={styles.authRightTitle}>Quản lý đa cấp</h2>
          <p className={styles.authRightDescription}>
            Hệ thống hỗ trợ cấu trúc tổ chức 3 cấp: Cục - Chi cục - Đội,
            với phân quyền và dữ liệu theo địa bàn quản lý.
          </p>
        </div>
      </div>
    </div>
  );
}
