import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Academic Student Management System API",
      version: "1.0.0",
      description:
        "Production OpenAPI documentation for the Academic Student Management System. " +
        "This API manages the full academic lifecycle: departments, courses, semesters, subjects, " +
        "teachers, students, enrollments, attendance records, and assessment results. " +
        "All endpoints (except authentication) require a valid JWT Bearer token, and access is " +
        "restricted by role (ADMIN, TEACHER, STUDENT) as documented per endpoint.",
      contact: {
        name: "Academic Student Management System",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Authentication", description: "Endpoints for user registration, login, and access control checks." },
      { name: "Students", description: "Endpoints for managing student records and profiles." },
      { name: "Teachers", description: "Endpoints for managing teacher records and profiles." },
      { name: "Departments", description: "Endpoints for managing academic departments." },
      { name: "Courses", description: "Endpoints for managing academic degree programs (courses)." },
      { name: "Semesters", description: "Endpoints for managing course semesters." },
      { name: "Subjects", description: "Endpoints for managing subjects taught within a semester." },
      { name: "Enrollments", description: "Endpoints for managing student subject enrollments." },
      { name: "Attendance", description: "Endpoints for recording and reviewing student attendance." },
      { name: "Results", description: "Endpoints for managing student assessment results and grades." },
      { name: "Dashboard", description: "Endpoints for retrieving aggregate dashboard statistics." },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT access token issued at login. Pass as: `Authorization: Bearer <token>`.",
        },
      },

      // ==========================================================
      // REUSABLE ENUM SCHEMAS
      // Mirrors enums defined in schema.prisma exactly. Referenced
      // via $ref/allOf from request and response schemas below so
      // enum values only need to be maintained in one place.
      // ==========================================================
      // (also declared under "schemas" further below to keep a
      // single components.schemas block, see Role/Gender/etc.)

      parameters: {
        PageParam: {
          name: "page",
          in: "query",
          required: false,
          description: "Page number to retrieve (1-indexed). Defaults to 1.",
          schema: { type: "integer", minimum: 1, default: 1, example: 1 },
        },
        LimitParam: {
          name: "limit",
          in: "query",
          required: false,
          description: "Number of records to return per page. Defaults to 10, maximum 100.",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 10, example: 10 },
        },
        SortByParam: {
          name: "sortBy",
          in: "query",
          required: false,
          description: "Field name to sort results by (e.g. `createdAt`, `name`).",
          schema: { type: "string", example: "createdAt" },
        },
        SortOrderParam: {
          name: "sortOrder",
          in: "query",
          required: false,
          description: "Sort direction applied to `sortBy`.",
          schema: { type: "string", enum: ["asc", "desc"], default: "desc", example: "desc" },
        },
        SearchParam: {
          name: "search",
          in: "query",
          required: false,
          description: "Free-text search term matched against relevant fields (e.g. name, code, registration number).",
          schema: { type: "string", example: "Muhammad Ali" },
        },
      },

      schemas: {
        // ==========================================================
        // ENUM SCHEMAS (single source of truth, mirrors schema.prisma)
        // ==========================================================
        Role: {
          type: "string",
          description: "System-wide user role controlling access permissions.",
          enum: ["ADMIN", "TEACHER", "STUDENT"],
          example: "STUDENT",
        },
        Gender: {
          type: "string",
          description: "Student gender.",
          enum: ["MALE", "FEMALE", "OTHER"],
          example: "MALE",
        },
        SemesterStatus: {
          type: "string",
          description: "Current lifecycle status of a semester.",
          enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
          example: "ACTIVE",
        },
        AttendanceStatus: {
          type: "string",
          description: "Attendance status recorded for a student in a given subject session.",
          enum: ["PRESENT", "ABSENT", "LATE"],
          example: "PRESENT",
        },
        Grade: {
          type: "string",
          description: "Final letter grade awarded for a subject result.",
          enum: ["A_PLUS", "A", "B_PLUS", "B", "C_PLUS", "C", "D", "F"],
          example: "A",
        },
        EnrollmentStatus: {
          type: "string",
          description: "Current status of a student's enrollment in a subject.",
          enum: ["ENROLLED", "DROPPED", "COMPLETED"],
          example: "ENROLLED",
        },

        // ==========================================================
        // AUTHENTICATION SCHEMAS
        // ==========================================================
        User: {
          type: "object",
          required: ["id", "name", "email", "role"],
          properties: {
            id: {
              type: "string",
              example: "cljk0a1b20000qzrm5f8g2h3i",
              description: "Unique CUID identifier for the user account.",
            },
            name: {
              type: "string",
              example: "Muhammad Ali",
              description: "User full name.",
            },
            email: {
              type: "string",
              format: "email",
              example: "muhammad.ali@university.edu",
              description: "User email address (unique).",
            },
            role: {
              allOf: [{ $ref: "#/components/schemas/Role" }],
              description: "Role assigned to the user, determining permissions.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the user account was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the user account was last updated.",
            },
          },
        },
        LoginRequest: {
          type: "object",
          description: "Credentials required to authenticate and receive a JWT access token.",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@university.edu",
              description: "Registered email address of the user.",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123!",
              description: "Account password.",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          description: "Payload required to create a new user account.",
          required: ["name", "email", "password", "role"],
          properties: {
            name: {
              type: "string",
              example: "Muhammad Sibtain Khan",
              description: "Full name of the user being registered.",
            },
            email: {
              type: "string",
              format: "email",
              example: "sibtain.khan@university.edu",
              description: "Email address to register the account with. Must be unique.",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123!",
              description: "Account password. Will be securely hashed before storage.",
            },
            role: {
              allOf: [{ $ref: "#/components/schemas/Role" }],
              description: "Role to assign to the newly created user.",
              example: "ADMIN",
            },
          },
        },

        // ==========================================================
        // STUDENT SCHEMAS
        // ==========================================================
        CreateStudentRequest: {
          type: "object",
          description:
            "Payload required to create a new student. Creates an underlying User account " +
            "(role STUDENT) together with the student's academic profile.",
          required: ["name", "email", "password", "registrationNo", "gender", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "Muhammad Ali",
              description: "Student full name.",
            },
            email: {
              type: "string",
              format: "email",
              example: "muhammad.ali@university.edu",
              description: "Student email address. Must be unique across all users.",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123!",
              description: "Password for the student's account login.",
            },
            registrationNo: {
              type: "string",
              example: "FA22-BCS-001",
              description:
                "Unique student registration number. NOTE: verify this field name against the " +
                "actual student controller/validator — the response schema below currently uses " +
                "`registrationNumber`.",
            },
            gender: {
              allOf: [{ $ref: "#/components/schemas/Gender" }],
              description: "Student gender.",
            },
            phone: {
              type: "string",
              example: "+923001234567",
              description: "Student phone number in international format.",
            },
            address: {
              type: "string",
              example: "House 12, Street 4, F-10, Islamabad, Pakistan",
              description: "Student residential address.",
            },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              example: "2003-05-14T00:00:00.000Z",
              description: "Student date of birth.",
            },
            profileImage: {
              type: "string",
              format: "uri",
              example: "https://cdn.university.edu/profiles/muhammad-ali.jpg",
              description: "URL of the student's profile image.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the department the student belongs to.",
            },
          },
        },
        Student: {
          type: "object",
          required: ["id", "registrationNumber", "gender", "departmentId", "userId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "Unique CUID identifier for the student record.",
            },
            registrationNumber: {
              type: "string",
              example: "FA22-BCS-001",
              description: "Unique student registration number.",
            },
            gender: {
              allOf: [{ $ref: "#/components/schemas/Gender" }],
              description: "Student gender.",
            },
            phone: {
              type: "string",
              nullable: true,
              example: "+923001234567",
              description: "Student phone number in international format.",
            },
            address: {
              type: "string",
              nullable: true,
              example: "House 12, Street 4, F-10, Islamabad, Pakistan",
              description: "Student residential address.",
            },
            dateOfBirth: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2003-05-14T00:00:00.000Z",
              description: "Student date of birth.",
            },
            profileImage: {
              type: "string",
              format: "uri",
              nullable: true,
              example: "https://cdn.university.edu/profiles/muhammad-ali.jpg",
              description: "URL of the student's profile image.",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the student account is currently active.",
            },
            userId: {
              type: "string",
              example: "cljk0a1b20000qzrm5f8g2h3i",
              description: "CUID of the associated user account.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the associated department.",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            department: {
              $ref: "#/components/schemas/Department",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the student record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the student record was last updated.",
            },
          },
        },

        // ==========================================================
        // TEACHER SCHEMAS
        // ==========================================================
        CreateTeacherRequest: {
          type: "object",
          description:
            "Payload required to create a new teacher. Creates an underlying User account " +
            "(role TEACHER) together with the teacher's employment profile.",
          required: ["name", "email", "password", "employeeId", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "Dr. Ahmed Hassan",
              description: "Teacher full name.",
            },
            email: {
              type: "string",
              format: "email",
              example: "ahmed.hassan@university.edu",
              description: "Teacher email address. Must be unique across all users.",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePass123!",
              description: "Password for the teacher's account login.",
            },
            employeeId: {
              type: "string",
              example: "EMP-2024-001",
              description: "Unique employee identifier.",
            },
            phone: {
              type: "string",
              example: "+923001234567",
              description: "Teacher phone number in international format.",
            },
            designation: {
              type: "string",
              example: "Assistant Professor",
              description: "Teacher's academic designation/title.",
            },
            qualification: {
              type: "string",
              example: "PhD Computer Science",
              description: "Teacher's highest academic qualification.",
            },
            joiningDate: {
              type: "string",
              format: "date-time",
              example: "2020-08-15T00:00:00.000Z",
              description: "Date the teacher joined the institution.",
            },
            profileImage: {
              type: "string",
              format: "uri",
              example: "https://cdn.university.edu/profiles/ahmed-hassan.jpg",
              description: "URL of the teacher's profile image.",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the teacher account is active. Defaults to true.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the department the teacher belongs to.",
            },
          },
        },
        Teacher: {
          type: "object",
          required: ["id", "employeeId", "departmentId", "userId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0e5f60002qzrm9j1k6l7m",
              description: "Unique CUID identifier for the teacher record.",
            },
            employeeId: {
              type: "string",
              example: "EMP-2024-001",
              description: "Unique employee identifier.",
            },
            phone: {
              type: "string",
              nullable: true,
              example: "+923001234567",
              description: "Teacher phone number in international format.",
            },
            designation: {
              type: "string",
              nullable: true,
              example: "Assistant Professor",
              description: "Teacher's academic designation/title.",
            },
            qualification: {
              type: "string",
              nullable: true,
              example: "PhD Computer Science",
              description: "Teacher's highest academic qualification.",
            },
            joiningDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2020-08-15T00:00:00.000Z",
              description: "Date the teacher joined the institution.",
            },
            profileImage: {
              type: "string",
              format: "uri",
              nullable: true,
              example: "https://cdn.university.edu/profiles/ahmed-hassan.jpg",
              description: "URL of the teacher's profile image.",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the teacher account is currently active.",
            },
            userId: {
              type: "string",
              example: "cljk0a1b20000qzrm5f8g2h3i",
              description: "CUID of the associated user account.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the associated department.",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            department: {
              $ref: "#/components/schemas/Department",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the teacher record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the teacher record was last updated.",
            },
          },
        },

        // ==========================================================
        // DEPARTMENT SCHEMAS
        // ==========================================================
        CreateDepartmentRequest: {
          type: "object",
          description: "Payload required to create a new academic department.",
          required: ["name", "code"],
          properties: {
            name: {
              type: "string",
              example: "Computer Science",
              description: "Full department name. Must be unique.",
            },
            code: {
              type: "string",
              example: "CS",
              description: "Short unique department code.",
            },
            description: {
              type: "string",
              example: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems.",
              description: "Optional free-text description of the department.",
            },
          },
        },
        Department: {
          type: "object",
          required: ["id", "name", "code"],
          properties: {
            id: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "Unique CUID identifier for the department.",
            },
            name: {
              type: "string",
              example: "Computer Science",
              description: "Full department name.",
            },
            code: {
              type: "string",
              example: "CS",
              description: "Short unique department code.",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems.",
              description: "Free-text description of the department.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the department was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the department was last updated.",
            },
          },
        },

        // ==========================================================
        // COURSE SCHEMAS (degree programs, e.g. BS Computer Science)
        // ==========================================================
        CreateCourseRequest: {
          type: "object",
          description: "Payload required to create a new degree program (course) within a department.",
          required: ["name", "code", "durationYears", "totalSemesters", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "BS Computer Science",
              description: "Full name of the degree program. Must be unique.",
            },
            code: {
              type: "string",
              example: "BSCS",
              description: "Short unique course code.",
            },
            durationYears: {
              type: "integer",
              minimum: 1,
              example: 4,
              description: "Duration of the degree program in years.",
            },
            totalSemesters: {
              type: "integer",
              minimum: 1,
              example: 8,
              description: "Total number of semesters in the degree program.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the department offering this course.",
            },
          },
        },
        Course: {
          type: "object",
          required: ["id", "name", "code", "durationYears", "totalSemesters", "departmentId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0i9j00004qzrmdn5o0p1q",
              description: "Unique CUID identifier for the course.",
            },
            name: {
              type: "string",
              example: "BS Computer Science",
              description: "Full name of the degree program.",
            },
            code: {
              type: "string",
              example: "BSCS",
              description: "Short unique course code.",
            },
            durationYears: {
              type: "integer",
              example: 4,
              description: "Duration of the degree program in years.",
            },
            totalSemesters: {
              type: "integer",
              example: 8,
              description: "Total number of semesters in the degree program.",
            },
            departmentId: {
              type: "string",
              example: "cljk0g7h80003qzrmbl3m8n9o",
              description: "CUID of the department offering this course.",
            },
            department: {
              $ref: "#/components/schemas/Department",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the course was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the course was last updated.",
            },
          },
        },

        // ==========================================================
        // SEMESTER SCHEMAS
        // ==========================================================
        CreateSemesterRequest: {
          type: "object",
          description: "Payload required to create a new semester under a course.",
          required: ["name", "number", "courseId"],
          properties: {
            name: {
              type: "string",
              example: "Fall 2026",
              description: "Human-readable semester name.",
            },
            number: {
              type: "integer",
              minimum: 1,
              example: 5,
              description: "Sequential semester number within the course (e.g. 5th semester of an 8-semester program).",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/SemesterStatus" }],
              description: "Current lifecycle status of the semester. Defaults to UPCOMING.",
            },
            courseId: {
              type: "string",
              example: "cljk0i9j00004qzrmdn5o0p1q",
              description: "CUID of the course this semester belongs to.",
            },
          },
        },
        Semester: {
          type: "object",
          required: ["id", "name", "number", "courseId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0k1l20005qzrmfp7q2r3s",
              description: "Unique CUID identifier for the semester.",
            },
            name: {
              type: "string",
              example: "Fall 2026",
              description: "Human-readable semester name.",
            },
            number: {
              type: "integer",
              example: 5,
              description: "Sequential semester number within the course.",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/SemesterStatus" }],
              description: "Current lifecycle status of the semester.",
            },
            courseId: {
              type: "string",
              example: "cljk0i9j00004qzrmdn5o0p1q",
              description: "CUID of the course this semester belongs to.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the semester was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the semester was last updated.",
            },
          },
        },

        // ==========================================================
        // SUBJECT SCHEMAS
        // ==========================================================
        CreateSubjectRequest: {
          type: "object",
          description: "Payload required to create a new subject within a semester.",
          required: ["name", "code", "creditHours", "semesterId"],
          properties: {
            name: {
              type: "string",
              example: "Data Structures",
              description: "Full subject name.",
            },
            code: {
              type: "string",
              example: "CS201",
              description: "Unique subject code.",
            },
            creditHours: {
              type: "integer",
              minimum: 1,
              example: 3,
              description: "Number of credit hours assigned to the subject.",
            },
            description: {
              type: "string",
              example: "Covers arrays, linked lists, stacks, queues, trees, and graphs with a focus on algorithmic complexity.",
              description: "Optional description of the subject's content.",
            },
            semesterId: {
              type: "string",
              example: "cljk0k1l20005qzrmfp7q2r3s",
              description: "CUID of the semester this subject is taught in.",
            },
          },
        },
        Subject: {
          type: "object",
          required: ["id", "name", "code", "creditHours", "semesterId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "Unique CUID identifier for the subject.",
            },
            name: {
              type: "string",
              example: "Data Structures",
              description: "Full subject name.",
            },
            code: {
              type: "string",
              example: "CS201",
              description: "Unique subject code.",
            },
            creditHours: {
              type: "integer",
              example: 3,
              description: "Number of credit hours assigned to the subject.",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Covers arrays, linked lists, stacks, queues, trees, and graphs with a focus on algorithmic complexity.",
              description: "Description of the subject's content.",
            },
            semesterId: {
              type: "string",
              example: "cljk0k1l20005qzrmfp7q2r3s",
              description: "CUID of the semester this subject is taught in.",
            },
            semester: {
              $ref: "#/components/schemas/Semester",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the subject was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the subject was last updated.",
            },
          },
        },

        // ==========================================================
        // ENROLLMENT SCHEMAS
        // ==========================================================
        CreateEnrollmentRequest: {
          type: "object",
          description: "Payload required to enroll a student in a subject.",
          required: ["studentId", "subjectId"],
          properties: {
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the student being enrolled.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject the student is enrolling in.",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/EnrollmentStatus" }],
              description: "Initial enrollment status. Defaults to ENROLLED.",
            },
          },
        },
        Enrollment: {
          type: "object",
          required: ["id", "studentId", "subjectId"],
          properties: {
            id: {
              type: "string",
              example: "cljk0o5p60007qzrmjt1u6v7w",
              description: "Unique CUID identifier for the enrollment record.",
            },
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the enrolled student.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject enrolled in.",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/EnrollmentStatus" }],
              description: "Current enrollment status.",
            },
            enrolledAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-20T08:00:00.000Z",
              description: "Timestamp when the student was enrolled.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-20T08:00:00.000Z",
              description: "Timestamp when the enrollment record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-20T08:00:00.000Z",
              description: "Timestamp when the enrollment record was last updated.",
            },
          },
        },

        // ==========================================================
        // ATTENDANCE SCHEMAS
        // ==========================================================
        CreateAttendanceRequest: {
          type: "object",
          description: "Payload required to record a student's attendance for a subject on a given date.",
          required: ["studentId", "subjectId", "date", "status"],
          properties: {
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the student whose attendance is being recorded.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject the attendance record applies to.",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-07-15T00:00:00.000Z",
              description: "Date the attendance was recorded for.",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/AttendanceStatus" }],
              description: "Attendance status for the student on this date.",
            },
          },
        },
        Attendance: {
          type: "object",
          required: ["id", "studentId", "subjectId", "date", "status"],
          properties: {
            id: {
              type: "string",
              example: "cljk0q7r80008qzrmlv3w8x9y",
              description: "Unique CUID identifier for the attendance record.",
            },
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the student this attendance record belongs to.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject this attendance record belongs to.",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2026-07-15T00:00:00.000Z",
              description: "Date the attendance was recorded for.",
            },
            status: {
              allOf: [{ $ref: "#/components/schemas/AttendanceStatus" }],
              description: "Attendance status recorded.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-15T09:05:00.000Z",
              description: "Timestamp when the attendance record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-15T09:05:00.000Z",
              description: "Timestamp when the attendance record was last updated.",
            },
          },
        },

        // ==========================================================
        // RESULT SCHEMAS
        // ==========================================================
        CreateResultRequest: {
          type: "object",
          description: "Payload required to record a student's assessment result for a subject.",
          required: ["studentId", "subjectId", "marks", "totalMarks", "grade"],
          properties: {
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the student the result belongs to.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject the result belongs to.",
            },
            marks: {
              type: "number",
              minimum: 0,
              example: 85,
              description: "Marks obtained by the student.",
            },
            totalMarks: {
              type: "number",
              minimum: 0,
              example: 100,
              description: "Total marks the assessment was out of.",
            },
            grade: {
              allOf: [{ $ref: "#/components/schemas/Grade" }],
              description: "Final letter grade awarded.",
            },
            remarks: {
              type: "string",
              example: "Excellent performance throughout the semester.",
              description: "Optional remarks about the student's performance.",
            },
          },
        },
        Result: {
          type: "object",
          required: ["id", "studentId", "subjectId", "marks", "totalMarks", "grade"],
          properties: {
            id: {
              type: "string",
              example: "cljk0s9t00009qzrmnx5y0z1a",
              description: "Unique CUID identifier for the result record.",
            },
            studentId: {
              type: "string",
              example: "cljk0c3d40001qzrm7h9i4j5k",
              description: "CUID of the student the result belongs to.",
            },
            subjectId: {
              type: "string",
              example: "cljk0m3n40006qzrmhr9s4t5u",
              description: "CUID of the subject the result belongs to.",
            },
            marks: {
              type: "number",
              example: 85,
              description: "Marks obtained by the student.",
            },
            totalMarks: {
              type: "number",
              example: 100,
              description: "Total marks the assessment was out of.",
            },
            grade: {
              allOf: [{ $ref: "#/components/schemas/Grade" }],
              description: "Final letter grade awarded.",
            },
            remarks: {
              type: "string",
              nullable: true,
              example: "Excellent performance throughout the semester.",
              description: "Remarks about the student's performance.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the result record was created.",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-01-15T09:30:00.000Z",
              description: "Timestamp when the result record was last updated.",
            },
          },
        },

        // ==========================================================
        // GENERIC SUCCESS / PAGINATION WRAPPERS
        // ==========================================================
        SuccessResponse: {
          type: "object",
          description: "Standard success payload returned by successful create, update, delete, and read operations.",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates whether the request was successful.",
            },
            message: {
              type: "string",
              example: "Student created successfully.",
              description: "Human-readable success message.",
            },
            data: {
              type: "object",
              description: "Response payload containing the requested resource or operation result.",
            },
          },
          example: {
            success: true,
            message: "Student created successfully.",
            data: {
              id: "cljk0c3d40001qzrm7h9i4j5k",
              registrationNumber: "FA22-BCS-001",
              gender: "MALE",
              departmentId: "cljk0g7h80003qzrmbl3m8n9o",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          description: "Paginated collection response used by list endpoints.",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates whether the request was successful.",
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                  description: "Current page number.",
                },
                limit: {
                  type: "integer",
                  example: 10,
                  description: "Number of items returned per page.",
                },
                total: {
                  type: "integer",
                  example: 42,
                  description: "Total number of records matching the query.",
                },
                totalPages: {
                  type: "integer",
                  example: 5,
                  description: "Total number of pages available.",
                },
              },
            },
            data: {
              type: "array",
              items: { type: "object" },
              description: "Array of records for the current page.",
            },
          },
          example: {
            success: true,
            pagination: { page: 1, limit: 10, total: 42, totalPages: 5 },
            data: [
              {
                id: "cljk0c3d40001qzrm7h9i4j5k",
                registrationNumber: "FA22-BCS-001",
                gender: "MALE",
              },
            ],
          },
        },

        // ==========================================================
        // ERROR RESPONSE SCHEMAS
        // ==========================================================
        ErrorResponse: {
          type: "object",
          description: "Generic error payload returned for unexpected server-side failures.",
          properties: {
            success: { type: "boolean", example: false, description: "Always false for error responses." },
            message: { type: "string", example: "An unexpected error occurred.", description: "Error message." },
          },
          example: { success: false, message: "An unexpected error occurred." },
        },
        ValidationErrorResponse: {
          type: "object",
          description: "Returned when request body, params, or query fail schema/Joi validation (422).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "\"email\" is required." },
          },
          example: { success: false, message: "\"email\" is required." },
        },
        UnauthorizedResponse: {
          type: "object",
          description: "Returned when the request is missing a valid JWT or the token has expired (401).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Authentication token is missing or invalid." },
          },
          example: { success: false, message: "Authentication token is missing or invalid." },
        },
        ForbiddenResponse: {
          type: "object",
          description: "Returned when the authenticated user's role does not permit this action (403).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "You do not have permission to perform this action." },
          },
          example: { success: false, message: "You do not have permission to perform this action." },
        },
        NotFoundResponse: {
          type: "object",
          description: "Returned when the requested resource does not exist (404).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Resource not found." },
          },
          example: { success: false, message: "Resource not found." },
        },
        ConflictResponse: {
          type: "object",
          description: "Returned when the request conflicts with existing data, e.g. a duplicate unique field (409).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "A record with this value already exists." },
          },
          example: { success: false, message: "A record with this value already exists." },
        },
        InternalServerErrorResponse: {
          type: "object",
          description: "Returned when an unhandled server-side error occurs (500).",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Internal server error. Please try again later." },
          },
          example: { success: false, message: "Internal server error. Please try again later." },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;