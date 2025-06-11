"use client";
import { BackButton } from "@/components/ui/back-button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />
      <div className="max-w-4xl mx-auto px-4 py-16  bg-black/80 rounded-lg ">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Chính sách bảo mật
        </h1>
        <div className="prose prose-invert max-w-none space-y-6 ">
          <p className="text-lg">
            Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và
            bảo vệ thông tin của bạn.
          </p>

          <h2 className="text-2xl font-semibold">
            1. Thông tin chúng tôi thu thập
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Thông tin tài khoản (tên, email, mật khẩu)</li>
            <li>Thông tin thanh toán và hóa đơn</li>
            <li>Lịch sử xem và sở thích nội dung</li>
            <li>Thông tin thiết bị và kỹ thuật</li>
            <li>Dữ liệu vị trí (nếu được cho phép)</li>
          </ul>

          <h2 className="text-2xl font-semibold">
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Cung cấp và cải thiện dịch vụ</li>
            <li>Cá nhân hóa nội dung và đề xuất</li>
            <li>Xử lý thanh toán và hỗ trợ khách hàng</li>
            <li>Gửi thông báo và cập nhật dịch vụ</li>
            <li>Phân tích và nghiên cứu thị trường</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. Chia sẻ thông tin</h2>
          <p>
            Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn
            với bên thứ ba trừ khi có sự đồng ý của bạn hoặc theo yêu cầu pháp
            lý.
          </p>

          <h2 className="text-2xl font-semibold">4. Bảo mật thông tin</h2>
          <p>
            Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông
            tin của bạn, bao gồm mã hóa SSL, tường lửa và kiểm soát truy cập
            nghiêm ngặt.
          </p>

          <h2 className="text-2xl font-semibold">5. Quyền của bạn</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Truy cập và cập nhật thông tin cá nhân</li>
            <li>Yêu cầu xóa tài khoản và dữ liệu</li>
            <li>Từ chối nhận email marketing</li>
            <li>Kiểm soát cài đặt quyền riêng tư</li>
          </ul>

          <h2 className="text-2xl font-semibold">6. Liên hệ</h2>
          <p>
            Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với
            chúng tôi qua:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Email: privacy@netflix.vn</li>
            <li>Điện thoại: 1900-1234</li>
            <li>Địa chỉ: 123 Đường XYZ, Quận 1, TP.HCM</li>
          </ul>

          <p className="text-sm text-gray-400 mt-8">
            Chính sách này có hiệu lực từ ngày 01/01/2024 và có thể được cập
            nhật định kỳ.
          </p>
        </div>
      </div>
    </div>
  );
}
