import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Role-based protection middleware
  const checkRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      const userRole = req.headers['x-user-role']; 
      const userId = req.headers['x-user-id'];
      
      console.log(`[AUTH] User: ${userId}, Role: ${userRole}, Path: ${req.path}`);

      if (!userRole || !userId) {
        return res.status(401).json({ error: "Unauthorized: Missing identity headers" });
      }

      if (!roles.includes(userRole) && userRole !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Role mismatch" });
      }

      next();
    };
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CampusAI Backend is running", timestamp: new Date() });
  });

  // --- STUDENT API ---
  app.get("/api/student/attendance", checkRole(['student']), (req, res) => {
    const studentId = req.headers['x-user-id'];
    
    // In a real app: SELECT * FROM attendance WHERE studentId = ?
    console.log(`[QUERY] Fetching attendance for student: ${studentId}`);

    // Returning student-specific structure
    res.json([
      { subject: "Data Structures", attended: 22, total: 25, percentage: 88 },
      { subject: "Algorithms", attended: 18, total: 20, percentage: 90 },
      { subject: "Database Systems", attended: 14, total: 20, percentage: 70 },
      { subject: "Operating Systems", attended: 12, total: 18, percentage: 66 }
    ]);
  });

  // --- FACULTY API ---
  app.get("/api/faculty/classes", checkRole(['faculty']), (req, res) => {
    const facultyId = req.headers['x-user-id'];
    console.log(`[QUERY] Fetching classes taught by faculty: ${facultyId}`);

    res.json([
      { id: "cs101", name: "Data Structures", section: "Section A", time: "10:00 AM", room: "203", studentCount: 45 },
      { id: "cs102", name: "Algorithms", section: "Section B", time: "01:00 PM", room: "105", studentCount: 42 },
      { id: "cs103", name: "Database Design", section: "Section A", time: "03:00 PM", room: "402", studentCount: 38 }
    ]);
  });

  app.get("/api/faculty/class/:classId/students", checkRole(['faculty']), (req, res) => {
    const { classId } = req.params;
    console.log(`[QUERY] Fetching students for class: ${classId}`);

    // Mock student list for faculty to mark attendance
    res.json([
      { id: "st001", name: "Rahul Kumar", rollNo: "CS2101", status: "present" },
      { id: "st002", name: "Simran Sen", rollNo: "CS2102", status: "present" },
      { id: "st003", name: "Amit Singh", rollNo: "CS2103", status: "absent" },
      { id: "st004", name: "Priya Das", rollNo: "CS2104" }
    ]);
  });

  app.post("/api/faculty/attendance", checkRole(['faculty']), (req, res) => {
    const { classId, attendanceData, date } = req.body;
    const facultyId = req.headers['x-user-id'];

    console.log(`[WRITE] Faculty ${facultyId} marked attendance for ${classId} on ${date}`);
    console.log(`[DATA] Records:`, attendanceData);

    res.status(201).json({ 
      success: true, 
      message: "Attendance recorded successfully",
      timestamp: new Date().toISOString()
    });
  });

  // ADMIN ONLY ANALYTICS
  app.get("/api/admin/system-stats", checkRole(['admin']), (req, res) => {
    res.json({
      users: 1364,
      uptime: "99.98%",
      aiCalls: 4200
    });
  });

  // Timetable Generator logic
  app.post("/api/timetable/generate", checkRole(['faculty', 'admin']), (req, res) => {
     // Placeholder for complex generator logic
     res.json({ message: "Timetable generated" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusAI running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
