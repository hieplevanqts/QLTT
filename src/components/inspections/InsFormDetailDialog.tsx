import React from 'react';
import { X, FileText, Calendar, User, Building2, MapPin, Phone, Mail, ClipboardCheck, AlertTriangle } from 'lucide-react';
import styles from './InsFormDetailDialog.module.css';

interface InsFormDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    type: 'decision' | 'assignment' | 'notification' | 'enforcement' | 'meeting' | 'inspection' | 'violation';
    code: string;
    title: string;
    issueDate: string;
    effectiveDate?: string;
    issuer: {
      name: string;
      position: string;
      unit: string;
    };
    content: any;
  } | null;
}

export function InsFormDetailDialog({ isOpen, onClose, formData }: InsFormDetailDialogProps) {
  if (!isOpen || !formData) return null;

  const renderDecisionContent = () => {
    if (formData.type === 'decision') {
      return (
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderUnit}>
              <div className={styles.unitName}>UBND THÀNH PHỐ HỒ CHÍ MINH</div>
              <div className={styles.unitSubname}>CHI CỤC QUẢN LÝ THỊ TRƯỜNG Phường 1</div>
            </div>
            <div className={styles.formHeaderInfo}>
              <div>Số: {formData.code}</div>
              <div className={styles.formLocation}>TP. Hồ Chí Minh, {formData.issueDate}</div>
            </div>
          </div>

          <div className={styles.formTitle}>
            <div className={styles.country}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className={styles.motto}>Độc lập - Tự do - Hạnh phúc</div>
            <div className={styles.separator}></div>
            <h1 className={styles.docTitle}>QUYẾT ĐỊNH</h1>
            <h2 className={styles.docSubtitle}>Về việc kiểm tra điều kiện kinh doanh</h2>
          </div>

          <div className={styles.formBody}>
            <div className={styles.issuerSection}>
              <strong>{formData.issuer.position.toUpperCase()}</strong>
              <div className={styles.issuerUnit}>{formData.issuer.unit}</div>
            </div>

            <div className={styles.legalBasis}>
              <strong>Căn cứ:</strong>
              <ul>
                <li>Luật Thương mại ngày 14/06/2005;</li>
                <li>Luật Bảo vệ quyền lợi người tiêu dùng ngày 17/11/2010;</li>
                <li>Nghị định số 98/2020/NĐ-CP ngày 26/08/2020 của Chính phủ;</li>
                <li>Quyết định số 4550/QĐ-UBND ngày 15/12/2025 của UBND Hà Nội về việc phê duyệt kế hoạch kiểm tra năm 2026.</li>
              </ul>
            </div>

            <div className={styles.decisionSection}>
              <strong>QUYẾT ĐỊNH:</strong>
              <div className={styles.article}>
                <strong>Điều 1.</strong> Thành lập Đoàn kiểm tra điều kiện kinh doanh tại khu vực Phường 1, TP. Hồ Chí Minh:
              </div>

              <div className={styles.teamInfo}>
                <strong>1. Thành phần Đoàn kiểm tra:</strong>
                <ul>
                  <li><strong>Trưởng đoàn:</strong> {formData.content?.leader || 'Nguyễn Văn A - Trưởng phòng Nghiệp vụ'}</li>
                  <li><strong>Thành viên:</strong>
                    <ul>
                      <li>Trần Thị B - Thanh tra viên</li>
                      <li>Lê Văn C - Thanh tra viên</li>
                      <li>Phạm Thị D - Thanh tra viên</li>
                    </ul>
                  </li>
                </ul>

                <strong>2. Phạm vi kiểm tra:</strong>
                <ul>
                  <li><strong>Địa điểm:</strong> Các cơ sở kinh doanh tại {formData.content?.scope || '10 phường thuộc Phường 1'}</li>
                  <li><strong>Đối tượng:</strong> Cửa hàng thực phẩm, siêu thị, chợ truyền thống</li>
                  <li><strong>Nội dung:</strong> Kiểm tra điều kiện vệ sinh an toàn thực phẩm, phòng cháy chữa cháy, quản lý giá</li>
                </ul>

                <strong>3. Thời gian kiểm tra:</strong>
                <ul>
                  <li><strong>Từ ngày:</strong> {formData.content?.startDate || '01/01/2026'}</li>
                  <li><strong>Đến ngày:</strong> {formData.content?.endDate || '31/01/2026'}</li>
                </ul>
              </div>

              <div className={styles.article}>
                <strong>Điều 2.</strong> Trưởng đoàn kiểm tra chịu trách nhiệm tổ chức thực hiện Quyết định này và báo cáo kết quả theo quy định.
              </div>

              <div className={styles.article}>
                <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký.
              </div>
            </div>

            <div className={styles.signature}>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureTitle}>CHI CỤC TRƯỞNG</div>
                <div className={styles.signatureInstruction}>(Ký tên, đóng dấu)</div>
                <div className={styles.signerName}>{formData.issuer.name}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formData.type === 'assignment') {
      return (
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderUnit}>
              <div className={styles.unitName}>UBND THÀNH PHỐ HỒ CHÍ MINH</div>
              <div className={styles.unitSubname}>CHI CỤC QUẢN LÝ THỊ TRƯỜNG Phường 1</div>
            </div>
            <div className={styles.formHeaderInfo}>
              <div>Số: {formData.code}</div>
              <div className={styles.formLocation}>TP. Hồ Chí Minh, {formData.issueDate}</div>
            </div>
          </div>

          <div className={styles.formTitle}>
            <div className={styles.country}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className={styles.motto}>Độc lập - Tự do - Hạnh phúc</div>
            <div className={styles.separator}></div>
            <h1 className={styles.docTitle}>QUYẾT ĐỊNH</h1>
            <h2 className={styles.docSubtitle}>Về việc phân công nhiệm vụ kiểm tra</h2>
          </div>

          <div className={styles.formBody}>
            <div className={styles.issuerSection}>
              <strong>{formData.issuer.position.toUpperCase()}</strong>
              <div className={styles.issuerUnit}>{formData.issuer.unit}</div>
            </div>

            <div className={styles.legalBasis}>
              <strong>Căn cứ:</strong>
              <ul>
                <li>Quyết định số {formData.content?.baseDecision || '01/QĐ-KT'} về việc kiểm tra điều kiện kinh doanh;</li>
                <li>Kế hoạch kiểm tra năm 2026 đã được phê duyệt.</li>
              </ul>
            </div>

            <div className={styles.decisionSection}>
              <strong>QUYẾT ĐỊNH:</strong>
              
              <div className={styles.article}>
                <strong>Điều 1.</strong> Phân công nhiệm vụ cụ thể cho các thành viên Đoàn kiểm tra:
              </div>

              <div className={styles.teamInfo}>
                <strong>1. Ông Nguyễn Văn A - Trưởng đoàn:</strong>
                <ul>
                  <li>Chỉ đạo, điều hành chung các hoạt động kiểm tra</li>
                  <li>Phân công nhiệm vụ cụ thể cho từng thành viên</li>
                  <li>Tổng hợp, báo cáo kết quả kiểm tra</li>
                  <li>Phụ trách khu vực: Phường Bến Nghé, Bến Thành</li>
                </ul>

                <strong>2. Bà Trần Thị B - Thành viên:</strong>
                <ul>
                  <li>Kiểm tra điều kiện vệ sinh an toàn thực phẩm</li>
                  <li>Lập biên bản kiểm tra</li>
                  <li>Phụ trách khu vực: Phường Nguyễn Thái Bình, Phạm Ngũ Lão</li>
                </ul>

                <strong>3. Ông Lê Văn C - Thành viên:</strong>
                <ul>
                  <li>Kiểm tra điều kiện phòng cháy chữa cháy</li>
                  <li>Lập biên bản kiểm tra</li>
                  <li>Phụ trách khu vực: Phường Cầu Ông Lãnh, Cô Giang</li>
                </ul>

                <strong>4. Bà Phạm Thị D - Thành viên:</strong>
                <ul>
                  <li>Kiểm tra quản lý giá, niêm yết giá</li>
                  <li>Hỗ trợ lập biên bản vi phạm (nếu có)</li>
                  <li>Phụ trách khu vực: Phường Tân Định, Đa Kao</li>
                </ul>
              </div>

              <div className={styles.article}>
                <strong>Điều 2.</strong> Các thành viên được phân công có trách nhiệm thực hiện đúng nhiệm vụ được giao, báo cáo Trưởng đoàn theo quy định.
              </div>

              <div className={styles.article}>
                <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký.
              </div>
            </div>

            <div className={styles.signature}>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureTitle}>CHI CỤC TRƯỞNG</div>
                <div className={styles.signatureInstruction}>(Ký tên, đóng dấu)</div>
                <div className={styles.signerName}>{formData.issuer.name}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formData.type === 'notification') {
      return (
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderUnit}>
              <div className={styles.unitName}>UBND THÀNH PHỐ HỒ CHÍ MINH</div>
              <div className={styles.unitSubname}>CHI CỤC QUẢN LÝ THỊ TRƯỜNG Phường 1</div>
            </div>
            <div className={styles.formHeaderInfo}>
              <div>Số: {formData.code}</div>
              <div className={styles.formLocation}>TP. Hồ Chí Minh, {formData.issueDate}</div>
            </div>
          </div>

          <div className={styles.formTitle}>
            <div className={styles.country}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className={styles.motto}>Độc lập - Tự do - Hạnh phúc</div>
            <div className={styles.separator}></div>
            <h1 className={styles.docTitle}>THÔNG BÁO</h1>
            <h2 className={styles.docSubtitle}>Về việc kiểm tra điều kiện kinh doanh</h2>
          </div>

          <div className={styles.formBody}>
            <div className={styles.recipient}>
              <div><strong>Kính gửi:</strong> {formData.content?.storeName || 'Cửa hàng Thực phẩm An Khang'}</div>
              <div><strong>Địa chỉ:</strong> {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</div>
            </div>

            <div className={styles.notificationBody}>
              <p>Căn cứ Quyết định số {formData.content?.baseDecision || '01/QĐ-KT'} ngày {formData.issueDate} của Chi cục trưởng Chi cục Quản lý thị trường Phường 1 về việc kiểm tra điều kiện kinh doanh.</p>
              
              <p><strong>Chi cục Quản lý thị trường Phường 1 thông báo:</strong></p>

              <div className={styles.notificationInfo}>
                <strong>1. Thời gian kiểm tra:</strong>
                <ul>
                  <li>Ngày: {formData.content?.inspectionDate || '15/01/2026'}</li>
                  <li>Giờ: {formData.content?.inspectionTime || '09:00'}</li>
                </ul>

                <strong>2. Địa điểm kiểm tra:</strong>
                <ul>
                  <li>{formData.content?.storeName || 'Cửa hàng Thực phẩm An Khang'}</li>
                  <li>Địa chỉ: {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</li>
                </ul>

                <strong>3. Nội dung kiểm tra:</strong>
                <ul>
                  <li>Kiểm tra điều kiện vệ sinh an toàn thực phẩm</li>
                  <li>Kiểm tra điều kiện phòng cháy chữa cháy</li>
                  <li>Kiểm tra quản lý giá, niêm yết giá</li>
                  <li>Kiểm tra các giấy tờ, chứng từ liên quan đến hoạt động kinh doanh</li>
                </ul>

                <strong>4. Thành phần Đoàn kiểm tra:</strong>
                <ul>
                  <li>Ông Nguyễn Văn A - Trưởng đoàn</li>
                  <li>Bà Trần Thị B - Thành viên</li>
                </ul>

                <strong>5. Yêu cầu:</strong>
                <ul>
                  <li>Chủ cơ sở kinh doanh hoặc người đại diện hợp pháp có mặt tại thời điểm kiểm tra</li>
                  <li>Chuẩn bị đầy đủ hồ sơ, giấy tờ liên quan đến hoạt động kinh doanh</li>
                  <li>Tạo điều kiện thuận lợi cho Đoàn kiểm tra thực hiện nhiệm vụ</li>
                </ul>
              </div>

              <p>Trường hợp có vấn đề phát sinh cần liên hệ:</p>
              <ul>
                <li>Điện thoại: {formData.content?.phone || '028.1234.5678'}</li>
                <li>Email: {formData.content?.email || 'qltt.q1@tphcm.gov.vn'}</li>
              </ul>

              <p>Chi cục Quản lý thị trường Phường 1 trân trọng thông báo để Quý cơ sở kinh doanh được biết và phối hợp thực hiện.</p>
            </div>

            <div className={styles.signature}>
              <div className={styles.signatureBlock}>
                <div className={styles.signatureTitle}>CHI CỤC TRƯỞNG</div>
                <div className={styles.signatureInstruction}>(Ký tên, đóng dấu)</div>
                <div className={styles.signerName}>{formData.issuer.name}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formData.type === 'inspection') {
      return (
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderUnit}>
              <div className={styles.unitName}>UBND THÀNH PHỐ HỒ CHÍ MINH</div>
              <div className={styles.unitSubname}>CHI CỤC QUẢN LÝ THỊ TRƯỜNG Phường 1</div>
            </div>
            <div className={styles.formHeaderInfo}>
              <div>Số: {formData.code}</div>
              <div className={styles.formLocation}>TP. Hồ Chí Minh, {formData.issueDate}</div>
            </div>
          </div>

          <div className={styles.formTitle}>
            <div className={styles.country}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className={styles.motto}>Độc lập - Tự do - Hạnh phúc</div>
            <div className={styles.separator}></div>
            <h1 className={styles.docTitle}>BIÊN BẢN KIỂM TRA</h1>
            <h2 className={styles.docSubtitle}>Điều kiện kinh doanh</h2>
          </div>

          <div className={styles.formBody}>
            <div className={styles.bbInfo}>
              <strong>Căn cứ:</strong>
              <ul>
                <li>Quyết định số {formData.content?.baseDecision || '01/QĐ-KT'} về việc kiểm tra điều kiện kinh doanh;</li>
                <li>Thông báo số {formData.content?.notification || '03/KT-TB'} về việc kiểm tra.</li>
              </ul>
            </div>

            <div className={styles.bbSection}>
              <strong>I. THÀNH PHẦN THAM GIA LẬP BIÊN BẢN</strong>
              
              <div className={styles.bbSubsection}>
                <strong>1. Đại diện cơ quan kiểm tra:</strong>
                <ul>
                  <li><strong>Trưởng đoàn:</strong> Ông Nguyễn Văn A - Chức vụ: Trưởng phòng Nghiệp vụ</li>
                  <li><strong>Thành viên:</strong> Bà Trần Thị B - Chức vụ: Thanh tra viên</li>
                </ul>
              </div>

              <div className={styles.bbSubsection}>
                <strong>2. Đại diện cơ sở được kiểm tra:</strong>
                <ul>
                  <li><strong>Tên cơ sở:</strong> {formData.content?.storeName || 'Cửa hàng Thực phẩm An Khang'}</li>
                  <li><strong>Địa chỉ:</strong> {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</li>
                  <li><strong>Người đại diện:</strong> {formData.content?.representative || 'Nguyễn Thị E'}</li>
                  <li><strong>Chức vụ:</strong> {formData.content?.position || 'Chủ cửa hàng'}</li>
                  <li><strong>Số CMND/CCCD:</strong> {formData.content?.idNumber || '079123456789'}</li>
                  <li><strong>Số điện thoại:</strong> {formData.content?.phone || '0901234567'}</li>
                </ul>
              </div>
            </div>

            <div className={styles.bbSection}>
              <strong>II. THỜI GIAN VÀ ĐỊA ĐIỂM KIỂM TRA</strong>
              <ul>
                <li><strong>Thời gian bắt đầu:</strong> {formData.content?.startTime || '09:00 ngày 15/01/2026'}</li>
                <li><strong>Thời gian kết thúc:</strong> {formData.content?.endTime || '10:30 ngày 15/01/2026'}</li>
                <li><strong>Địa điểm:</strong> {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</li>
              </ul>
            </div>

            <div className={styles.bbSection}>
              <strong>III. NỘI DUNG KIỂM TRA</strong>
              
              <div className={styles.bbSubsection}>
                <strong>1. Về giấy phép kinh doanh:</strong>
                <ul>
                  <li>✓ Đã được cấp Giấy chứng nhận đăng ký kinh doanh số: 0123456789</li>
                  <li>✓ Ngày cấp: 15/06/2024, tại Sở Kế hoạch và Đầu tư Hà Nội</li>
                </ul>
              </div>

              <div className={styles.bbSubsection}>
                <strong>2. Về vệ sinh an toàn thực phẩm:</strong>
                <ul>
                  <li>{formData.content?.foodSafety?.certified ? '✓' : '✗'} {formData.content?.foodSafety?.certified ? 'Đã được cấp' : 'Chưa được cấp'} Giấy chứng nhận cơ sở đủ điều kiện ATTP</li>
                  <li>{formData.content?.foodSafety?.storage ? '✓' : '✗'} Khu vực bảo quản thực phẩm {formData.content?.foodSafety?.storage ? 'đạt yêu cầu' : 'chưa đạt yêu cầu'}</li>
                  <li>{formData.content?.foodSafety?.hygiene ? '✓' : '✗'} Vệ sinh chung {formData.content?.foodSafety?.hygiene ? 'đảm bảo' : 'chưa đảm bảo'}</li>
                </ul>
              </div>

              <div className={styles.bbSubsection}>
                <strong>3. Về phòng cháy chữa cháy:</strong>
                <ul>
                  <li>{formData.content?.fireSafety?.equipment ? '✓' : '✗'} Trang bị thiết bị PCCC {formData.content?.fireSafety?.equipment ? 'đầy đủ' : 'chưa đầy đủ'}</li>
                  <li>{formData.content?.fireSafety?.exit ? '✓' : '✗'} Lối thoát hiểm {formData.content?.fireSafety?.exit ? 'đảm bảo' : 'chưa đảm bảo'}</li>
                </ul>
              </div>

              <div className={styles.bbSubsection}>
                <strong>4. Về quản lý giá:</strong>
                <ul>
                  <li>{formData.content?.priceManagement?.display ? '✓' : '✗'} Niêm yết giá {formData.content?.priceManagement?.display ? 'đúng quy định' : 'chưa đúng quy định'}</li>
                  <li>{formData.content?.priceManagement?.invoice ? '✓' : '✗'} Xuất hóa đơn {formData.content?.priceManagement?.invoice ? 'đầy đủ' : 'chưa đầy đủ'}</li>
                </ul>
              </div>
            </div>

            <div className={styles.bbSection}>
              <strong>IV. KẾT LUẬN</strong>
              <p>{formData.content?.conclusion || 'Qua kiểm tra, cơ sở kinh doanh cơ bản đáp ứng các điều kiện kinh doanh theo quy định. Một số điểm cần khắc phục: bổ sung thêm bình chữa cháy tại khu vực kho.'}</p>
            </div>

            <div className={styles.bbSection}>
              <strong>V. KIẾN NGHỊ</strong>
              <p>{formData.content?.recommendation || 'Yêu cầu cơ sở bổ sung 02 bình chữa cháy BC loại 4kg tại khu vực kho trong vòng 07 ngày kể từ ngày lập biên bản.'}</p>
            </div>

            <div className={styles.signatures}>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureTitle}>ĐẠI DIỆN CƠ SỞ</div>
                <div className={styles.signatureInstruction}>(Ký, ghi rõ họ tên)</div>
                <div className={styles.signerName}>{formData.content?.representative || 'Nguyễn Thị E'}</div>
              </div>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureTitle}>TRƯỞNG ĐOÀN KIỂM TRA</div>
                <div className={styles.signatureInstruction}>(Ký, ghi rõ họ tên)</div>
                <div className={styles.signerName}>Nguyễn Văn A</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formData.type === 'violation') {
      return (
        <div className={styles.formContent}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderUnit}>
              <div className={styles.unitName}>UBND THÀNH PHỐ HỒ CHÍ MINH</div>
              <div className={styles.unitSubname}>CHI CỤC QUẢN LÝ THỊ TRƯỜNG Phường 1</div>
            </div>
            <div className={styles.formHeaderInfo}>
              <div>Số: {formData.code}</div>
              <div className={styles.formLocation}>TP. Hồ Chí Minh, {formData.issueDate}</div>
            </div>
          </div>

          <div className={styles.formTitle}>
            <div className={styles.country}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className={styles.motto}>Độc lập - Tự do - Hạnh phúc</div>
            <div className={styles.separator}></div>
            <h1 className={styles.docTitle}>BIÊN BẢN VI PHẠM HÀNH CHÍNH</h1>
          </div>

          <div className={styles.formBody}>
            <div className={styles.bbInfo}>
              <strong>Căn cứ:</strong>
              <ul>
                <li>Luật Xử lý vi phạm hành chính ngày 20/06/2012;</li>
                <li>Biên bản kiểm tra số {formData.content?.inspectionRecord || 'BB-KT-001'}.</li>
              </ul>
            </div>

            <div className={styles.bbSection}>
              <strong>I. THÀNH PHẦN LẬP BIÊN BẢN</strong>
              
              <div className={styles.bbSubsection}>
                <strong>1. Người lập biên bản:</strong>
                <ul>
                  <li><strong>Họ và tên:</strong> Nguyễn Văn A</li>
                  <li><strong>Chức vụ:</strong> Trưởng phòng Nghiệp vụ</li>
                  <li><strong>Đơn vị:</strong> Chi cục Quản lý thị trường Phường 1</li>
                </ul>
              </div>

              <div className={styles.bbSubsection}>
                <strong>2. Người vi phạm:</strong>
                <ul>
                  <li><strong>Tên cơ sở:</strong> {formData.content?.storeName || 'Cửa hàng Thực phẩm An Khang'}</li>
                  <li><strong>Địa chỉ:</strong> {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</li>
                  <li><strong>Người đại diện:</strong> {formData.content?.representative || 'Nguyễn Thị E'}</li>
                  <li><strong>Số CMND/CCCD:</strong> {formData.content?.idNumber || '079123456789'}</li>
                </ul>
              </div>
            </div>

            <div className={styles.bbSection}>
              <strong>II. THỜI GIAN, ĐỊA ĐIỂM VI PHẠM</strong>
              <ul>
                <li><strong>Thời gian:</strong> {formData.content?.violationTime || '09:30 ngày 15/01/2026'}</li>
                <li><strong>Địa điểm:</strong> {formData.content?.address || '123 Lê Lợi, Phường Bến Nghé, Phường 1, Hà Nội'}</li>
              </ul>
            </div>

            <div className={styles.bbSection}>
              <strong>III. NỘI DUNG VI PHẠM</strong>
              
              <div className={styles.violationList}>
                {formData.content?.violations?.map((v: any, index: number) => (
                  <div key={index} className={styles.violationItem}>
                    <strong>{index + 1}. {v.title}</strong>
                    <p><strong>Căn cứ pháp lý:</strong> {v.legalBasis}</p>
                    <p><strong>Mô tả vi phạm:</strong> {v.description}</p>
                    <p><strong>Mức phạt dự kiến:</strong> {v.penalty}</p>
                  </div>
                )) || (
                  <div className={styles.violationItem}>
                    <strong>1. Vi phạm về vệ sinh an toàn thực phẩm</strong>
                    <p><strong>Căn cứ pháp lý:</strong> Điều 16, Nghị định 115/2018/NĐ-CP</p>
                    <p><strong>Mô tả vi phạm:</strong> Khu vực chế biến thực phẩm không đảm bảo vệ sinh, phát hiện côn trùng gây hại.</p>
                    <p><strong>Mức phạt dự kiến:</strong> Phạt tiền từ 10.000.000đ đến 20.000.000đ</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.bbSection}>
              <strong>IV. TANG VẬT, PHƯƠNG TIỆN VI PHẠM</strong>
              <p>{formData.content?.evidence || 'Không thu giữ tang vật, phương tiện vi phạm.'}</p>
            </div>

            <div className={styles.bbSection}>
              <strong>V. Ý KIẾN CỦA NGƯỜI VI PHẠM</strong>
              <p>{formData.content?.violatorStatement || 'Người vi phạm thừa nhận hành vi vi phạm và cam kết khắc phục trong thời gian sớm nhất.'}</p>
            </div>

            <div className={styles.signatures}>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureTitle}>NGƯỜI VI PHẠM</div>
                <div className={styles.signatureInstruction}>(Ký, ghi rõ họ tên)</div>
                <div className={styles.signerName}>{formData.content?.representative || 'Nguyễn Thị E'}</div>
              </div>
              <div className={styles.signatureColumn}>
                <div className={styles.signatureTitle}>NGƯỜI LẬP BIÊN BẢN</div>
                <div className={styles.signatureInstruction}>(Ký, ghi rõ họ tên)</div>
                <div className={styles.signerName}>Nguyễn Văn A</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div>Không có dữ liệu biểu mẫu</div>;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <div className={styles.dialogHeaderLeft}>
            <FileText size={24} className={styles.dialogIcon} />
            <div>
              <h2 className={styles.dialogTitle}>{formData.title}</h2>
              <p className={styles.dialogSubtitle}>Mã số: {formData.code}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.dialogContent}>
          {renderDecisionContent()}
        </div>

        <div className={styles.dialogFooter}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Đóng
          </button>
          <button className={styles.primaryButton}>
            <FileText size={18} />
            Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
}
