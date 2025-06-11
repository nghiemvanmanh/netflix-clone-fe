"use client";
import Link from "next/link";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { title: "Giới thiệu", href: "/about" },
      { title: "Nghề nghiệp", href: "/" },
      { title: "Tin tức", href: "/" },
      { title: "Quan hệ nhà đầu tư", href: "/" },
      { title: "Trách nhiệm xã hội", href: "/" },
    ],
    services: [
      { title: "Gói dịch vụ", href: "/" },
      { title: "Thẻ quà tặng", href: "/" },
      { title: "Xem offline", href: "/" },
      { title: "Chất lượng video", href: "/" },
      { title: "Thiết bị hỗ trợ", href: "/" },
    ],
    support: [
      { title: "Trung tâm trợ giúp", href: "/" },
      { title: "Liên hệ", href: "/contact" },
      { title: "Báo cáo sự cố", href: "/" },
      { title: "Tài khoản & thanh toán", href: "/" },
      { title: "Quản lý thiết bị", href: "/" },
    ],
    legal: [
      { title: "Điều khoản sử dụng", href: "/" },
      { title: "Chính sách bảo mật", href: "/privacy" },
      { title: "Chính sách cookie", href: "/" },
      { title: "Thông báo pháp lý", href: "/" },
      { title: "Tùy chọn quảng cáo", href: "/" },
    ],
  };

  const socialLinks = [
    {
      icon: <FacebookOutlined />,
      href: "https://facebook.com/netflix",
      label: "Facebook",
    },
    {
      icon: <TwitterOutlined />,
      href: "https://twitter.com/netflix",
      label: "Twitter",
    },
    {
      icon: <InstagramOutlined />,
      href: "https://instagram.com/netflix",
      label: "Instagram",
    },
    {
      icon: <YoutubeOutlined />,
      href: "https://youtube.com/netflix",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Section - Logo and Social */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="mb-8 md:mb-0">
            <Link
              href="/"
              className="text-4xl font-bold text-red-600 mb-4 block"
            >
              NETFLOP
            </Link>
            <p className="text-gray-400 max-w-md mb-6">
              Dịch vụ streaming hàng đầu với hàng nghìn bộ phim, chương trình
              TV, phim tài liệu và nhiều nội dung giải trí chất lượng cao.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold mb-2">
                Đăng ký nhận tin tức
              </h3>
              <p className="text-gray-400">
                Nhận thông tin về phim mới và ưu đãi đặc biệt
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 md:w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-red-600 text-white"
              />
              <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-md transition-colors duration-300">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* App Download */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <span className="text-gray-400">Tải ứng dụng:</span>
          <div className="flex space-x-4">
            <a
              href="https://apps.apple.com/vn/app/netflix/id363590051?l=vi"
              className="block"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/1024px-App_Store_%28iOS%29.svg.png"
                alt="Download on App Store"
                className="h-10 hover:opacity-80 transition-opacity"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.netflix.mediaclient&hl=vi&pli=1"
              className="block"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                alt="Get it on Google Play"
                className="h-10 hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md">
            <GlobalOutlined className="text-gray-400" />
            <select className="bg-transparent text-gray-300 border-none outline-none">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              <p>&copy; {currentYear} Netflop. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <span>Mã dịch vụ: 123456789</span>
              <span>Giấy phép: GP-TTĐT số 123/GP-TTĐT</span>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-600">
            <p>
              Netflop là dịch vụ streaming giải trí được phát triển cho mục đích
              học tập và demo. Nội dung được cung cấp chỉ mang tính chất minh
              họa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
