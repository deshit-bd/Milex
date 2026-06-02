export const SAMPLE_RECORD_DETAIL = {
  identifier: "MLX1707581",
  accountName: "L'USINE FASHION LTD.",
  status: "PENDING RATE PREPARATION",
  address: "A-127-131, 135-138, 142-145, B-501-503 BSCIC Industrial Area, Enayetnagar, Shashangaon, Fatullah, Narayanganj P.O. Box: 1400",
  businessType: "Garments",
  mobile: "+8802997746185",
  email: "info@fakirapparels.com",
  requestedLimit: "TK 50000 (30 Days)",
  keyContact: { name: "Mr. Xyz (MD)", phone: "+8802997746185", email: "info@fakirapparels.com" },
  financialContact: { name: "Mr. GPO (CFO)", phone: "+8802997746185", email: "info@fakirapparels.com" },
  recommendationNote: "NEED TO OFFER MX RATE.",
};

export const RATE_ACTION_KEY = "milex.sales.rate-action";
export const LINE_MANAGER_APPROVAL_KEY = "milex.line-manager.approval";
export const OFFER_DOCUMENT_KEY = "milex.sales.offer-document";
export const CLIENT_FINALIZATION_KEY = "milex.sales.client-finalization";

export const FINAL_PROFILE_INITIAL = {
  managingPartner: "",
  binNumber: "",
  tinNumber: "",
  destinations: "",
  preferredCarrier: "",
  natureOfBusiness: "",
  accountSpecifics: "",
  finalAmountLimit: "",
  finalTimeLimit: "",
};

export const LEGAL_DOCUMENTS_INITIAL = [
  { id: "offer-letter", title: "Offer Letter", required: true, documentNumber: "", expiryDate: "", fileName: "" },
  { id: "signed-agreement", title: "Signed Agreement", required: true, documentNumber: "", expiryDate: "", fileName: "" },
  { id: "tin", title: "Customer TIN", required: true, documentNumber: "", expiryDate: "", fileName: "" },
  { id: "bin", title: "Customer BIN", required: true, documentNumber: "", expiryDate: "", fileName: "" },
  { id: "trade-license", title: "Trade License", required: true, documentNumber: "", expiryDate: "", fileName: "" },
  { id: "other-documents", title: "Other Documents", required: false, documentNumber: "", expiryDate: "", fileName: "" },
];
