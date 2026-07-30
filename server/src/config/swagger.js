import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Academic Student Management System API",
      version: "1.0.0",
      description: "Interactive OpenAPI documentation for managing students, teachers, departments, courses, enrollments, attendance, and academic results.",
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
      },
    ],
    tags: [
      { name: "Authentication", description: "Endpoints for user registration, login, and access control checks." },
      { name: "Students", description: "Endpoints for managing student records and profiles." },
      { name: "Teachers", description: "Endpoints for managing teacher records and profiles." },
      { name: "Departments", description: "Endpoints for managing academic departments." },
      { name: "Courses", description: "Endpoints for managing academic courses." },
      { name: "Semesters", description: "Endpoints for managing course semesters." },
      { name: "Subjects", description: "Endpoints for managing subjects within semesters." },
      { name: "Enrollments", description: "Endpoints for managing subject enrollments." },
      { name: "Attendance", description: "Endpoints for recording and reviewing student attendance." },
      { name: "Results", description: "Endpoints for managing student assessment results." },
      { name: "Dashboard", description: "Endpoints for retrieving dashboard statistics." },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["id", "name", "email", "role"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique user ID",
            },
            name: {
              type: "string",
              example: "Ali Khan",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "ali@example.com",
              description: "User email address",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "TEACHER", "STUDENT"],
              example: "STUDENT",
              description: "User role",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "User creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "User update timestamp",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
              description: "User email address",
            },
            password: {
              type: "string",
              example: "Password123!",
              description: "User password",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: {
              type: "string",
              example: "Muhammad Sibtain Khan",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "sibtain@example.com",
              description: "User email address",
            },
            password: {
              type: "string",
              example: "Password123!",
              description: "User password",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "TEACHER", "STUDENT"],
              example: "ADMIN",
              description: "User role",
            },
          },
        },
        CreateStudentRequest: {
          type: "object",
          required: ["name", "email", "password", "registrationNo", "gender", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "Muhammad Sibtain Khan",
              description: "Student full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "sibtain@example.com",
              description: "Student email",
            },
            password: {
              type: "string",
              example: "Password123!",
              description: "Student password",
            },
            registrationNo: {
              type: "string",
              example: "FA22-BCS-001",
              description: "Student registration number",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER"],
              example: "MALE",
              description: "Student gender",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Department ID",
            },
          },
        },
        CreateTeacherRequest: {
          type: "object",
          required: ["name", "email", "password", "employeeId", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "Dr Ahmed Khan",
              description: "Teacher full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "ahmed@example.com",
              description: "Teacher email",
            },
            password: {
              type: "string",
              example: "Password123!",
              description: "Teacher password",
            },
            employeeId: {
              type: "string",
              example: "EMP001",
              description: "Teacher employee ID",
            },
            phone: {
              type: "string",
              example: "+923001234567",
              description: "Teacher phone number",
            },
            designation: {
              type: "string",
              example: "Lecturer",
              description: "Teacher designation",
            },
            qualification: {
              type: "string",
              example: "MSc Computer Science",
              description: "Teacher qualification",
            },
            joiningDate: {
              type: "string",
              format: "date",
              example: "2020-01-01",
              description: "Teacher joining date",
            },
            profileImage: {
              type: "string",
              example: "https://example.com/teacher.jpg",
              description: "Teacher profile image URL",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the teacher is active",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Department ID",
            },
          },
        },
        CreateDepartmentRequest: {
          type: "object",
          required: ["name", "code"],
          properties: {
            name: {
              type: "string",
              example: "Computer Science",
              description: "Department name",
            },
            code: {
              type: "string",
              example: "CS",
              description: "Department code",
            },
            description: {
              type: "string",
              example: "Department of Computer Science",
              description: "Department description",
            },
          },
        },
        CreateCourseRequest: {
          type: "object",
          required: ["name", "code", "durationYears", "totalSemesters", "departmentId"],
          properties: {
            name: {
              type: "string",
              example: "BS Computer Science",
              description: "Course name",
            },
            code: {
              type: "string",
              example: "BSCS",
              description: "Course code",
            },
            durationYears: {
              type: "integer",
              example: 4,
              description: "Course duration in years",
            },
            totalSemesters: {
              type: "integer",
              example: 8,
              description: "Total number of semesters",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Department ID",
            },
          },
        },
        CreateSemesterRequest: {
          type: "object",
          required: ["name", "number", "courseId"],
          properties: {
            name: {
              type: "string",
              example: "Spring 2026",
              description: "Semester name",
            },
            number: {
              type: "integer",
              example: 4,
              description: "Semester number",
            },
            status: {
              type: "string",
              enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
              example: "UPCOMING",
              description: "Semester status",
            },
            courseId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Course ID",
            },
          },
        },
        CreateSubjectRequest: {
          type: "object",
          required: ["name", "code", "creditHours", "semesterId"],
          properties: {
            name: {
              type: "string",
              example: "Data Structures",
              description: "Subject name",
            },
            code: {
              type: "string",
              example: "DSA",
              description: "Subject code",
            },
            creditHours: {
              type: "integer",
              example: 3,
              description: "Subject credit hours",
            },
            description: {
              type: "string",
              example: "Core data structures concepts",
              description: "Subject description",
            },
            semesterId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Semester ID",
            },
          },
        },
        CreateEnrollmentRequest: {
          type: "object",
          required: ["studentId", "subjectId"],
          properties: {
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Subject ID",
            },
            status: {
              type: "string",
              enum: ["ENROLLED", "DROPPED", "COMPLETED"],
              example: "ENROLLED",
              description: "Enrollment status",
            },
          },
        },
        CreateAttendanceRequest: {
          type: "object",
          required: ["studentId", "subjectId", "date", "status"],
          properties: {
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Subject ID",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T00:00:00.000Z",
              description: "Attendance date",
            },
            status: {
              type: "string",
              enum: ["PRESENT", "ABSENT", "LATE"],
              example: "PRESENT",
              description: "Attendance status",
            },
          },
        },
        CreateResultRequest: {
          type: "object",
          required: ["studentId", "subjectId", "marks", "totalMarks", "grade"],
          properties: {
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Subject ID",
            },
            marks: {
              type: "number",
              example: 85,
              description: "Obtained marks",
            },
            totalMarks: {
              type: "number",
              example: 100,
              description: "Total marks",
            },
            grade: {
              type: "string",
              enum: ["A_PLUS", "A", "B_PLUS", "B", "C_PLUS", "C", "D", "F"],
              example: "A",
              description: "Final grade",
            },
            remarks: {
              type: "string",
              example: "Excellent performance",
              description: "Result remarks",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          description: "Standard success payload returned by successful create, update, delete, and read operations.",
          example: {
            success: true,
            message: "Student created successfully",
            data: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              name: "Ali Khan",
              email: "ali@example.com",
              role: "STUDENT"
            }
          },
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates whether the request was successful",
            },
            message: {
              type: "string",
              example: "Student created successfully",
              description: "Human-readable success message",
            },
            data: {
              type: "object",
              description: "Response payload containing the requested resource or operation result",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          description: "Standard error payload returned for unauthorized, forbidden, conflict, and server-side failures.",
          example: {
            success: false,
            message: "An unexpected error occurred"
          },
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Indicates whether the request was successful",
            },
            message: {
              type: "string",
              example: "An unexpected error occurred",
              description: "Error message",
            },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          description: "Validation error payload returned when request data is invalid.",
          example: {
            success: false,
            message: "Email is required"
          },
          properties: {
            success: {
              type: "boolean",
              example: false,
              description: "Indicates whether the request was successful",
            },
            message: {
              type: "string",
              example: "Email is required",
              description: "Validation error detail",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          description: "Paginated collection response used by list endpoints.",
          example: {
            success: true,
            pagination: {
              page: 1,
              limit: 10,
              total: 25,
              totalPages: 3
            },
            data: [
              {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Ali Khan",
                email: "ali@example.com"
              }
            ]
          },
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Indicates whether the request was successful",
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                  description: "Current page number",
                },
                limit: {
                  type: "integer",
                  example: 10,
                  description: "Number of items per page",
                },
                total: {
                  type: "integer",
                  example: 25,
                  description: "Total number of records",
                },
                totalPages: {
                  type: "integer",
                  example: 3,
                  description: "Total number of pages",
                },
              },
            },
            data: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Paginated data records",
            },
          },
        },
        Student: {
          type: "object",
          required: ["id", "registrationNumber", "gender", "departmentId", "userId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique student ID",
            },
            registrationNumber: {
              type: "string",
              example: "FA22-BCS-001",
              description: "Student registration number",
            },
            gender: {
              type: "string",
              enum: ["MALE", "FEMALE", "OTHER"],
              example: "MALE",
              description: "Student gender",
            },
            phone: {
              type: "string",
              example: "+923001234567",
              description: "Student phone number",
            },
            address: {
              type: "string",
              example: "Lahore, Pakistan",
              description: "Student address",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "1999-01-01",
              description: "Student date of birth",
            },
            profileImage: {
              type: "string",
              example: "https://example.com/profile.jpg",
              description: "Student profile image URL",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the student is active",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated user ID",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated department ID",
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
              example: "2024-01-01T00:00:00.000Z",
              description: "Student creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Student update timestamp",
            },
          },
        },
        Teacher: {
          type: "object",
          required: ["id", "employeeId", "departmentId", "userId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique teacher ID",
            },
            employeeId: {
              type: "string",
              example: "EMP001",
              description: "Teacher employee ID",
            },
            phone: {
              type: "string",
              example: "+923001234567",
              description: "Teacher phone number",
            },
            designation: {
              type: "string",
              example: "Lecturer",
              description: "Teacher designation",
            },
            qualification: {
              type: "string",
              example: "MSc Computer Science",
              description: "Teacher qualification",
            },
            joiningDate: {
              type: "string",
              format: "date",
              example: "2020-01-01",
              description: "Teacher joining date",
            },
            profileImage: {
              type: "string",
              example: "https://example.com/teacher.jpg",
              description: "Teacher profile image URL",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether the teacher is active",
            },
            userId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated user ID",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated department ID",
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
              example: "2024-01-01T00:00:00.000Z",
              description: "Teacher creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Teacher update timestamp",
            },
          },
        },
        Department: {
          type: "object",
          required: ["id", "name", "code"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique department ID",
            },
            name: {
              type: "string",
              example: "Computer Science",
              description: "Department name",
            },
            code: {
              type: "string",
              example: "CS",
              description: "Department code",
            },
            description: {
              type: "string",
              example: "Department for computer science studies",
              description: "Department description",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Department creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Department update timestamp",
            },
          },
        },
        Course: {
          type: "object",
          required: ["id", "name", "code", "durationYears", "totalSemesters", "departmentId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique course ID",
            },
            name: {
              type: "string",
              example: "Bachelor of Computer Science",
              description: "Course name",
            },
            code: {
              type: "string",
              example: "BCS",
              description: "Course code",
            },
            durationYears: {
              type: "integer",
              example: 4,
              description: "Course duration in years",
            },
            totalSemesters: {
              type: "integer",
              example: 8,
              description: "Total number of semesters",
            },
            departmentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated department ID",
            },
            department: {
              $ref: "#/components/schemas/Department",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Course creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Course update timestamp",
            },
          },
        },
        Semester: {
          type: "object",
          required: ["id", "name", "number", "courseId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique semester ID",
            },
            name: {
              type: "string",
              example: "First Semester",
              description: "Semester name",
            },
            number: {
              type: "integer",
              example: 1,
              description: "Semester number",
            },
            status: {
              type: "string",
              enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
              example: "UPCOMING",
              description: "Semester status",
            },
            courseId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated course ID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Semester creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Semester update timestamp",
            },
          },
        },
        Subject: {
          type: "object",
          required: ["id", "name", "code", "creditHours", "semesterId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique subject ID",
            },
            name: {
              type: "string",
              example: "Data Structures",
              description: "Subject name",
            },
            code: {
              type: "string",
              example: "DSA",
              description: "Subject code",
            },
            creditHours: {
              type: "integer",
              example: 3,
              description: "Subject credit hours",
            },
            description: {
              type: "string",
              example: "Core data structures concepts",
              description: "Subject description",
            },
            semesterId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated semester ID",
            },
            semester: {
              $ref: "#/components/schemas/Semester",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Subject creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Subject update timestamp",
            },
          },
        },
        Enrollment: {
          type: "object",
          required: ["id", "studentId", "subjectId"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique enrollment ID",
            },
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated subject ID",
            },
            status: {
              type: "string",
              enum: ["ENROLLED", "DROPPED", "COMPLETED"],
              example: "ENROLLED",
              description: "Enrollment status",
            },
            enrolledAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T00:00:00.000Z",
              description: "Enrollment date",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Enrollment creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Enrollment update timestamp",
            },
          },
        },
        Attendance: {
          type: "object",
          required: ["id", "studentId", "subjectId", "date", "status"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique attendance ID",
            },
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated subject ID",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T00:00:00.000Z",
              description: "Attendance date",
            },
            status: {
              type: "string",
              enum: ["PRESENT", "ABSENT", "LATE"],
              example: "PRESENT",
              description: "Attendance status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Attendance creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Attendance update timestamp",
            },
          },
        },
        Result: {
          type: "object",
          required: ["id", "studentId", "subjectId", "marks", "totalMarks", "grade"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Unique result ID",
            },
            studentId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated student ID",
            },
            subjectId: {
              type: "string",
              format: "uuid",
              example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              description: "Associated subject ID",
            },
            marks: {
              type: "number",
              example: 85,
              description: "Obtained marks",
            },
            totalMarks: {
              type: "number",
              example: 100,
              description: "Total marks",
            },
            grade: {
              type: "string",
              enum: ["A_PLUS", "A", "B_PLUS", "B", "C_PLUS", "C", "D", "F"],
              example: "A",
              description: "Final grade",
            },
            remarks: {
              type: "string",
              example: "Excellent performance",
              description: "Result remarks",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Result creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
              description: "Result update timestamp",
            },
          },
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