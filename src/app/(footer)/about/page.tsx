export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Giới thiệu về Netflix Clone
        </h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-6">
            Netflix Clone là nền tảng streaming giải trí hàng đầu, mang đến cho
            bạn hàng nghìn bộ phim, chương trình truyền hình, phim tài liệu và
            nội dung gốc chất lượng cao.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="mb-6">
            Chúng tôi cam kết mang đến trải nghiệm giải trí tốt nhất cho người
            dùng Việt Nam, với nội dung đa dạng, chất lượng cao và dịch vụ khách
            hàng xuất sắc.
          </p>
          <h2 className="text-2xl font-semibold mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Thư viện nội dung khổng lồ với hàng nghìn tựa phim</li>
            <li>Chất lượng video 4K Ultra HD và âm thanh Dolby Atmos</li>
            <li>Xem trên mọi thiết bị, mọi lúc, mọi nơi</li>
            <li>Không quảng cáo, không cam kết dài hạn</li>
            <li>Hỗ trợ khách hàng 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
