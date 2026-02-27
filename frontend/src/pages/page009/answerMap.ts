// answerMap.ts — Maps 15Q display text answers to schema contract snake_case values
// Schema Contract v1.1 — 27 Feb 2026

export function mapAnswersToSnapshot(answers: Record<string, string>) {
  return {
    primaryGoal: ({
      "Keep business trading": "negotiate_debt",
      "Negotiate debt reduction": "negotiate_debt",
      "Wind down responsibly": "wind_down",
      "Avoid bankruptcy": "negotiate_debt",
    } as Record<string, string>)[answers.q14] || "negotiate_debt",

    entityType: ({
      "Individual / Sole Trader": "individual",
      "Company": "company",
      "Trust": "trust",
      "Partnership": "partnership",
    } as Record<string, string>)[answers.q1] || "individual",

    idealOutcome: ({
      "Keep business trading": "payment_plan_plus_remission",
      "Negotiate debt reduction": "remission_only",
      "Wind down responsibly": "remission_only",
      "Avoid bankruptcy": "payment_plan_plus_remission",
    } as Record<string, string>)[answers.q14] || "payment_plan_plus_remission",

    debtBand: ({
      "$15,000 to $250,000": "20k_100k",
      "$250,000 to $500,000": "300k_500k",
      "$500,000 to $1,000,000": "500k_750k",
      "$1,000,000+": "750k_plus",
    } as Record<string, string>)[answers.q2] || "20k_100k",

    debtDuration: ({
      "Less than 6 months": "under_12m",
      "6 to 12 months": "under_12m",
      "1 to 2 years": "1_2y",
      "More than 2 years": "2_5y",
    } as Record<string, string>)[answers.q3] || "under_12m",

    atoLatestAction: ({
      "None": "none",
      "Overdue notice": "general_warning",
      "ATO Garnishee": "firmer_warning",
      "Statutory demand": "dpn",
      "Wind-up notice": "bankruptcy_windup",
      "Bankruptcy notice": "bankruptcy_windup",
    } as Record<string, string>)[answers.q4] || "none",

    basStatus: ({
      "All current": "up_to_date",
      "Mostly current": "partially_lodged",
      "Partially lodged": "partially_lodged",
      "Not current": "never_lodged",
    } as Record<string, string>)[answers.q5] || "unsure",

    superOutstanding: "unsure",

    incomeTaxStatus: ({
      "Lodgements up to date": "up_to_date",
      "Minor arrears": "partially_lodged",
      "Major arrears": "partially_lodged",
      "Never lodged": "never_lodged",
    } as Record<string, string>)[answers.q6] || "unsure",

    priorPaymentPlan: ({
      "No payment plan": "never",
      "Successful": "current_plan",
      "Defaulted": "defaulted",
      "Attempted - rejected": "rejected",
    } as Record<string, string>)[answers.q7] || "never",

    isDirector: ({
      "Yes I am": "yes",
      "No I'm not": "no",
      "Recently resigned": "no",
    } as Record<string, string>)[answers.q8] || "no",

    canContribute: ({
      "Under $500": "maybe",
      "$500 to $1,500": "yes",
      "$1,500 to $3,000": "yes",
      "Over $3,000": "yes",
    } as Record<string, string>)[answers.q11] || "maybe",

    paymentTimeframe: ({
      "Less than a year": "up_to_1y",
      "1 to 2 years": "1_2y",
      "2 to 3 years": "2_3y",
      "Over 3 years": "2_3y",
    } as Record<string, string>)[answers.q12] || "1_2y",

    incomeTrend: ({
      "Growing": "growing",
      "Stable": "stable",
      "Declining": "declining",
      "No income": "declining",
    } as Record<string, string>)[answers.q13] || "stable",

    urgencyLevel: ({
      "Planning ahead": "not_urgent",
      "Moderate urgency": "moderate",
      "Very urgent": "very_urgent",
      "ATO Action": "very_urgent",
    } as Record<string, string>)[answers.q15] || "moderate",
  }
}
