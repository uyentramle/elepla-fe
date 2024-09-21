interface PackageItem {
   id: number;
   name: string,
   price: string,
   description: string,
   schoolyear: string,
}[];

const package_data: PackageItem[] = [
   {
      id: 1,
      name: 'Gói miễn phí',
      price: '0 VND',
      description: 'Quản lý 1 kế hoạch giảng dạy trong 1 niên khóa của 1 môn học',
      schoolyear: 'Năm học 2024-2025',
   },
   {
      id: 2,
      name: 'Gói cơ bản',
      price: '299.000 VND',
      description: 'Quản lý kế hoạch giảng dạy của 1 môn học trong 1 niên khóa',
      schoolyear: 'Năm học 2024-2025',
   },
   {
      id: 3,
      name: 'Gói cao cấp',
      price: '1.499.000 VND',
      description: 'Quản lý kế hoạch giảng dạy của 1 môn học trong 1 niên khóa',
      schoolyear: 'Năm học 2024-2025',
   },
];
export default package_data;
