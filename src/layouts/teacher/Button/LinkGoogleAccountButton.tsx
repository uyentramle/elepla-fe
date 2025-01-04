import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useGoogleLogin } from '@react-oauth/google';
import { linkGoogleAccount } from "@/data/admin/UserData";

const LinkGoogleAccountButton: React.FC<{ currentUserId: string, googleEmail: string }> = ({ currentUserId, googleEmail }) => {
    const [isLinked, setIsLinked] = useState(false); // Trạng thái liên kết

    useEffect(() => {
        // Nếu đã có email Google, set trạng thái là đã liên kết
        if (googleEmail) {
            setIsLinked(true);
        }
    }, [googleEmail]);

    const linkAccount = useGoogleLogin({
        onSuccess: (credentialResponse) => {
            // Khi đăng nhập thành công, gọi API để liên kết tài khoản Google
            handleLinkGoogle(credentialResponse.code);
        },
        flow: 'auth-code'
    });

    const handleLinkGoogle = async (googleToken: string) => {
        try {
            // Gọi API để liên kết tài khoản Google với người dùng
            const success = await linkGoogleAccount(currentUserId, googleToken);

            if (success) {
                setIsLinked(true); // Đặt trạng thái là đã liên kết
                message.success("Tài khoản Google đã được liên kết thành công");
            } else {
                message.error("Tài khoản Google này đã được liên kết với một tài khoản khác");
            }
        } catch (error) {
            message.error("Đã có lỗi xảy ra khi liên kết tài khoản Google");
        }
    };

    const handleLinkButtonClick = () => {
        if (!isLinked) {
            linkAccount(); // Gọi login nếu chưa liên kết
        } else {
            // Nếu đã liên kết, có thể hủy liên kết ở đây
            message.info("Tài khoản Google đã liên kết");
        }
    };

    return (
        <Button
            onClick={handleLinkButtonClick}
            type="default"
            // shape="circle"
            size="small"
            className="mt-1 rounded bg-gray-300 px-2 py-1 text-sm text-gray-700"
            // icon={<GoogleOutlined />}
            disabled={isLinked}
        >
            {isLinked ? 'Đã liên kết' : 'Liên kết'}
        </Button>
    );
};

export default LinkGoogleAccountButton;
