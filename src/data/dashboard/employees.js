export const EMPLOYEE_DEPARTMENTS = [
  "Sales",
  "Digital Marketing",
  "Accounts",
  "HR",
  "Development",
  "Support",
  "Operations",
];

export const EMPLOYEE_POSITIONS = [
  "Sales",
  "Marketing Executive",
  "Accountant",
  "HR Executive",
  "Software Engineer",
  "Support Agent",
  "Operations Manager",
];

export const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract", "Intern"];

export const OFFICE_LOCATIONS = [
  "Head Office - Dhaka",
  "Mirpur Branch",
  "Chittagong Branch",
  "Remote",
];

export const WORKING_SHIFTS = [
  "General (9:00 AM - 6:00 PM)",
  "Morning (8:00 AM - 4:00 PM)",
  "Evening (2:00 PM - 10:00 PM)",
  "Night (10:00 PM - 6:00 AM)",
];

export const WEEKEND_DAYS = [
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

const SEED = [
  {
    id: 116,
    code: "116",
    name: "Anik Chowdhury",
    department: "Sales",
    position: "Sales",
    employment_type: "Full Time",
    email: "anik.softifybd@gmail.com",
    phone_number: "01894431223",
    joining_date: "1 Aug 2026",
    status: "Active",
    office_location: "Head Office - Dhaka",
    shift: "General (9:00 AM - 6:00 PM)",
    gender: "Male",
    weekends: ["Friday", "Saturday"],
  },
  {
    id: 3,
    code: "0003",
    name: "Showmik Hossain",
    department: "Digital Marketing",
    position: "Sales",
    employment_type: "Full Time",
    email: "showmik@gmail.coom",
    phone_number: "01700000000",
    joining_date: "1 Jun 2026",
    status: "Active",
    office_location: "Head Office - Dhaka",
    shift: "General (9:00 AM - 6:00 PM)",
    gender: "Male",
    weekends: ["Friday", "Saturday"],
  },
  {
    id: 4,
    code: "0004",
    name: "Nusrat Jahan",
    department: "Accounts",
    position: "Accountant",
    employment_type: "Full Time",
    email: "nusrat@softifybd.com",
    phone_number: "01711223344",
    joining_date: "15 Mar 2026",
    status: "Active",
    office_location: "Mirpur Branch",
    shift: "Morning (8:00 AM - 4:00 PM)",
    gender: "Female",
    weekends: ["Friday"],
  },
  {
    id: 5,
    code: "0005",
    name: "Rafiul Islam",
    department: "Development",
    position: "Software Engineer",
    employment_type: "Full Time",
    email: "rafiul@softifybd.com",
    phone_number: "01855667788",
    joining_date: "10 Jan 2026",
    status: "Active",
    office_location: "Head Office - Dhaka",
    shift: "General (9:00 AM - 6:00 PM)",
    gender: "Male",
    weekends: ["Friday", "Saturday"],
  },
  {
    id: 6,
    code: "0006",
    name: "Farhana Akter",
    department: "HR",
    position: "HR Executive",
    employment_type: "Full Time",
    email: "farhana@softifybd.com",
    phone_number: "01999887766",
    joining_date: "20 Feb 2026",
    status: "Active",
    office_location: "Head Office - Dhaka",
    shift: "General (9:00 AM - 6:00 PM)",
    gender: "Female",
    weekends: ["Friday", "Saturday"],
  },
  {
    id: 7,
    code: "0007",
    name: "Imran Hossain",
    department: "Support",
    position: "Support Agent",
    employment_type: "Part Time",
    email: "imran@softifybd.com",
    phone_number: "01612345678",
    joining_date: "5 Apr 2026",
    status: "Active",
    office_location: "Chittagong Branch",
    shift: "Evening (2:00 PM - 10:00 PM)",
    gender: "Male",
    weekends: ["Friday"],
  },
  {
    id: 8,
    code: "0008",
    name: "Tahmina Rahman",
    department: "Operations",
    position: "Operations Manager",
    employment_type: "Full Time",
    email: "tahmina@softifybd.com",
    phone_number: "01555666777",
    joining_date: "12 May 2026",
    status: "Inactive",
    office_location: "Remote",
    shift: "General (9:00 AM - 6:00 PM)",
    gender: "Female",
    weekends: ["Saturday", "Sunday"],
  },
  {
    id: 9,
    code: "0009",
    name: "Karim Uddin",
    department: "Sales",
    position: "Sales",
    employment_type: "Contract",
    email: "karim@softifybd.com",
    phone_number: "01777888999",
    joining_date: "1 Jul 2026",
    status: "Active",
    office_location: "Mirpur Branch",
    shift: "Morning (8:00 AM - 4:00 PM)",
    gender: "Male",
    weekends: ["Friday"],
  },
];

export function buildEmployeeRows(count = 25) {
  const names = [
    "Anik Chowdhury",
    "Showmik Hossain",
    "Nusrat Jahan",
    "Rafiul Islam",
    "Farhana Akter",
    "Imran Hossain",
    "Tahmina Rahman",
    "Karim Uddin",
    "Sabbir Ahmed",
    "Maliha Khan",
  ];
  return Array.from({ length: count }, (_, i) => {
    if (SEED[i]) return { ...SEED[i] };
    const id = i + 10;
    return {
      id,
      code: String(id).padStart(4, "0"),
      name: names[i % names.length],
      department: EMPLOYEE_DEPARTMENTS[i % EMPLOYEE_DEPARTMENTS.length],
      position: EMPLOYEE_POSITIONS[i % EMPLOYEE_POSITIONS.length],
      employment_type: EMPLOYMENT_TYPES[i % EMPLOYMENT_TYPES.length],
      email: `employee${id}@softifybd.com`,
      phone_number: `017${String(10000000 + i * 137).slice(0, 8)}`,
      joining_date: `${(i % 28) + 1} Aug 2026`,
      status: i % 9 === 0 ? "Inactive" : "Active",
      office_location: OFFICE_LOCATIONS[i % OFFICE_LOCATIONS.length],
      shift: WORKING_SHIFTS[i % WORKING_SHIFTS.length],
      gender: i % 2 === 0 ? "Male" : "Female",
      weekends: i % 3 === 0 ? ["Friday"] : ["Friday", "Saturday"],
    };
  });
}

export function getEmployeeById(id) {
  const num = Number(id);
  return buildEmployeeRows(25).find((e) => e.id === num) || null;
}
