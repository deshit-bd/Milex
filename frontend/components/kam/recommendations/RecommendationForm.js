"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import StepProgress from "./StepProgress";
import BasicInformationStep from "./BasicInformationStep";
import FinancialTermsStep from "./FinancialTermsStep";
import ContactPersonsStep from "./ContactPersonsStep";
import ShippingDetailsStep from "./ShippingDetailsStep";
import RecommendationDetailsStep from "./RecommendationDetailsStep";
import { DRAFT_KEY, INITIAL_FORM } from "./recommendationData";

export default function RecommendationForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    const parsedDraft = JSON.parse(draft);
    setForm({ ...INITIAL_FORM, ...(parsedDraft.form || parsedDraft) });
    setCurrentStep(parsedDraft.currentStep || 1);
  }, []);

  function updateForm(event) {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => {
      const nextForm = { ...current, [event.target.name]: value };
      if (event.target.name === "useKeyAsFinancial" && value) {
        nextForm.financialName = current.keyName;
        nextForm.financialDesignation = current.keyDesignation;
        nextForm.financialMobile = current.keyMobile;
        nextForm.financialEmail = current.keyEmail;
      }
      if (current.useKeyAsFinancial && event.target.name.startsWith("key")) {
        nextForm[`financial${event.target.name.slice(3)}`] = value;
      }
      return nextForm;
    });
  }

  function persist(step = currentStep) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, currentStep: step }));
  }

  function saveDraft() {
    persist();
    Swal.fire({ icon: "success", title: "Draft saved", timer: 900, showConfirmButton: false });
  }

  function nextStep(event) {
    event.preventDefault();
    if (!event.currentTarget.form.reportValidity()) return;
    const next = Math.min(currentStep + 1, 5);
    persist(next);
    setCurrentStep(next);
    Swal.fire({ icon: "success", title: "Information saved", text: "Ready for the next section.", timer: 900, showConfirmButton: false });
  }

  function submitRecommendation(event) {
    event.preventDefault();
    if (!event.currentTarget.form.reportValidity()) return;
    const wordCount = form.recommendationNote.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      Swal.fire({
        icon: "warning",
        title: "More detail required",
        text: `Please write at least 50 words. Current count: ${wordCount}.`,
        confirmButtonColor: "#078b4d",
      });
      return;
    }

    const record = { ...form, status: "Submitted to Sales Coordinator", submittedAt: new Date().toISOString() };
    localStorage.setItem("milex.kam.recommendation.submitted", JSON.stringify(record));
    localStorage.removeItem(DRAFT_KEY);
    Swal.fire({
      icon: "success",
      title: "Recommendation submitted",
      text: "The Sales Coordinator can now review this recommendation.",
      confirmButtonColor: "#078b4d",
    }).then(() => window.location.replace("/kam/dashboard"));
  }

  return (
    <form className="recommendation-form">
      <section className="form-card recommendation-header">
        <h1>New Recommendation Form</h1>
        <StepProgress currentStep={currentStep} />
      </section>
      {currentStep === 1 && <BasicInformationStep form={form} onChange={updateForm} onSave={saveDraft} onNext={nextStep} />}
      {currentStep === 2 && <FinancialTermsStep form={form} onChange={updateForm} onSave={saveDraft} onNext={nextStep} onPrevious={() => { persist(1); setCurrentStep(1); }} />}
      {currentStep === 3 && <ContactPersonsStep form={form} onChange={updateForm} onSave={saveDraft} onNext={nextStep} onPrevious={() => { persist(2); setCurrentStep(2); }} />}
      {currentStep === 4 && <ShippingDetailsStep form={form} onChange={updateForm} onSave={saveDraft} onNext={nextStep} onPrevious={() => { persist(3); setCurrentStep(3); }} />}
      {currentStep >= 5 && <RecommendationDetailsStep form={form} onChange={updateForm} onSave={saveDraft} onSubmit={submitRecommendation} onPrevious={() => { persist(4); setCurrentStep(4); }} />}
    </form>
  );
}
