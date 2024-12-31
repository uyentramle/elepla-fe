import { useEffect, useState } from "react";
import { Spin, Card, Avatar, Button, Input, Dropdown, Menu, message, List, Modal, Radio, Select, Pagination } from "antd";
import { FileOutlined, UserOutlined, BookOutlined, SearchOutlined, EllipsisOutlined, SaveOutlined, BlockOutlined } from "@ant-design/icons";
import PlanbookDetailForm from "@/pages/academy-staff/PlanbookManagement/PlanbookDetailForm";
import { getSavedPlanbookCollectionsByTeacherId, Collection, createPlanbookCollection } from "@/data/teacher/CollectionData";
import { getUserId } from '@/data/apiClient';
import { savePlanbook, getAllPlanbooks, Planbook } from "@/data/academy-staff/PlanbookData";
import { getAllCurriculumFramework, IViewListCurriculum } from "@/data/admin/CurriculumFramworkData";
import { getAllSubject, IViewListSubject } from "@/data/admin/SubjectData";
import { getAllGrade, IViewListGrade } from "@/data/admin/GradeData";

const { Option, OptGroup } = Select;

const PlanbookLibraryPage: React.FC = () => {
  const [planbooks, setPlanbooks] = useState<Planbook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanbook, setSelectedPlanbook] = useState<string | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false); // Hiển thị modal
  const [collections, setCollections] = useState<Collection[]>([]); // Danh sách collections
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isCreatingNewCollection, setIsCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectOptions, setSubjectOptions] = useState<IViewListSubject[]>([]); // Danh sách môn học
  const [filterSubject, setFilterSubject] = useState<string[]>([]);
  const [gradeOptions, setGradeOptions] = useState<IViewListGrade[]>([]); // Danh sách khối lớp
  const [filterGrade, setFilterGrade] = useState<string[]>([]);
  const [curriculumOptions, setCurriculumOptions] = useState<IViewListCurriculum[]>([]); // Danh sách khung chương trình
  const [filterCurriculum, setFilterCurriculum] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // Lưu trữ các giá trị đã chọn
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const pageSize = 12; // Số lượng planbook mỗi trang
  
  useEffect(() => {
    const fetchPlanbooks = async () => {
      try {
        const data = await getAllPlanbooks();
        setPlanbooks(data);
      } catch (error) {
        console.error("Error fetching planbooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanbooks();
  }, [searchTerm, filterSubject, filterGrade, filterCurriculum]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getAllSubject();
        setSubjectOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu môn học, vui lòng thử lại sau");
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await getAllGrade();
        setGradeOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khối lớp, vui lòng thử lại sau");
      }
    }

    const fetchCurriculums = async () => {
      try {
        const response = await getAllCurriculumFramework();
        setCurriculumOptions(response);
      } catch (error) {
        message.error("Không thể tải dữ liệu khung chương trình, vui lòng thử lại sau");
      }
    };

    fetchSubjects();
    fetchGrades();
    fetchCurriculums();
  }, []);

  const filteredPlanbooks = planbooks.filter((planbook) => {
    const matchesSearch =
      planbook.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planbook.chapterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planbook.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planbook.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = !filterSubject.length || filterSubject.includes(planbook.subject);  // Kiểm tra nếu subject có trong mảng
    const matchesGrade = !filterGrade.length || filterGrade.includes(planbook.grade);  // Kiểm tra nếu grade có trong mảng
    const matchesCurriculum = !filterCurriculum.length || filterCurriculum.includes(planbook.curriculum);  // Kiểm tra nếu curriculum có trong mảng

    return matchesSearch && matchesSubject && matchesGrade && matchesCurriculum;
  });

  const handleFilterChange = (values: string[]) => {
    const searchFilter = values.find((value) => value.startsWith("search:"));
    const subjectFilter = values.filter((value) => value.startsWith("subject:")).map((value) => value.split(":")[1]);
    const gradeFilter = values.filter((value) => value.startsWith("grade:")).map((value) => value.split(":")[1]);
    const curriculumFilter = values.filter((value) => value.startsWith("curriculum:")).map((value) => value.split(":")[1]);

    // Cập nhật các giá trị lọc
    setSearchTerm(searchFilter ? searchFilter.split(":")[1] : "");
    setFilterSubject(subjectFilter);
    setFilterGrade(gradeFilter);
    setFilterCurriculum(curriculumFilter);

    setSelectedFilters(values);
    setCurrentPage(1); // Reset lại trang về trang 1
  };

  const handleMenuClick = (key: string, planbookId: string) => {
    setSelectedPlanbook(planbookId); // Lưu planbookId vào state
    switch (key) {
      case "detail":
        setSelectedPlanbook(planbookId);
        setIsDetailVisible(true);
        break;
      case "save":
        handleSaveClick(planbookId);
        break;
      default:
        break;
    }
  };

  const handleSaveClick = async (planbookId: string) => {
    setIsSaveModalVisible(true); // Hiển thị modal
    setSelectedPlanbook(planbookId); // Lưu planbookId được chọn
    setLoadingCollections(true); // Hiển thị trạng thái loading
    try {
      // Gọi API để lấy danh sách collections
      const response = await getSavedPlanbookCollectionsByTeacherId(getUserId()!);
      setCollections(response); // Lưu danh sách collections vào state
    } catch (error) {
      console.error("Lỗi khi lấy collections:", error);
    } finally {
      setLoadingCollections(false); // Tắt trạng thái loading
    }
  };

  const handleSaveToCollection = async (collectionId: string) => {
    if (!selectedPlanbook) {
      message.error("Vui lòng chọn bộ sưu tập để lưu Planbook!");
      return;
    }

    try {
      // Gọi API lưu Planbook vào Collection
      const response = await savePlanbook(collectionId, selectedPlanbook);

      if (response) {
        message.success("Đã lưu");
      } else {
        message.error("Bài dạy đã tồn tại trong bộ sưu tập này!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu Planbook:", error);
    } finally {
      setIsSaveModalVisible(false); // Ẩn modal
    }
  };

  const handleDone = async () => {
    // if (isCreatingNewCollection) {
    //   await handleSaveNewCollection();
    //   return;
    // }

    if (!selectedCollection) {
      message.error("Vui lòng chọn bộ sưu tập để lưu Planbook!");
      return;
    }
    await handleSaveToCollection(selectedCollection);
    // setIsSaveModalVisible(false);
  };

  const handleSaveNewCollection = async () => {
    if (!newCollectionName.trim()) {
      message.error("Tên bộ sưu tập không được để trống!");
      return;
    }

    try {
      setLoadingCollections(true); // Hiển thị trạng thái loading
      const success = await createPlanbookCollection(newCollectionName, true, getUserId()!);

      if (success) {
        // Sau khi tạo bộ sưu tập mới, tải lại danh sách từ API
        const response = await getSavedPlanbookCollectionsByTeacherId(getUserId()!);
        setCollections(response); // Cập nhật danh sách collections

        // Tự động chọn bộ sưu tập mới tạo (giả định API trả về bộ sưu tập mới nhất)
        const latestCollection = response.find(
          (collection) => collection.collectionName === newCollectionName
        );

        if (latestCollection) {
          setSelectedCollection(latestCollection.collectionId);
        }

        // Reset trạng thái
        setIsCreatingNewCollection(false);
        setNewCollectionName("");
      } else {
        message.error("Không thể tạo bộ sưu tập!");
      }
    } catch (error) {
      // console.error(error);
      message.error("Đã xảy ra lỗi khi tạo bộ sưu tập!");
    } finally {
      setLoadingCollections(false); // Ẩn trạng thái loading
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentPlanbooks = filteredPlanbooks.slice(startIndex, startIndex + pageSize);

  // Hàm xử lý thay đổi trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
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
      {/* <div className="flex justify-center">
        <div className="mb-2 w-[500px]">
          <Input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            suffix={<SearchOutlined />}
          />
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <Select
              id="subject-filter"
              className="w-48 mr-2"
              value={filterSubject}
              onChange={(value) => setFilterSubject(value)}
              placeholder="Chọn môn học"
            >
              <Option value="">Tất cả môn học</Option>
              {subjectOptions.map((option) => (
                <Option key={option.name} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
            <Select
              id="grade-filter"
              className="w-48 mr-2"
              value={filterGrade}
              onChange={(value) => setFilterGrade(value)}
              placeholder="Chọn khối lớp"
            >
              <Option value="">Tất cả khối</Option>
              {gradeOptions.map((option) => (
                <Option key={option.name} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
            <Select
              id="curriculum-filter"
              className="w-48"
              value={filterCurriculum}
              onChange={(value) => setFilterCurriculum(value)}
              placeholder="Chọn khung chương trình"
            >
              <Option value="">Tất cả chương trình</Option>
              {curriculumOptions.map((option) => (
                <Option key={option.name} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
        </div> */}
      <div className="flex justify-center mb-4">
        <Select
          mode="multiple"
          allowClear
          showSearch
          className="w-[500px]"
          placeholder="Tìm kiếm hoặc chọn bộ lọc..."
          value={selectedFilters}
          onSearch={(value) => setSearchTerm(value)}
          onChange={(values) => handleFilterChange(values)}
          suffixIcon={<SearchOutlined />}
        >
          {/* Tìm kiếm theo từ khóa */}
          {/* <Option key="search" value={`search:${searchTerm}`}>
      Tìm kiếm: "{searchTerm}"
    </Option> */}

          {/* Các bộ lọc môn học */}
          <OptGroup label="Môn học">
            {subjectOptions.map((option) => (
              <Option key={`subject:${option.name}`} value={`subject:${option.name}`}>
                {option.name}
              </Option>
            ))}
          </OptGroup>

          {/* Các bộ lọc khối lớp */}
          <OptGroup label="Khối lớp">
            {gradeOptions.map((option) => (
              <Option key={`grade:${option.name}`} value={`grade:${option.name}`}>
                {option.name}
              </Option>
            ))}
          </OptGroup>

          {/* Các bộ lọc khung chương trình */}
          <OptGroup label="Khung chương trình">
            {curriculumOptions.map((option) => (
              <Option key={`curriculum:${option.name}`} value={`curriculum:${option.name}`}>
                {option.name}
              </Option>
            ))}
          </OptGroup>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPlanbooks.map((planbook) => (
          <Card
            key={planbook.planbookId}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg overflow-hidden w-full relative"
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredPlanbooks.length}
          onChange={onPageChange}
          showSizeChanger={false} // Tắt chức năng thay đổi số lượng item mỗi trang
        />
      </div>

      {/* Planbook Detail Modal */}
      {selectedPlanbook && (
        <PlanbookDetailForm planbookId={selectedPlanbook} isVisible={isDetailVisible} onClose={() => setIsDetailVisible(false)} isLibrary={true} />
      )}

      <Modal
        className="text-center"
        title={<span style={{ fontSize: 18, fontWeight: "600" }}>Bộ sưu tập</span>}
        visible={isSaveModalVisible}
        onCancel={() => setIsSaveModalVisible(false)}
        footer={[
          isCreatingNewCollection ? (
            <Button key="create" type="primary" onClick={handleSaveNewCollection} loading={loadingCollections}>
              Tạo bộ sưu tập
            </Button>
          ) : (
            <Button key="done" type="primary" onClick={handleDone}>
              Lưu
            </Button>
          ),
        ]}
      // bodyStyle={{
      //   maxHeight: 400, // Giới hạn chiều cao tối đa
      //   overflowY: "auto", // Thêm thanh cuộn dọc khi nội dung quá dài
      //   padding: "16px",
      // }}
      >
        {loadingCollections ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Radio.Group
              onChange={(e) => setSelectedCollection(e.target.value)}
              value={selectedCollection}
              style={{ width: "100%" }}
            >
              <div
                style={{
                  maxHeight: 400, // Giới hạn chiều cao tối đa của danh sách
                  overflowY: "auto", // Thêm thanh cuộn dọc khi nội dung quá dài
                  border: "1px solid #f0f0f0", // Tùy chọn: Thêm viền để phân biệt rõ phần danh sách
                  borderRadius: 8, // Bo góc
                }}
              >
                <List
                  dataSource={collections}
                  renderItem={(collection) => (
                    <List.Item
                      key={collection.collectionId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        borderRadius: 8,
                        transition: "background-color 0.3s",
                      }}
                      onClick={() => setSelectedCollection(collection.collectionId)}
                    >
                      <Radio value={collection.collectionId} style={{ marginRight: 16 }} />
                      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        {/* <Avatar
                  src={collection.avatar || "https://via.placeholder.com/48"}
                  size={48}
                  style={{ marginRight: 12 }}
                /> */}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{collection.collectionName}</div>
                          {/* <div style={{ fontSize: 12, color: "#888" }}>
                    {collection.contributorsCount} Contributors
                  </div> */}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Radio.Group>
            {isCreatingNewCollection ? (
              <div style={{ display: "flex", alignItems: "center", marginTop: 16 }} className="gap-1">
                <Input
                  placeholder="Nhập tên bộ sưu tập"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <Button onClick={() => setIsCreatingNewCollection(false)}>Hủy</Button>
              </div>
            ) : (
              <Button
                type="dashed"
                block
                style={{
                  marginTop: 16,
                  height: 48,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 8,
                }}
                onClick={() => setIsCreatingNewCollection(true)}
              >
                + Tạo bộ sưu tập mới
              </Button>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default PlanbookLibraryPage;
