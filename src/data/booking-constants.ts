export const problemCategories = [
  "Marriage",
  "Career",
  "Education",
  "Health",
  "Finance",
  "Other",
] as const;

export const dependentCategories: Record<string, string[]> = {
  Marriage: ["Single", "Married", "Divorced", "Widow"],
  Career: ["Student", "Professional", "Business", "Job Seeker"],
  Education: ["School", "College", "Higher Studies"],
  Health: ["Physical", "Mental", "Chronic"],
  Finance: ["Debt", "Investment", "Loss"],
  Other: [],
};

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const preferredTimeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM",
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
  "5:00 PM - 7:00 PM",
  "7:00 PM - 9:00 PM",
  "9:00 PM - 11:00 PM",
] as const;

export const poojaTypes = [
  "Griha Pravesh",
  "Satyanarayan Pooja",
  "Mahamrityunjaya Jaap",
  "Navgraha Shanti",
  "Marriage Pooja",
  "Other",
] as const;

export const ampmOptions = ["AM", "PM"] as const;
