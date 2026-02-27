// answerMap.ts — Blueprint v7.1 (27 Feb 2026)
// 12Q Diagnostic — maps voice answers to Firestore readinessSnapshot
// 3 fields (atoLatestAction, debtBand, idealOutcome) come from 4Q draft case, not voice

export function mapAnswersToSnapshot(answers: Record<string, string>) {
  return {
    primaryGoal: ({"Negotiate ATO Debt / Avoid insolvency":"negotiate_debt","Wind down responsibly":"wind_down"} as Record<string,string>)[answers.q1] || "negotiate_debt",
    entityType: ({"Individual":"individual","Sole Trader":"sole_trader","Partnership":"partnership","Company":"company","Trust":"trust"} as Record<string,string>)[answers.q2] || "individual",
    debtDuration: ({"Less than 12 months":"under_12m","1 – 2 years":"1_2y","2 – 5 years":"2_5y","5+ years":"5y_plus"} as Record<string,string>)[answers.q3] || "under_12m",
    basStatus: ({"Unsure":"unsure","Partially lodged":"partially_lodged","Lodged and up to date":"up_to_date","Never lodged":"never_lodged"} as Record<string,string>)[answers.q4] || "unsure",
    superOutstanding: ({"Yes":"yes","No":"no","Unsure":"unsure"} as Record<string,string>)[answers.q5] || "unsure",
    incomeTaxStatus: ({"Unsure":"unsure","Partially lodged":"partially_lodged","Lodged and up to date":"up_to_date","Never lodged":"never_lodged"} as Record<string,string>)[answers.q6] || "unsure",
    priorPaymentPlan: ({"Never":"never","In current payment plan":"current_plan","Yes but defaulted":"defaulted","Attempted but rejected":"rejected"} as Record<string,string>)[answers.q7] || "never",
    isDirector: ({"Yes, I am":"yes","No, I'm not":"no"} as Record<string,string>)[answers.q8] || "no",
    canContribute: ({"Yes, I can":"yes","No, I can't":"no","Potentially / Maybe":"maybe"} as Record<string,string>)[answers.q9] || "maybe",
    paymentTimeframe: ({"Up to 1 year":"up_to_1y","1 – 2 years":"1_2y","2 – 3 years":"2_3y"} as Record<string,string>)[answers.q10] || "1_2y",
    incomeTrend: ({"Growing":"growing","Stable":"stable","Declining":"declining"} as Record<string,string>)[answers.q11] || "stable",
    urgencyLevel: ({"Not yet urgent / planning ahead":"not_urgent","Moderate urgency":"moderate","Very urgent":"very_urgent"} as Record<string,string>)[answers.q12] || "moderate",
  }
}
