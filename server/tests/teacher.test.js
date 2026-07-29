import { apiRequest } from "./helpers/request.helper.js";
import { registerUser, loginUser } from "./helpers/auth.helper.js";
import {
  createDepartmentPayload,
  createTeacherPayload,
  createUserPayload,
  INVALID_ID,
} from "./helpers/testData.helper.js";
import {
  cleanupDepartmentsByIds,
  cleanupTeachersByIds,
  cleanupUsersByEmails,
  disconnectPrisma,
} from "./helpers/cleanup.helper.js";

jest.setTimeout(40000);

const createdEmails = new Set();
const createdTeacherIds = new Set();
const createdDepartmentIds = new Set();

const registerAndLogin = async (payload) => {
  const registerResponse = await registerUser(payload);

  if (registerResponse.status !== 201) {
    throw new Error(
      `Failed to register test user: ${registerResponse.body?.message || registerResponse.text}`
    );
  }

  createdEmails.add(payload.email);

  const loginResponse = await loginUser(payload.email, payload.password);

  if (loginResponse.status !== 200 || !loginResponse.body?.data?.token) {
    throw new Error(
      `Failed to log in test user: ${loginResponse.body?.message || loginResponse.text}`
    );
  }

  return loginResponse.body.data.token;
};

const buildTeacherPayload = (overrides = {}) => {
  const payload = createTeacherPayload(overrides);
  delete payload.role;
  return payload;
};

describe("Teacher API integration", () => {
  let adminToken = "";
  let studentToken = "";
  let departmentId = "";

  beforeAll(async () => {
    const adminPayload = createUserPayload({
      name: "Admin Teacher Tester",
      email: `admin-teacher-${Date.now()}@example.com`,
      role: "ADMIN",
    });

    const studentPayload = createUserPayload({
      name: "Student Teacher Tester",
      email: `student-teacher-${Date.now()}@example.com`,
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
    it("creates a teacher successfully with valid admin credentials", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const response = await apiRequest
        .post("/api/teachers")
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

      createdEmails.add(payload.email);
      createdTeacherIds.add(response.body.data.id);
    });

    it("rejects teacher creation when required fields are missing", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });
      delete payload.employeeId;

      const response = await apiRequest
        .post("/api/teachers")
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

    it("rejects teacher creation for a non-admin user", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const response = await apiRequest
        .post("/api/teachers")
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
    it("returns all teachers with pagination and optional search", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/teachers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      createdEmails.add(payload.email);
      createdTeacherIds.add(createResponse.body.data.id);

      const response = await apiRequest
        .get("/api/teachers")
        .query({
          page: 1,
          limit: 5,
          search: payload.employeeId,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
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

    it("returns a single teacher by id", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/teachers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const teacherId = createResponse.body.data.id;
      createdEmails.add(payload.email);
      createdTeacherIds.add(teacherId);

      const response = await apiRequest
        .get(`/api/teachers/${teacherId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: teacherId,
            user: expect.objectContaining({
              email: payload.email,
            }),
          }),
        })
      );
    });

    it("returns 404 when a teacher id does not exist", async () => {
      const response = await apiRequest
        .get(`/api/teachers/${INVALID_ID}`)
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
    it("updates a teacher successfully", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/teachers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const teacherId = createResponse.body.data.id;
      createdEmails.add(payload.email);
      createdTeacherIds.add(teacherId);

      const updatePayload = {
        name: "Updated Teacher",
        email: `updated-teacher-${Date.now()}@example.com`,
        employeeId: `EMP-UPD-${Date.now()}`,
        departmentId,
        phone: "+923001111111",
        designation: "Senior Lecturer",
        qualification: "MSc CS",
        joiningDate: "2020-01-01",
        profileImage: "https://example.com/avatar.png",
        isActive: false,
      };

      const response = await apiRequest
        .put(`/api/teachers/${teacherId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: teacherId,
            user: expect.objectContaining({
              email: updatePayload.email,
            }),
          }),
        })
      );

      createdEmails.add(updatePayload.email);
    });

    it("returns 404 when updating a teacher that does not exist", async () => {
      const response = await apiRequest
        .put(`/api/teachers/${INVALID_ID}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ghost Teacher",
          email: `ghost-teacher-${Date.now()}@example.com`,
          employeeId: `EMP-GHOST-${Date.now()}`,
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
    it("deletes a teacher successfully", async () => {
      const payload = buildTeacherPayload({
        departmentId,
        employeeId: `EMP-${Date.now()}`,
      });

      const createResponse = await apiRequest
        .post("/api/teachers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(createResponse.status).toBe(201);
      const teacherId = createResponse.body.data.id;
      createdEmails.add(payload.email);
      createdTeacherIds.add(teacherId);

      const response = await apiRequest
        .delete(`/api/teachers/${teacherId}`)
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

    it("returns 404 when deleting a teacher that does not exist", async () => {
      const response = await apiRequest
        .delete(`/api/teachers/${INVALID_ID}`)
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
  try {
    const emails = [...createdEmails];
    const teacherIds = [...createdTeacherIds];
    const departmentIds = [...createdDepartmentIds];

    console.log('[teacher cleanup] emails', emails.length, emails);
    console.log('[teacher cleanup] teacherIds', teacherIds.length, teacherIds);
    console.log('[teacher cleanup] departmentIds', departmentIds.length, departmentIds);

    await cleanupTeachersByIds(teacherIds);
    await cleanupDepartmentsByIds(departmentIds);
    await cleanupUsersByEmails(emails);
  } finally {
    await disconnectPrisma();
  }
});
