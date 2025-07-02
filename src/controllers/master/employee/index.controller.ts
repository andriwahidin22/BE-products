import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Generate initials for avatar (e.g., "John Doe" → "JD")
function generateAvatar(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Generate unique employee ID, e.g., "EMP001"
function generateEmployeeId(index: number): string {
  return `EMP${index.toString().padStart(3, "0")}`;
}

// GET /employees?search=&department=&position=
export const getAllEmployees = async (req: Request, res: Response) => {
  const { search, department, position } = req.query;

  const filters: any = {
    ...(search && {
      OR: [
        { name: { contains: String(search), mode: "insensitive" } },
        { email: { contains: String(search), mode: "insensitive" } },
      ],
    }),
    ...(department && { department: String(department) }),
    ...(position && { position: String(position) }),
  };

  const employees = await prisma.employee.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    success: true,
    data: { employees },
  });
};

// GET /employees/:id
export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee)
    return res
      .status(404)
      .json({ success: false, message: "Employee not found" });

  res.status(200).json({ success: true, data: { employee } });
};

// POST /employees
export const createEmployee = async (req: Request, res: Response) => {
  const { name, position, department, email, phone, startDate } = req.body;

  // Cek jika email sudah digunakan
  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing)
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });

  const count = await prisma.employee.count();
  const employeeId = generateEmployeeId(count + 1);
  const avatar = generateAvatar(name);

  const employee = await prisma.employee.create({
    data: {
      employeeId,
      name,
      position,
      department,
      email,
      phone,
      startDate: new Date(startDate),
      avatar,
      status: "ACTIVE",
    },
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: { employee },
  });
};

// PUT /employees/:id
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, position, department, email, phone, startDate, status } =
    req.body;

  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing)
    return res
      .status(404)
      .json({ success: false, message: "Employee not found" });

  const avatar = generateAvatar(name);

  const employee = await prisma.employee.update({
    where: { id },
    data: {
      name,
      position,
      department,
      email,
      phone,
      startDate: new Date(startDate),
      avatar,
      status,
    },
  });

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: { employee },
  });
};

// DELETE /employees/:id
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing)
    return res
      .status(404)
      .json({ success: false, message: "Employee not found" });

  await prisma.employee.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
};
