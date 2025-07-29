import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu mã xác thực.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message || "Xác thực email thành công!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Xác thực thất bại hoặc token đã hết hạn."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        {status === "verifying" && (
          <>
            <div className="text-blue-600 text-lg font-medium">
              Đang xác thực email...
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-600 text-xl font-semibold mb-4">
              ✅ Thành công
            </div>
            <p className="text-gray-700 mb-6">{message}</p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600  rounded hover:bg-blue-700 transition"
            >
              Đăng nhập ngay
            </a>
            <a
              href={`/reset-password?token=${token}`}
              className="inline-block px-4 py-2 bg-blue-600  rounded hover:bg-blue-700 transition"
            >
              Reset Password
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-600 text-xl font-semibold mb-4">
              ❌ Lỗi
            </div>
            <p className="text-gray-700 mb-6">{message}</p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Về trang chủ
            </a>
          </>
        )}
      </div>
    </div>
  );
}
