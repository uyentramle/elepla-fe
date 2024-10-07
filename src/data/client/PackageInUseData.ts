export interface IUserPackage {
    plan: string; // FREE, BASIC, PREMIUM
    expiryDate?: string; // expiry date of the plan if applicable
}

const package_in_use_data: IUserPackage = {
    plan: "Gói miễn phí",
    expiryDate: "01/06/2024"
};

export default package_in_use_data;