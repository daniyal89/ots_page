import React, { useMemo, useState } from "react";

// OTS Registration Page - aligns with fields from the provided DOCX and scheme rules from the PDF.
// TailwindCSS layout; no external requests. Replace sample values with live data wiring as needed.

export default function OTSRegistrationPage() {
  // --- Sample Consumer (from DOCX) ---
  const sampleConsumer = {
    accountId: "10005256822",
    name: "Rahul",
    mobile: "94****6588",
    category: "LMV1",
    sanctionedLoad: 2,
    supplyType: 10,
    principal: 50000,
    lpsc: 10000,
  };

  const [consumer] = useState(sampleConsumer);
  const [mobile, setMobile] = useState(consumer.mobile.replace(/\*/g, ""));
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Option selections
  const [selectedPath, setSelectedPath] = useState<"LUMPSUM" | "INSTALLMENT" | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>("phase1");
  const [selectedInstallment, setSelectedInstallment] = useState<"750" | "500" | null>("750");
  const [lumpsumAdvance, setLumpsumAdvance] = useState<number>(2000);

  // Mobile step wizard state
  const [mobileStep, setMobileStep] = useState(1); // min 2000 as per DOCX

  // Language (EN/HI)
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const i18n = {
    en: {
      headerTitle: "One Time Settlement (OTS) - Registration",
      tagline: "Easy Payment & LPSC Waiver",
      consumerDetail: "Consumer Detail",
      accountId: "Account ID",
      name: "Name",
      mobileLabel: "Mobile",
      category: "Category",
      sanctionedLoad: "Sanctioned Load",
      supplyType: "Supply Type",
      principalAmountLabel: "Principal Amount",
      lpscAmountLabel: "LPSC Amount",
      registrationFeesLabel: "Registration Fees",
      waiverOffLabel: "Waiver Off",
      totalPayable: "Total payable",
      optionA_title: "Option A. LPSC waiver - Full Payment",
      onlyPhase1: "Only Phase 1 is available",
      onlyPhase1Short: "Only Phase 1 available",
      phaseWindow: "Phase window",
      inputAmountMin: "Input amount (min Rs 2000)",
      select: "Select",
      selected: "Selected",
      optionB_title: "Option B. LPSC waiver - Installments",
      optionHeader: "Option",
      noOfInstallments: "No. of installments",
      installmentsLabel: "Installments",
      verifyMobile: "Verify your mobile",
      confirmMobile: "Confirm mobile number",
      sendOtp: "Send OTP",
      enterOtp: "Enter OTP",
      verify: "Verify",
      verified: "Verified",
      noteVerify: "Note: You must verify mobile to enable payment.",
      backToTop: "Back to top",
      proceedAndPay: "Proceed and Pay",
      details: "Details",
      chooseOption: "Choose option",
      selectPlan: "Select plan",
      verifyAndPay: "Verify & pay",
      fullPaymentLabel: "Full Payment (LPSC waiver)",
      installmentsWithWaiver: "Installments (LPSC waiver)",
      fullPaymentSelectPhase: "Full Payment - select phase",
      installmentsSelectPlan: "Installments - select plan",
      inputAmount: "Input amount",
      min2000: "Min Rs 2000",
    },
    hi: {
      headerTitle: "वन टाइम सेटलमेंट (OTS) - पंजीकरण",
      tagline: "आसान भुगतान व LPSC माफी",
      consumerDetail: "उपभोक्ता विवरण",
      accountId: "खाता आईडी",
      name: "नाम",
      mobileLabel: "मोबाइल",
      category: "श्रेणी",
      sanctionedLoad: "स्वीकृत लोड",
      supplyType: "आपूर्ति प्रकार",
      principalAmountLabel: "मूल धनराशि",
      lpscAmountLabel: "LPSC राशि",
      registrationFeesLabel: "पंजीकरण शुल्क",
      waiverOffLabel: "माफी",
      totalPayable: "देय कुल राशि",
      optionA_title: "विकल्प A. LPSC माफी - पूर्ण भुगतान",
      onlyPhase1: "केवल चरण 1 उपलब्ध है",
      onlyPhase1Short: "केवल चरण 1 उपलब्ध",
      phaseWindow: "चरण अवधि",
      inputAmountMin: "राशि दर्ज करें (न्यूनतम ₹2000)",
      select: "चयन",
      selected: "चयनित",
      optionB_title: "विकल्प B. LPSC माफी - किस्तें",
      optionHeader: "विकल्प",
      noOfInstallments: "किस्तों की संख्या",
      installmentsLabel: "किस्तें",
      verifyMobile: "मोबाइल सत्यापित करें",
      confirmMobile: "मोबाइल नंबर की पुष्टि करें",
      sendOtp: "OTP भेजें",
      enterOtp: "OTP दर्ज करें",
      verify: "सत्यापित करें",
      verified: "सत्यापित",
      noteVerify: "नोट: भुगतान सक्षम करने के लिए मोबाइल सत्यापन आवश्यक है।",
      backToTop: "शीर्ष पर जाएँ",
      proceedAndPay: "आगे बढ़ें और भुगतान करें",
      details: "विवरण",
      chooseOption: "विकल्प चुनें",
      selectPlan: "योजना चुनें",
      verifyAndPay: "सत्यापित करें और भुगतान करें",
      fullPaymentLabel: "पूर्ण भुगतान (LPSC माफी)",
      installmentsWithWaiver: "किस्तें (LPSC माफी)",
      fullPaymentSelectPhase: "पूर्ण भुगतान - चरण चुनें",
      installmentsSelectPlan: "किस्तें - योजना चुनें",
      inputAmount: "राशि दर्ज करें",
      min2000: "न्यूनतम ₹2000",
    },
  } as const;
  const t = (k: keyof typeof i18n['en']) => (i18n as any)[lang][k] as string;

  // Phases per DOCX (dates shown for UI only)
  const phases = [
    { key: "phase1", window: "01/10/2025 - 15/10/2025", discount: 17500, payEditable: true },
    { key: "phase2", window: "15/10/2025 - 30/10/2025", discount: 15000, payEditable: false },
    { key: "phase3", window: "01/11/2025 - 15/11/2025", discount: 12000, payEditable: false },
  ];

  const totals = useMemo(() => {
    const base = consumer.principal + consumer.lpsc;
    const map: Record<string, number> = {};
    phases.forEach((p) => (map[p.key] = Math.max(0, base - p.discount)));
    return map;
  }, [consumer, phases]);

  const installmentPlans = [
    { key: "750", title: "With Rs 750 installment", discount: 15000, installments: 58, enabled: true },
    { key: "500", title: "With Rs 500 installment", discount: 10000, installments: 96, enabled: true },
  ];

  const canPay = useMemo(() => {
    if (!otpVerified) return false;
    if (selectedPath === "LUMPSUM") return Boolean(selectedPhase);
    if (selectedPath === "INSTALLMENT") return Boolean(selectedInstallment);
    return false;
  }, [otpVerified, selectedPath, selectedPhase, selectedInstallment]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{t('headerTitle')}</h1>
          <div className="flex items-center gap-3"><div className="text-sm text-gray-500">{t('tagline')}</div><div className="text-xs border rounded-full overflow-hidden"><button type="button" onClick={() => setLang('en')} className={"px-2 py-1 " + (lang==='en' ? 'bg-blue-600 text-white' : 'bg-white')}>EN</button><button type="button" onClick={() => setLang('hi')} className={"px-2 py-1 " + (lang==='hi' ? 'bg-blue-600 text-white' : 'bg-white')}>हिं</button></div></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <div className="hidden lg:block">
        {/* Consumer Details */}
        <section className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-3">{t('consumerDetail')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <Field label={t('accountId')} value={consumer.accountId} />
            <Field label={t('name')} value={consumer.name} />
            <Field label={t('mobileLabel')} value={consumer.mobile} />
            <Field label={t('category')} value={consumer.category} />
            <Field label={t('sanctionedLoad')} value={`${consumer.sanctionedLoad} kW`} />
            <Field label={t('supplyType')} value={`${consumer.supplyType}`} />
            <Field label={t('principalAmountLabel')} value={`Rs ${consumer.principal.toLocaleString()}`} />
            <Field label={t('lpscAmountLabel')} value={`Rs ${consumer.lpsc.toLocaleString()}`} />
          </div>
        </section>

        

        {/* Option A - LPSC Waive off (Full Payment) */}
        <section className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">{t('optionA_title')} <span className="text-xs font-normal text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{t('onlyPhase1')}</span></h2>
            <TogglePath name="path" checked={selectedPath === "LUMPSUM"} onClick={() => setSelectedPath("LUMPSUM")} />
          </div>

          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <Th>{t('phaseWindow')}</Th>
                  <Th>{t('principalAmountLabel')}</Th>
                  <Th>{t('lpscAmountLabel')}</Th>
                  <Th>{t('registrationFeesLabel')}</Th>
                  <Th>{t('waiverOffLabel')}</Th>
                  <Th>{t('totalPayable')}</Th>
                  <Th>{t('inputAmountMin')}</Th>
                  <Th>{t('select')}</Th>
                </tr>
              </thead>
              <tbody>
                {phases.map((p) => (
                  <tr key={p.key} className={`border-t ${p.key !== "phase1" ? "opacity-60" : ""}`} title={p.key !== "phase1" ? t('onlyPhase1') : ""}>
                    <Td>{p.window}</Td>
                    <Td>Rs {consumer.principal.toLocaleString()}</Td>
                    <Td>Rs {consumer.lpsc.toLocaleString()}</Td>
                    <Td>Rs 2,000</Td>
                    <Td>Rs {p.discount.toLocaleString()}</Td>
                    <Td>Rs {totals[p.key].toLocaleString()}</Td>
                    <Td>
                      <input
                        type="number"
                        min={2000}
                        value={p.key === selectedPhase ? lumpsumAdvance : 2000}
                        disabled={!p.payEditable || selectedPath !== "LUMPSUM" || selectedPhase !== p.key}
                        onChange={(e) => setLumpsumAdvance(Number(e.target.value))}
                        className="w-36 rounded-lg border px-3 py-2 disabled:bg-gray-100"
                      />
                    </Td>
                    <Td>
                      <input
                        type="radio"
                        name="lumpsum-phase"
                        checked={selectedPath === "LUMPSUM" && selectedPhase === p.key}
                        disabled={p.key !== "phase1"} className={p.key !== "phase1" ? "cursor-not-allowed" : ""} title={p.key !== "phase1" ? t('onlyPhase1') : ""}
                        onChange={() => {
                          setSelectedPath("LUMPSUM");
                          setSelectedPhase(p.key);
                        }}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile/cards for Option A */}
          <div className="lg:hidden space-y-3">
            {phases.map((p) => (
              <div key={p.key} className={`rounded-xl border p-4 ${p.key !== "phase1" ? "opacity-60" : ""}`} title={p.key !== "phase1" ? t('onlyPhase1') : ""}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{p.window}</div>
                  <input
                    type="radio"
                    name="lumpsum-phase-m"
                    checked={selectedPath === "LUMPSUM" && selectedPhase === p.key}
                    disabled={p.key !== "phase1"}
                    className={p.key !== "phase1" ? "cursor-not-allowed" : ""}
                    title={p.key !== "phase1" ? t('onlyPhase1') : ""}
                    onChange={() => { setSelectedPath("LUMPSUM"); setSelectedPhase(p.key); }}
                  />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-gray-500">{t('principalAmountLabel')}</dt><dd className="font-medium">Rs {consumer.principal.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('lpscAmountLabel')}</dt><dd className="font-medium">Rs {consumer.lpsc.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('registrationFeesLabel')}</dt><dd className="font-medium">Rs 2,000</dd></div>
                  <div><dt className="text-gray-500">{t('waiverOffLabel')}</dt><dd className="font-medium">Rs {p.discount.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('totalPayable')}</dt><dd className="font-medium">Rs {totals[p.key].toLocaleString()}</dd></div>
                </dl>
                <div className="mt-3">
                  <label className="text-sm mr-2">{t('inputAmount')}</label>
                  <input
                    type="number"
                    min={2000}
                    value={p.key === selectedPhase ? lumpsumAdvance : 2000}
                    disabled={!p.payEditable || selectedPath !== "LUMPSUM" || selectedPhase !== p.key}
                    onChange={(e) => setLumpsumAdvance(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
                    placeholder={t('min2000')}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Selections for Phase 2 & 3 will open later.</p>
        </section>

        {/* Option B - Installments */}
        <section className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{t('optionB_title')}</h2>
            <TogglePath name="path" checked={selectedPath === "INSTALLMENT"} onClick={() => setSelectedPath("INSTALLMENT")} />
          </div>

          <div className="overflow-x-auto hidden lg:block">
            <table className="min-w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <Th>{t('optionHeader')}</Th>
                  <Th>{t('principalAmountLabel')}</Th>
                  <Th>{t('lpscAmountLabel')}</Th>
                  <Th>{t('registrationFeesLabel')}</Th>
                  <Th>{t('waiverOffLabel')}</Th>
                  <Th>{t('totalPayable')}</Th>
                  <Th>{t('noOfInstallments')}</Th>
                  <Th>{t('select')}</Th>
                </tr>
              </thead>
              <tbody>
                {installmentPlans.map((p) => {
                  const total = consumer.principal + consumer.lpsc - p.discount;
                  const disabled = !p.enabled;
                  return (
                    <tr key={p.key} className="border-t">
                      <Td>{lang==='en' ? `With Rs ${p.key} installment` : `₹ ${p.key} किस्त`}</Td>
                      <Td>Rs {consumer.principal.toLocaleString()}</Td>
                      <Td>Rs {consumer.lpsc.toLocaleString()}</Td>
                      <Td>Rs 2,000</Td>
                      <Td>Rs {p.discount.toLocaleString()}</Td>
                      <Td>Rs {total.toLocaleString()}</Td>
                      <Td>{p.installments}</Td>
                      <Td>
                        <input
                          type="radio"
                          name="installment"
                          checked={selectedPath === "INSTALLMENT" && selectedInstallment === p.key}
                          disabled={disabled}
                          onChange={() => {
                            setSelectedPath("INSTALLMENT");
                            setSelectedInstallment(p.key as any);
                          }}
                        />
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        {/* Mobile/cards for Option B */}
        <div className="lg:hidden space-y-3">
          {installmentPlans.map((p) => {
            const total = consumer.principal + consumer.lpsc - p.discount;
            const disabled = !p.enabled;
            return (
              <div key={p.key} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{lang==='en' ? `With Rs ${p.key} installment` : `₹ ${p.key} किस्त`}</div>
                  <input
                    type="radio"
                    name="installment-m"
                    checked={selectedPath === "INSTALLMENT" && selectedInstallment === p.key}
                    disabled={disabled}
                    onChange={() => { setSelectedPath("INSTALLMENT"); setSelectedInstallment(p.key as any); }}
                  />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-gray-500">{t('principalAmountLabel')}</dt><dd className="font-medium">Rs {consumer.principal.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('lpscAmountLabel')}</dt><dd className="font-medium">Rs {consumer.lpsc.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('registrationFeesLabel')}</dt><dd className="font-medium">Rs 2,000</dd></div>
                  <div><dt className="text-gray-500">{t('waiverOffLabel')}</dt><dd className="font-medium">Rs {p.discount.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('totalPayable')}</dt><dd className="font-medium">Rs {total.toLocaleString()}</dd></div>
                  <div><dt className="text-gray-500">{t('installmentsLabel')}</dt><dd className="font-medium">{p.installments}</dd></div>
                </dl>
              </div>
            );
          })}
        </div>
      </section>

        {/* Mobile Verification */}
        <section className="bg-white rounded-2xl shadow p-5 space-y-3">
          <h2 className="text-lg font-semibold">{t('verifyMobile')}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">{t('confirmMobile')}</label>
            <input
              className="rounded-lg border px-3 py-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile"
              inputMode="numeric"
              maxLength={10}
            />
            <button
              type="button"
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              onClick={() => {
                if (mobile.trim().length < 10) { alert("Enter a valid 10-digit mobile number"); return; }
                setOtpSent(true);
                alert("OTP sent");
              }}
            >
              {t('sendOtp')}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm">{t('enterOtp')}</label>
            <input
              className="rounded-lg border px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              inputMode="numeric"
              maxLength={6}
            />
            <button
              type="button"
              className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              disabled={!otpSent}
              onClick={() => {
                if (otp.trim().length < 4) { alert(t('enterOtp')); return; }
                setOtpVerified(true);
                alert("OTP verified");
              }}
            >{t('verify')}</button>
            {otpVerified && <span className="text-sm text-green-600">{t('verified')}</span>}
          </div>
          {!otpVerified && <p className="text-xs text-gray-500">{t('noteVerify')}</p>}
        </section>
        <div className="sticky bottom-0 bg-gray-50 py-3 border-t shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border shadow-sm bg-white hover:bg-gray-50"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {t('backToTop')}
            </button>
            <button
              disabled={!canPay}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
              onClick={() => alert("Proceeding to payment gateway (prototype)")}
            >
              {t('proceedAndPay')}
            </button>
          </div>
        </div>
      </div>

        {/* Mobile Stepper (wizard) */}
        <section className="lg:hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{lang==='en' ? `Step ${mobileStep} of 4` : `चरण ${mobileStep}/4`}</div>
            <div className="text-xs text-gray-500">{mobileStep === 1 ? t('details') : mobileStep === 2 ? t('chooseOption') : mobileStep === 3 ? t('selectPlan') : t('verifyAndPay')}</div>
          </div>

          {mobileStep === 1 && (
            <>
              <section className="bg-white rounded-2xl shadow p-5">
                <h2 className="text-lg font-semibold mb-3">{t('consumerDetail')}</h2>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <Field label={t('accountId')} value={consumer.accountId} />
                  <Field label={t('name')} value={consumer.name} />
                  <Field label={t('mobileLabel')} value={consumer.mobile} />
                  <Field label={t('category')} value={consumer.category} />
                  <Field label={t('sanctionedLoad')} value={`${consumer.sanctionedLoad} kW`} />
                  <Field label={t('supplyType')} value={`${consumer.supplyType}`} />
                  <Field label={t('principalAmountLabel')} value={`Rs ${consumer.principal.toLocaleString()}`} />
                  <Field label={t('lpscAmountLabel')} value={`Rs ${consumer.lpsc.toLocaleString()}`} />
                </div>
              </section>
              
              <div className="flex gap-3">
                <button className="w-full px-5 py-3 rounded-2xl border shadow-sm bg-white" onClick={() => setMobileStep(2)}>Next</button>
              </div>
            </>
          )}

          {mobileStep === 2 && (
            <section className="bg-white rounded-2xl shadow p-5 space-y-3">
              <h2 className="text-lg font-semibold">{t('chooseOption')}</h2>
              <div className="grid gap-3">
                <button type="button" className={`p-4 rounded-xl border text-left ${selectedPath === "LUMPSUM" ? "ring-2 ring-blue-600 border-blue-600" : ""}`} onClick={() => { setSelectedPath("LUMPSUM"); }}>
                  <div className="font-medium">{t('fullPaymentLabel')}</div>
                  <div className="text-sm text-gray-600">{t('onlyPhase1Short')}</div>
                </button>
                <button type="button" className={`p-4 rounded-xl border text-left ${selectedPath === "INSTALLMENT" ? "ring-2 ring-blue-600 border-blue-600" : ""}`} onClick={() => { setSelectedPath("INSTALLMENT"); }}>
                  <div className="font-medium">{t('installmentsWithWaiver')}</div>
                  <div className="text-sm text-gray-600">{lang==='en' ? 'Rs 750 or Rs 500 installment' : '₹750 या ₹500 किस्त'}</div>
                </button>
              </div>
              <div className="flex gap-3">
                <button className="w-full px-5 py-3 rounded-2xl border shadow-sm bg-white" onClick={() => setMobileStep(1)}>Back</button>
                <button className="w-full px-5 py-3 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700" disabled={!selectedPath} onClick={() => setMobileStep(3)}>Next</button>
              </div>
            </section>
          )}

          {mobileStep === 3 && selectedPath === "LUMPSUM" && (
            <section className="bg-white rounded-2xl shadow p-5 space-y-3">
              <h2 className="text-lg font-semibold">{t('fullPaymentSelectPhase')}</h2>
              {phases.map((p) => (
                <div key={p.key} className={`rounded-xl border p-4 ${p.key !== "phase1" ? "opacity-60" : ""}`} title={p.key !== "phase1" ? t('onlyPhase1') : ""}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{p.window}</div>
                    <input
                      type="radio"
                      name="lumpsum-phase-w"
                      checked={selectedPath === "LUMPSUM" && selectedPhase === p.key}
                      disabled={p.key !== "phase1"}
                      className={p.key !== "phase1" ? "cursor-not-allowed" : ""}
                      title={p.key !== "phase1" ? t('onlyPhase1') : ""}
                      onChange={() => { setSelectedPath("LUMPSUM"); setSelectedPhase(p.key); }}
                    />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div><dt className="text-gray-500">{t('principalAmountLabel')}</dt><dd className="font-medium">Rs {consumer.principal.toLocaleString()}</dd></div>
                    <div><dt className="text-gray-500">{t('lpscAmountLabel')}</dt><dd className="font-medium">Rs {consumer.lpsc.toLocaleString()}</dd></div>
                    <div><dt className="text-gray-500">{t('registrationFeesLabel')}</dt><dd className="font-medium">Rs 2,000</dd></div>
                    <div><dt className="text-gray-500">{t('waiverOffLabel')}</dt><dd className="font-medium">Rs {p.discount.toLocaleString()}</dd></div>
                    <div><dt className="text-gray-500">{t('totalPayable')}</dt><dd className="font-medium">Rs {totals[p.key].toLocaleString()}</dd></div>
                  </dl>
                  <div className="mt-3">
                    <label className="text-sm mr-2">{t('inputAmount')}</label>
                    <input
                      type="number"
                      min={2000}
                      value={p.key === selectedPhase ? lumpsumAdvance : 2000}
                      disabled={!p.payEditable || selectedPath !== "LUMPSUM" || selectedPhase !== p.key}
                      onChange={(e) => setLumpsumAdvance(Number(e.target.value))}
                      className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
                      placeholder={t('min2000')}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500">{t('onlyPhase1')}.</p>
              <div className="flex gap-3">
                <button className="w-full px-5 py-3 rounded-2xl border shadow-sm bg-white" onClick={() => setMobileStep(2)}>Back</button>
                <button className="w-full px-5 py-3 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700" onClick={() => setMobileStep(4)}>Next</button>
              </div>
            </section>
          )}

          {mobileStep === 3 && selectedPath === "INSTALLMENT" && (
            <section className="bg-white rounded-2xl shadow p-5 space-y-3">
              <h2 className="text-lg font-semibold">{t('installmentsSelectPlan')}</h2>
              {installmentPlans.map((p) => {
                const total = consumer.principal + consumer.lpsc - p.discount;
                const disabled = !p.enabled;
                return (
                  <div key={p.key} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{lang==='en' ? `With Rs ${p.key} installment` : `₹ ${p.key} किस्त`}</div>
                      <input
                        type="radio"
                        name="installment-w"
                        checked={selectedPath === "INSTALLMENT" && selectedInstallment === p.key}
                        disabled={disabled}
                        onChange={() => { setSelectedPath("INSTALLMENT"); setSelectedInstallment(p.key as any); }}
                      />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div><dt className="text-gray-500">{t('principalAmountLabel')}</dt><dd className="font-medium">Rs {consumer.principal.toLocaleString()}</dd></div>
                      <div><dt className="text-gray-500">{t('lpscAmountLabel')}</dt><dd className="font-medium">Rs {consumer.lpsc.toLocaleString()}</dd></div>
                      <div><dt className="text-gray-500">{t('registrationFeesLabel')}</dt><dd className="font-medium">Rs 2,000</dd></div>
                      <div><dt className="text-gray-500">{t('waiverOffLabel')}</dt><dd className="font-medium">Rs {p.discount.toLocaleString()}</dd></div>
                      <div><dt className="text-gray-500">{t('totalPayable')}</dt><dd className="font-medium">Rs {total.toLocaleString()}</dd></div>
                      <div><dt className="text-gray-500">{t('installmentsLabel')}</dt><dd className="font-medium">{p.installments}</dd></div>
                    </dl>
                  </div>
                );
              })}
              <div className="flex gap-3">
                <button className="w-full px-5 py-3 rounded-2xl border shadow-sm bg-white" onClick={() => setMobileStep(2)}>Back</button>
                <button className="w-full px-5 py-3 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700" onClick={() => setMobileStep(4)}>Next</button>
              </div>
            </section>
          )}

          {mobileStep === 4 && (
            <section className="bg-white rounded-2xl shadow p-5 space-y-3">
              <h2 className="text-lg font-semibold">{t('verifyMobile')}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm">{t('confirmMobile')}</label>
                <input
                  className="rounded-lg border px-3 py-2"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile"
                  inputMode="numeric"
                  maxLength={10}
                />
                <button
                  type="button"
                  className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    if (mobile.trim().length < 10) { alert("Enter a valid 10-digit mobile number"); return; }
                    setOtpSent(true);
                    alert("OTP sent");
                  }}
                >
                  {t('sendOtp')}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm">{t('enterOtp')}</label>
                <input
                  className="rounded-lg border px-3 py-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                />
                <button
                  type="button"
                  className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                  disabled={!otpSent}
                  onClick={() => {
                    if (otp.trim().length < 4) { alert(t('enterOtp')); return; }
                    setOtpVerified(true);
                    alert("OTP verified");
                  }}
                >{t('verify')}</button>
                {otpVerified && <span className="text-sm text-green-600">{t('verified')}</span>}
              </div>
              {!otpVerified && <p className="text-xs text-gray-500">{t('noteVerify')}</p>}

              <div className="flex gap-3">
                <button className="w-full px-5 py-3 rounded-2xl border shadow-sm bg-white" onClick={() => setMobileStep(3)}>Back</button>
                <button
                  disabled={!canPay}
                  className="w-full px-5 py-3 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
                  onClick={() => alert("Proceeding to payment gateway (prototype)")}
                >
                  {t('proceedAndPay')}
                </button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl border bg-gray-50">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}
function TogglePath({ checked, onClick }: { name: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border ${
        checked ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {checked ? "Selected" : "Select"}
    </button>
  );
}


