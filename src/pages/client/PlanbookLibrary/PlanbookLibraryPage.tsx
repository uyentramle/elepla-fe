import { useEffect, useState } from "react";
import { getAllPlanbooks, PlanbookItem } from "@/api/ApiGetAllPlanbook";
import { Spin, Card, Avatar, Button, Input, Dropdown, Menu } from "antd";
import { FileOutlined, UserOutlined, BookOutlined, SearchOutlined, EllipsisOutlined, SaveOutlined, BlockOutlined } from "@ant-design/icons";
import PlanbookDetailForm from "@/pages/academy-staff/PlanbookManagement/PlanbookDetailForm";

const PlanbookLibraryPage: React.FC = () => {
  const [planbooks, setPlanbooks] = useState<PlanbookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlanbooks = async () => {
      try {
        const data = await getAllPlanbooks(0, 50);
        setPlanbooks(data);
      } catch (error) {
        console.error("Error fetching planbooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanbooks();
  }, []);

  const filteredPlanbooks = planbooks.filter((planbook) =>
    planbook.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planbook.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planbook.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuClick = (key: string, planbookId: string) => {
    setSelectedPlanbook(planbookId); // Lưu planbookId vào state
    switch (key) {
      case "detail":
        setSelectedPlanbook(planbookId);
        setDetailVisible(true);
        break;
      case "save":
        console.log("Lưu planbook:", planbookId);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">Khám phá thư viện kế hoạch bài dạy</h1>
      <div className="flex justify-center">
        <div className="mb-4 w-[500px]">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            suffix={<SearchOutlined />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlanbooks.map((planbook) => (
          <Card
            key={planbook.planbookId}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden w-[260px] relative"
            hoverable
          >
            {/* Dropdown menu ở góc trên bên phải */}
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleMenuClick(key, planbook.planbookId)}>
                  <Menu.Item key="detail" icon={<BlockOutlined />}>
                    Chi tiết
                  </Menu.Item>
                  <Menu.Item key="save" icon={<SaveOutlined />}>
                    Lưu
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button
                shape="default"
                icon={<EllipsisOutlined />}
                className="absolute top-2 right-2 border-none"
              />
            </Dropdown>

            {/* Nội dung của card */}
            <div className="flex flex-col items-center text-center h-full">
              <Avatar
                shape="square"
                size={64}
                icon={<FileOutlined />}
                className="mb-3 bg-blue-100 text-blue-600"
              />
              <div className="h-[60px]">
                <h3 className="text-lg font-semibold text-gray-700 line-clamp-2">{planbook.lessonName}</h3>
              </div>
              <div className="flex flex-grow justify-between items-center w-full text-gray-500 text-sm mt-8">
                <div className="flex items-center justify-start w-1/2">
                  <UserOutlined className="mr-2" />
                  <span>{planbook.teacherName}</span>
                </div>
                <div className="flex items-center justify-end w-1/2">
                  <BookOutlined className="mr-2" />
                  <span>{planbook.subject}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Planbook Detail Modal */}
      {selectedPlanbook && (
      <PlanbookDetailForm planbookId={selectedPlanbook} isVisible={detailVisible} onClose={() => setDetailVisible(false)} />
      )}
      </div>
  );
};

export default PlanbookLibraryPage;
