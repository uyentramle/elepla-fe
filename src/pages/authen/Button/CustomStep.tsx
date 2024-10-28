import React from "react";

const CustomStep: React.FC<{ icon: React.ReactNode; title: string; isActive: boolean }> = ({ icon, title, isActive }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#1890ff' : '#d9d9d9', // Xanh nếu active, xám nếu không
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '8px', // Khoảng cách dưới
            }}
        >
            {icon}
        </div>
        <div style={{ textAlign: 'center' }}>{title}</div>
    </div>
);

export default CustomStep;