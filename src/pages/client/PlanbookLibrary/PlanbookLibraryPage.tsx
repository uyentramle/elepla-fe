import { useEffect, useState } from "react";
import { getAllPlanbooks, PlanbookItem } from "@/api/ApiGetAllPlanbook";
import { getPlanbookById, PlanbookDetail } from "@/api/ApiGetAllPlanbook";
import { Spin, Card } from "antd";
import { FileOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import PlanbookDetailModal from "@/layouts/client/Components/PlanbookDetailModal/PlanbookDetailModal"; // Import component mới

const PlanbookLibraryPage: React.FC = () => {
  const [planbooks, setPlanbooks] = useState<PlanbookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanbook, setSelectedPlanbook] = useState<PlanbookDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

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

  const handleCardClick = async (planbookId: string) => {
    setModalLoading(true);
    setIsModalVisible(true);
    try {
      const data = await getPlanbookById(planbookId);
      setSelectedPlanbook(data);
    } catch (error) {
      console.error("Error fetching planbook details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalClose = () => {
    setSelectedPlanbook(null);
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Khám phá thư viện giáo án</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {planbooks.map((planbook) => (
          <Card
            key={planbook.planbookId}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            hoverable
            onClick={() => handleCardClick(planbook.planbookId)}
          >
            <div className="flex flex-col items-center text-center">
              <FileOutlined className="text-blue-500 text-6xl mb-3" />
              <h3 className="text-lg font-semibold mb-3">{planbook.lessonName}</h3>
              <div className="flex justify-between w-full text-gray-500 text-sm">
                <div className="flex items-center">
                  <UserOutlined className="mr-2" />
                  <span>{planbook.teacherName}</span>
                </div>
                <div className="flex items-center">
                  <BookOutlined className="mr-2" />
                  <span>{planbook.subject}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

  {/* Sử dụng PlanbookDetailModal */}
  <PlanbookDetailModal
        visible={isModalVisible}
        loading={modalLoading}
        planbook={selectedPlanbook}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default PlanbookLibraryPage;
