const makeUniqueSuffix = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const toCode = (value, prefix, length = 6) => {
  return `${prefix}${value.replace(/-/g, "").slice(0, length).toUpperCase()}`;
};

export const TEST_PASSWORD = "Password123!";
export const INVALID_ID = "invalid-id";

export const generateUniqueEmail = (prefix = "test") => {
  return `${prefix}-${makeUniqueSuffix()}@example.com`;
};

export const generateUniqueRegistrationNumber = (prefix = "REG") => {
  return `${prefix}${makeUniqueSuffix().replace(/-/g, "")}`;
};

export const generateUniqueDepartmentCode = (prefix = "DP") => {
  return toCode(makeUniqueSuffix(), prefix, 6);
};

export const generateUniqueCourseCode = (prefix = "CRS") => {
  return toCode(makeUniqueSuffix(), prefix, 6);
};

export const generateUniqueEmployeeId = (prefix = "EMP") => {
  return toCode(makeUniqueSuffix(), prefix, 6);
};

export const generateUniqueSubjectCode = (prefix = "SUB") => {
  return toCode(makeUniqueSuffix(), prefix, 6);
};

export const createUserPayload = (overrides = {}) => ({
  name: "Test User",
  email: generateUniqueEmail(),
  password: TEST_PASSWORD,
  role: "STUDENT",
  ...overrides,
});

export const createStudentPayload = (overrides = {}) => ({
  name: "Test Student",
  email: generateUniqueEmail("student"),
  password: TEST_PASSWORD,
  role: "STUDENT",
  registrationNumber: generateUniqueRegistrationNumber("STU"),
  gender: "MALE",
  departmentId: "",
  ...overrides,
});

export const createTeacherPayload = (overrides = {}) => ({
  name: "Test Teacher",
  email: generateUniqueEmail("teacher"),
  password: TEST_PASSWORD,
  role: "TEACHER",
  employeeId: generateUniqueEmployeeId("EMP"),
  departmentId: "",
  ...overrides,
});

export const createDepartmentPayload = (overrides = {}) => ({
  name: `Department ${makeUniqueSuffix()}`,
  code: generateUniqueDepartmentCode("DP"),
  description: "Test department",
  ...overrides,
});

export const createCoursePayload = (overrides = {}) => ({
  name: `Course ${makeUniqueSuffix()}`,
  code: generateUniqueCourseCode("CRS"),
  durationYears: 4,
  totalSemesters: 8,
  departmentId: "",
  ...overrides,
});

export const createSemesterPayload = (overrides = {}) => ({
  name: `Semester ${makeUniqueSuffix()}`,
  number: 1,
  status: "UPCOMING",
  courseId: "",
  ...overrides,
});

export const createSubjectPayload = (overrides = {}) => ({
  name: `Subject ${makeUniqueSuffix()}`,
  code: generateUniqueSubjectCode("SUB"),
  creditHours: 3,
  description: "Test subject",
  semesterId: "",
  ...overrides,
});

export const createEnrollmentPayload = (overrides = {}) => ({
  studentId: "",
  subjectId: "",
  status: "ENROLLED",
  ...overrides,
});

export const createAttendancePayload = (overrides = {}) => ({
  studentId: "",
  subjectId: "",
  date: new Date().toISOString(),
  status: "PRESENT",
  ...overrides,
});

export const createResultPayload = (overrides = {}) => ({
  studentId: "",
  subjectId: "",
  marks: 85,
  totalMarks: 100,
  grade: "A",
  remarks: "Test result",
  ...overrides,
});
