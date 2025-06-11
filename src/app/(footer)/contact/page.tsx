"use client";

import { Form, Input, Button, Select, message } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { BackButton } from "@/components/ui/back-button";
const { TextArea } = Input;
const { Option } = Select;

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Contact form submitted:", values);
    message.success(
      "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h."
    );
    form.resetFields();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />
      <div className="absolute inset-0 w-auto h-auto">
        <Image
          src="/netflix-background.jpg"
          alt="Netflix Background"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 z-10">
        <h1 className="text-4xl font-bold mb-8 text-center z-10">
          Liên hệ với chúng tôi
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-black/80 p-8 rounded-lg z-10">
            <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6 ">
              <div className="flex items-start space-x-4">
                <PhoneOutlined className="text-red-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Hotline hỗ trợ</h3>
                  <p className="text-gray-300">1900-1234 (24/7)</p>
                  <p className="text-gray-300">028-1234-5678</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MailOutlined className="text-red-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-300">support@netflix.vn</p>
                  <p className="text-gray-300">business@netflix.vn</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <EnvironmentOutlined className="text-red-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Địa chỉ</h3>
                  <p className="text-gray-300">
                    Tầng 10, Tòa nhà ABC
                    <br />
                    123 Đường XYZ, Quận 1<br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <ClockCircleOutlined className="text-red-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Giờ làm việc</h3>
                  <p className="text-gray-300">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  <p className="text-gray-300">
                    Thứ 7 - Chủ nhật: 9:00 - 17:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-black/80 p-8 rounded-lg z-10">
            <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4"
            >
              <Form.Item
                name="name"
                label={<span className="text-white">Họ và tên</span>}
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nhập họ và tên của bạn"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-white">Email</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nhập địa chỉ email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<span className="text-white">Số điện thoại</span>}
              >
                <Input
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>

              <Form.Item
                name="subject"
                label={<span className="text-white">Chủ đề</span>}
                rules={[{ required: true, message: "Vui lòng chọn chủ đề!" }]}
              >
                <Select className="bg-gray-800" placeholder="Chọn chủ đề">
                  <Option value="technical">Hỗ trợ kỹ thuật</Option>
                  <Option value="billing">Thanh toán & Hóa đơn</Option>
                  <Option value="content">Nội dung & Chương trình</Option>
                  <Option value="account">Tài khoản</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="message"
                label={<span className="text-white">Tin nhắn</span>}
                rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
              >
                <TextArea
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-red-600 hover:bg-red-700 border-red-600"
                  size="large"
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
