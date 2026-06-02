import { FiCheckSquare, FiGrid, FiUsers } from "react-icons/fi";

export const LINE_MANAGER_NAV_ITEMS = [
  { label: "Dashboard", icon: FiGrid, href: "/line-manager/dashboard" },
  { label: "Task Queue & Record", icon: FiCheckSquare, href: "/line-manager/tasks" },
  { label: "Customers", icon: FiUsers, href: "#" },
];

export const SAMPLE_LINE_MANAGER_QUEUE = {
  identifier: "MLX1707581",
  accountName: "Fakir Apparels Limited",
  queueStatus: "Pending Rate Approval",
};

export const LINE_MANAGER_RECORDS = [
  { identifier: "MLX1707544", accountName: "NORBAN FASHION LTD", status: "PENDING LM APPROVAL", revision: "R-2", tone: "warning" },
  { identifier: "MLX0425040", accountName: "GENIAL FASHION MART", status: "ACTIVE & DISTRIBUTED", revision: "New", tone: "success" },
  { identifier: "MLX1707581", accountName: "L'USINE FASHION LTD.", status: "PENDING RATE APPROVAL", revision: "New", tone: "warning" },
];
