import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/prisma/prismaClient.js";

jest.setTimeout(30000);

const createdEmails = new Set();

const makeUserPayload = (overrides = {}) => {
  const email = `auth-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  return {
    name: "Auth Tester",
    email,
    password: "Password123!",
    role: "STUDENT",
    ...overrides,
  };
};

const registerUser = async (payload) => {
  createdEmails.add(payload.email);
  const response = await request(app).post("/api/auth/register").send(payload);
  return response;
};

const loginUser = async (email, password) => {
  return request(app).post("/api/auth/login").send({ email, password });
};

describe("Authentication API integration", () => {
  let validToken = "";
  let validUserEmail = "";

  beforeAll(async () => {
    const payload = makeUserPayload();
    validUserEmail = payload.email;

    const registrationResponse = await registerUser(payload);
    expect(registrationResponse.status).toBe(201);

    const loginResponse = await loginUser(payload.email, payload.password);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: payload.email,
        }),
      })
    );

    validToken = loginResponse.body.data.token;
  });

  describe("Register", () => {
    it("registers a new user successfully", async () => {
      const payload = makeUserPayload();
      const response = await registerUser(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            email: payload.email,
            name: payload.name,
            role: payload.role,
          }),
        })
      );
    });

    it("rejects duplicate email registration", async () => {
      const payload = makeUserPayload();
      await registerUser(payload);

      const response = await registerUser(payload);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });

    it("rejects registration with missing validation fields", async () => {
      const payload = makeUserPayload();
      delete payload.role;

      const response = await request(app).post("/api/auth/register").send(payload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe("Login", () => {
    it("logs in successfully and returns a JWT", async () => {
      const payload = makeUserPayload();
      await registerUser(payload);

      const response = await loginUser(payload.email, payload.password);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: expect.any(String),
            user: expect.objectContaining({
              email: payload.email,
              role: payload.role,
            }),
          }),
        })
      );
    });

    it("rejects login with the wrong password", async () => {
      const payload = makeUserPayload();
      await registerUser(payload);

      const response = await loginUser(payload.email, "WrongPassword123!");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });

    it("rejects login for an unknown email", async () => {
      const response = await loginUser("does-not-exist@example.com", "Password123!");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe("Current User", () => {
    it("returns the current user for a valid JWT", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            id: expect.any(String),
            role: expect.any(String),
          }),
        })
      );

      const decodedToken = jwt.decode(validToken);
      expect(decodedToken).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          role: expect.any(String),
        })
      );
    });

    it("rejects access to the current user route without a JWT", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });

    it("rejects access to the current user route with an invalid JWT", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
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
    const emailsToDelete = [...createdEmails];

    if (emailsToDelete.length > 0) {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: emailsToDelete,
          },
        },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});
