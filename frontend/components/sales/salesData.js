import { FiCheckSquare, FiGrid, FiUsers } from "react-icons/fi";

export const SALES_NAV_ITEMS = [
  { label: "Dashboard", icon: FiGrid, href: "/sales/dashboard" },
  { label: "Task Queue & Record", icon: FiCheckSquare, href: "/sales/tasks" },
  { label: "Customers", icon: FiUsers, href: "#" },
];

export const SAMPLE_QUEUE_ITEM = {
  accountName: "L'USINE FASHION LTD.",
  customerCode: "MLX1707581",
  queueStatus: "Pending Rate Preparation",
};

export const SAMPLE_RECORDS = [
  { identifier: "MLX1707544", accountName: "NORBAN FASHION LTD", status: "PENDING LM APPROVAL", revision: "R - 2", tone: "warning" },
  { identifier: "MLX0425040", accountName: "GENIAL FASHION MART", status: "ACTIVE & DISTRIBUTED", revision: "New", tone: "success" },
  { identifier: "MLX1707581", accountName: "L'USINE FASHION LTD.", status: "PENDING RATE PREPARATION", revision: "New", tone: "info" },
];
