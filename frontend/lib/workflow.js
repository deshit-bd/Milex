import {
  CLIENT_FINALIZATION_KEY,
  LINE_MANAGER_APPROVAL_KEY,
  OFFER_DOCUMENT_KEY,
  RATE_ACTION_KEY,
  SAMPLE_RECORD_DETAIL,
} from "@/components/sales/record/recordData";
import { SAMPLE_RECORDS } from "@/components/sales/salesData";
import { LINE_MANAGER_RECORDS } from "@/components/line-manager/lineManagerData";

export const CUSTOMER_CODE = "MLX25DHK001";
export const SUBMITTED_RECOMMENDATION_KEY = "milex.kam.recommendation.submitted";
export const SALES_SELECTED_RECORD_KEY = "milex.sales.selected-record";
export const LINE_MANAGER_SELECTED_RECORD_KEY = "milex.line-manager.selected-record";

export function readWorkflowItem(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function writeWorkflowItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWorkflowSnapshot() {
  return {
    submitted: readWorkflowItem(SUBMITTED_RECOMMENDATION_KEY),
    rateAction: readWorkflowItem(RATE_ACTION_KEY),
    approval: readWorkflowItem(LINE_MANAGER_APPROVAL_KEY),
    offerDocument: readWorkflowItem(OFFER_DOCUMENT_KEY),
    finalization: readWorkflowItem(CLIENT_FINALIZATION_KEY),
  };
}

export function getSalesWorkflowStatus(snapshot = getWorkflowSnapshot()) {
  if (snapshot.finalization?.stage === "activated") return { status: "ACTIVE & DISTRIBUTED", tone: "success" };
  if (snapshot.finalization?.stage === "documents") return { status: "CLIENT FINAL DATA UPDATE", tone: "info" };
  if (snapshot.finalization?.stage === "final-profile") return { status: "FINAL PROFILE DATA", tone: "info" };
  if (snapshot.finalization?.stage === "client-rejected") return { status: "OFFER REJECTED (REVISION REQUIRED)", tone: "danger" };
  if (snapshot.offerDocument) return { status: "OFFER DELIVERED (PENDING AGREEMENT)", tone: "warning" };
  if (snapshot.approval?.status === "Approved") return { status: "APPROVED (PENDING OFFER LETTER)", tone: "warning" };
  if (snapshot.approval?.status === "Revision Requested") return { status: "REVISION REQUESTED BY LM", tone: "warning" };
  if (snapshot.rateAction) return { status: "PENDING LM APPROVAL", tone: "warning" };
  if (snapshot.submitted) return { status: "PENDING RATE PREPARATION", tone: "info" };
  return { status: "PENDING RATE PREPARATION", tone: "info" };
}

export function getLineManagerWorkflowStatus(snapshot = getWorkflowSnapshot()) {
  if (snapshot.approval?.status === "Approved") return { status: "APPROVED BY LM", tone: "success" };
  if (snapshot.approval?.status === "Revision Requested") return { status: "REVISION REQUESTED", tone: "warning" };
  if (snapshot.rateAction) return { status: "PENDING RATE APPROVAL", tone: "warning" };
  return { status: "WAITING FOR RATE", tone: "info" };
}

export function buildRecordFromWorkflow(selectedRecord = null) {
  const snapshot = getWorkflowSnapshot();
  const submitted = snapshot.submitted || {};
  const base = {
    ...SAMPLE_RECORD_DETAIL,
    ...(selectedRecord || {}),
  };

  return {
    ...base,
    identifier: selectedRecord?.identifier || snapshot.rateAction?.identifier || CUSTOMER_CODE,
    accountName: submitted.accountName || selectedRecord?.accountName || base.accountName,
    address: submitted.primaryAddress || base.address,
    businessType: submitted.businessType || base.businessType,
    mobile: submitted.mobileNumber || base.mobile,
    email: submitted.emailAddress || base.email,
    requestedLimit: submitted.creditLimit
      ? `${submitted.creditLimit}${submitted.creditPeriod ? ` (${submitted.creditPeriod} Days)` : ""}`
      : base.requestedLimit,
    keyContact: {
      name: submitted.keyName || base.keyContact.name,
      phone: submitted.keyMobile || base.keyContact.phone,
      email: submitted.keyEmail || base.keyContact.email,
    },
    financialContact: {
      name: submitted.financialName || base.financialContact.name,
      phone: submitted.financialMobile || base.financialContact.phone,
      email: submitted.financialEmail || base.financialContact.email,
    },
    recommendationNote: submitted.recommendationNote || base.recommendationNote,
  };
}

export function getSalesRecords() {
  const snapshot = getWorkflowSnapshot();
  const workflowStatus = getSalesWorkflowStatus(snapshot);
  const records = [...SAMPLE_RECORDS];

  if (snapshot.submitted) {
    const submittedRecord = {
      identifier: CUSTOMER_CODE,
      accountName: snapshot.submitted.accountName || "New Recommended Customer",
      status: workflowStatus.status,
      revision: snapshot.approval?.status === "Revision Requested" || snapshot.finalization?.stage === "client-rejected" ? "R-1" : "New",
      tone: workflowStatus.tone,
    };
    const existingIndex = records.findIndex((record) => record.identifier === CUSTOMER_CODE);
    if (existingIndex >= 0) records[existingIndex] = submittedRecord;
    else records.push(submittedRecord);
  }

  return records;
}

export function getLineManagerRecords() {
  const snapshot = getWorkflowSnapshot();
  const workflowStatus = getLineManagerWorkflowStatus(snapshot);
  const records = [...LINE_MANAGER_RECORDS];

  if (snapshot.rateAction) {
    const rateRecord = {
      identifier: snapshot.rateAction.identifier || CUSTOMER_CODE,
      accountName: snapshot.rateAction.accountName || "Forwarded Customer",
      status: workflowStatus.status,
      revision: snapshot.approval?.status === "Revision Requested" ? "R-1" : "New",
      tone: workflowStatus.tone,
    };
    const existingIndex = records.findIndex((record) => record.identifier === rateRecord.identifier);
    if (existingIndex >= 0) records[existingIndex] = rateRecord;
    else records.push(rateRecord);
  }

  return records;
}
