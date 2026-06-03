export const DB_KEY = "milex.database.v2";
const API_URL = "/api/database";

const INITIAL_DB = {
  records: [],
  customers: [],
  nextCustomerNumber: 1,
};

export function ensureDatabase() {
  if (typeof window === "undefined") return INITIAL_DB;

  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(DB_KEY);
    }
  }

  localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
  return INITIAL_DB;
}

export function readDatabase() {
  return ensureDatabase();
}

export function writeDatabase(nextDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(nextDb));
  return nextDb;
}

function clearBrowserDatabaseData() {
  if (typeof window === "undefined") return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith("milex.") && key !== "milex.session")
    .forEach((key) => localStorage.removeItem(key));
}

export function readRecords() {
  return readDatabase().records || [];
}

export function readCustomers() {
  return readDatabase().customers || [];
}

export function upsertRecord(record) {
  const db = readDatabase();
  const records = db.records || [];
  const existingIndex = records.findIndex((item) => item.identifier === record.identifier);
  const nextRecord = { revision: "New", tone: "info", ...records[existingIndex], ...record };
  const nextRecords =
    existingIndex >= 0
      ? records.map((item, index) => (index === existingIndex ? nextRecord : item))
      : [...records, nextRecord];

  writeDatabase({ ...db, records: nextRecords });
  return nextRecord;
}

export function updateRecordStatus(identifier, status, tone = "info", extras = {}) {
  return upsertRecord({ identifier, status, tone, ...extras });
}

export function upsertCustomer(customer) {
  const db = readDatabase();
  const customers = db.customers || [];
  const existingIndex = customers.findIndex((item) => item.customerId === customer.customerId);
  const nextCustomer = { status: "ACTIVE & DISTRIBUTED", ...customers[existingIndex], ...customer };
  const nextCustomers =
    existingIndex >= 0
      ? customers.map((item, index) => (index === existingIndex ? nextCustomer : item))
      : [...customers, nextCustomer];

  writeDatabase({ ...db, customers: nextCustomers });
  return nextCustomer;
}

export function getDashboardStats(records = readRecords()) {
  const activeAccounts = records.filter((record) => record.status === "ACTIVE & DISTRIBUTED").length;
  const pipelineAccounts = records.filter((record) => record.status !== "ACTIVE & DISTRIBUTED").length;
  const yourQueue = records.filter((record) =>
    ["PENDING RATE PREPARATION", "PENDING LM APPROVAL", "PENDING RATE APPROVAL"].includes(record.status)
  ).length;
  const conversionRate = records.length ? Math.round((activeAccounts / records.length) * 100) : 0;

  return {
    activeAccounts,
    pipelineAccounts,
    yourQueue,
    conversionRate,
  };
}

export function resetDemoData() {
  if (typeof window === "undefined") return INITIAL_DB;

  Object.keys(localStorage)
    .filter((key) => key.startsWith("milex.") && key !== "milex.session")
    .forEach((key) => localStorage.removeItem(key));

  localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
  return INITIAL_DB;
}

export function generateCustomerCode() {
  const db = readDatabase();
  const nextNumber = db.nextCustomerNumber || 1;
  const identifier = `MLX${String(nextNumber).padStart(6, "0")}`;

  writeDatabase({ ...db, nextCustomerNumber: nextNumber + 1 });
  return identifier;
}

export async function fetchDatabase() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Database request failed");
    writeDatabase({
      records: result.db.records || [],
      customers: result.db.customers || [],
      nextCustomerNumber: result.db.nextCustomerNumber || 1,
      workflow: result.db.workflow || {},
    });
    return result.db;
  } catch (error) {
    return { ...readDatabase(), workflow: readDatabase().workflow || {}, apiError: error.message };
  }
}

export async function runDatabaseAction(type, payload = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Database action failed");
    if (result.db) {
      if (type === "resetDatabase") clearBrowserDatabaseData();
      writeDatabase({
        records: result.db.records || [],
        customers: result.db.customers || [],
        nextCustomerNumber: result.db.nextCustomerNumber || 1,
        workflow: result.db.workflow || {},
      });
    }
    return result;
  } catch (error) {
    return { ok: false, error: error.message, db: readDatabase() };
  }
}

export async function generateCustomerCodeFromServer() {
  const result = await runDatabaseAction("generateCustomerCode");
  return result.identifier || generateCustomerCode();
}

export async function upsertRecordOnServer(record) {
  const localRecord = upsertRecord(record);
  const result = await runDatabaseAction("upsertRecord", { record });
  return result.record || localRecord;
}

export async function updateRecordStatusOnServer(identifier, status, tone = "info", extras = {}) {
  const localRecord = updateRecordStatus(identifier, status, tone, extras);
  const result = await runDatabaseAction("updateRecordStatus", { identifier, status, tone, extras });
  return result.record || localRecord;
}

export async function upsertCustomerOnServer(customer) {
  const localCustomer = upsertCustomer(customer);
  const result = await runDatabaseAction("upsertCustomer", { customer });
  return result.customer || localCustomer;
}
