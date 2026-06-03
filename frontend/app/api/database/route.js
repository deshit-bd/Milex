import { NextResponse } from "next/server";
import {
  deleteSheetRecord,
  deleteSheetWorkflowItem,
  generateSheetCustomerCode,
  readSheetDatabase,
  resetSheetDatabase,
  upsertSheetCustomer,
  upsertSheetRecord,
  writeSheetWorkflowItem,
} from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

const INITIAL_DB = {
  records: [],
  customers: [],
  workflow: {},
  nextCustomerNumber: 1,
};

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function friendlyError(error) {
  return {
    ok: false,
    error: error.message,
    setup:
      "Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local/Vercel, then share the Sheet with the service account email.",
  };
}

async function getDb() {
  return readSheetDatabase();
}

export async function GET() {
  try {
    return json({ ok: true, db: await getDb() });
  } catch (error) {
    return json({ ...friendlyError(error), db: INITIAL_DB }, 503);
  }
}

export async function POST(request) {
  try {
    const { type, payload = {} } = await request.json();

    if (type === "generateCustomerCode") {
      return json({ ok: true, identifier: await generateSheetCustomerCode(), db: await getDb() });
    }

    if (type === "resetDatabase") {
      return json({ ok: true, db: await resetSheetDatabase() });
    }

    if (type === "writeWorkflowItem") {
      await writeSheetWorkflowItem(payload.key, payload.value);
      return json({ ok: true, db: await getDb() });
    }

    if (type === "deleteWorkflowItem") {
      await deleteSheetWorkflowItem(payload.key);
      return json({ ok: true, db: await getDb() });
    }

    if (type === "upsertRecord") {
      const db = await getDb();
      const existing = db.records.find((item) => item.identifier === payload.record.identifier);
      const record = { revision: "New", tone: "info", ...existing, ...payload.record };
      await upsertSheetRecord(record);
      return json({ ok: true, record, db: await getDb() });
    }

    if (type === "deleteRecord") {
      await deleteSheetRecord(payload.identifier);
      return json({ ok: true, db: await getDb() });
    }

    if (type === "updateRecordStatus") {
      const db = await getDb();
      const existing = db.records.find((item) => item.identifier === payload.identifier);
      const record = {
        revision: "New",
        tone: payload.tone || "info",
        ...existing,
        ...(payload.extras || {}),
        identifier: payload.identifier,
        status: payload.status,
        tone: payload.tone || "info",
      };
      await upsertSheetRecord(record);
      return json({ ok: true, record, db: await getDb() });
    }

    if (type === "forwardRate") {
      const db = await getDb();
      const existing = db.records.find((item) => item.identifier === payload.identifier);
      const record = {
        revision: existing?.revision || "New",
        tone: "warning",
        ...existing,
        accountName: payload.accountName || existing?.accountName || "",
        identifier: payload.identifier,
        status: "PENDING LM APPROVAL",
        tone: "warning",
        rateAction: payload.rateAction,
        lineManagerApproval: null,
        lineManagerDecision: "",
        lineManagerDecidedAt: "",
        revisionNote: "",
        rateForwardedAt: new Date().toISOString(),
      };
      await upsertSheetRecord(record);
      return json({ ok: true, record, db: await getDb() });
    }

    if (type === "upsertCustomer") {
      const db = await getDb();
      const existing = db.customers.find((item) => item.customerId === payload.customer.customerId);
      const customer = { status: "ACTIVE & DISTRIBUTED", ...existing, ...payload.customer };
      await upsertSheetCustomer(customer);
      return json({ ok: true, customer, db: await getDb() });
    }

    if (type === "submitRecommendation") {
      const recommendation = payload.record;
      const record = {
        ...recommendation,
        identifier: recommendation.identifier,
        accountName: recommendation.accountName,
        status: "PENDING RATE PREPARATION",
        revision: "New",
        tone: "info",
        recommendation,
        rateAction: null,
        lineManagerApproval: null,
        offerDocument: null,
        finalization: null,
        revisionNote: "",
      };
      await upsertSheetRecord(record);
      return json({ ok: true, record, db: await getDb() });
    }

    return json({ ok: false, error: `Unknown action: ${type}` }, 400);
  } catch (error) {
    return json(friendlyError(error), 503);
  }
}
