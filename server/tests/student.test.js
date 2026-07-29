import { apiRequest } from "./helpers/request.helper.js";
import { registerUser, loginUser } from "./helpers/auth.helper.js";
import {
  createDepartmentPayload,
  createStudentPayload,
  createUserPayload,
  INVALID_ID,
} from "./helpers/testData.helper.js";
import {
  cleanupDepartmentsByIds,
  cleanupStudentsByIds,
  cleanupUsersByEmails,
  disconnectPrisma,
} from "./helpers/cleanup.helper.js";

jest.setTimeout(40000);

const createdEmails = new Set();
const createdStudentIds = new Set();
const createdDepartmentIds = new Set();

const registerAndLogin = async (payload) => {
  const registerResponse = await registerUser(payload);
  if (registerResponse.status !== 201) {
    throw new Error(`Failed to register test user: ${registerResponse.body?.message || registerResponse.text}`);
  }

  createdEmails.add(payload.email);

  const loginResponse = await loginUser(payload.email, payload.password);

  if (loginResponse.status !== 200 || !loginResponse.body?.data?.token) {
    throw new Error(`Failed to log in test user: ${loginResponse.body?.message || loginResponse.text}`);
  }

  return loginResponse.body.data.token;
};

const buildStudentPayload = (overrides = {}) => {
  const payload = createStudentPayload(overrides);
  delete payload.role;
  return payload;
};

describe("Student API integration", () => {
  let adminToken = "";
  let studentToken = "";
  let departmentId = "";

  beforeAll(async () => {
    const adminPayload = createUserPayload({
      name: "Admin Tester",
      email: `admin-student-${Date.now()}@example.com`,
      role: "ADMIN",
    });

    const studentPayload = createUserPayload({
      name: "Student Tester",
      email: `student-role-${Date.now()}@example.com`,
      role: "STUDENT",
    });

    adminToken = await registerAndLogin(adminPayload);
    studentToken = await registerAndLogin(studentPayload);

    const departmentPayload = createDepartmentPayload();

    const departmentResponse = await apiRequest
      .post("/api/departments")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(departmentPayload);

    expect(departmentResponse.status).toBe(201);
    expect(departmentResponse.body.success).toBe(true);

    departmentId = departmentResponse.body.data.id;
    createdDepartmentIds.add(departmentId);
  });

  describe("Create", () => {
    it("creates a student successfully with valid admin credentials", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const response = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: expect.any(String),
            user: expect.objectContaining({
              email: payload.email,
            }),
          }),
        })
      );

      createdStudentIds.add(response.body.data.id);
    });

    it("rejects student creation when required fields are missing", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });
      delete payload.gender;

      const response = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });

    it("rejects student creation for a non-admin user", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const response = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(payload);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe("Read", () => {
    it("returns all students with pagination and optional search", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      createdStudentIds.add(createResponse.body.data.id);

      const response = await apiRequest
        .get("/api/students")
        .query({ page: 1, limit: 5, search: payload.registrationNo, sortBy: "createdAt", sortOrder: "desc" })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          pagination: expect.objectContaining({
            page: 1,
            limit: 5,
            total: expect.any(Number),
            totalPages: expect.any(Number),
          }),
          data: expect.any(Array),
        })
      );
    });

    it("returns a single student by id", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const studentId = createResponse.body.data.id;
      createdStudentIds.add(studentId);

      const response = await apiRequest
        .get(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: studentId,
            user: expect.objectContaining({
              email: payload.email,
            }),
          }),
        })
      );
    });

    it("returns 404 when a student id does not exist", async () => {
      const response = await apiRequest
        .get(`/api/students/${INVALID_ID}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe("Update", () => {
    it("updates a student successfully", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const studentId = createResponse.body.data.id;
      createdStudentIds.add(studentId);

      const updatePayload = {
        name: "Updated Student",
        email: `updated-${Date.now()}@example.com`,
        registrationNo: `STU-UPD-${Date.now()}`,
        gender: "FEMALE",
        departmentId,
        phone: "+923001111111",
        address: "Updated Address",
        dateOfBirth: "1995-01-01",
        profileImage: "https://example.com/profile.png",
        isActive: false,
      };

      const response = await apiRequest
        .put(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: studentId,
            user: expect.objectContaining({
              email: updatePayload.email,
            }),
          }),
        })
      );
    });

    it("returns 404 when updating a student that does not exist", async () => {
      const response = await apiRequest
        .put(`/api/students/${INVALID_ID}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "No One",
          email: `ghost-${Date.now()}@example.com`,
          registrationNo: `STU-GHOST-${Date.now()}`,
          gender: "OTHER",
          departmentId,
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe("Delete", () => {
    it("deletes a student successfully", async () => {
      const payload = buildStudentPayload({
        departmentId,
        registrationNo: `STU-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/students")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const studentId = createResponse.body.data.id;
      createdStudentIds.add(studentId);

      const response = await apiRequest
        .delete(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          message: expect.any(String),
        })
      );
    });

    it("returns 404 when deleting a student that does not exist", async () => {
      const response = await apiRequest
        .delete(`/api/students/${INVALID_ID}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });
});

afterAll(async () => {
  const emails = [...createdEmails];
  const studentIds = [...createdStudentIds];
  const departmentIds = [...createdDepartmentIds];

  await cleanupStudentsByIds(studentIds);
  await cleanupDepartmentsByIds(departmentIds);
  await cleanupUsersByEmails(emails);
  await disconnectPrisma();
});
