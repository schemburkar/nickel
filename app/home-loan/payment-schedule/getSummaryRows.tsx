import { Schedule } from "./Schedule";

export function getSummaryRows(schedules: Schedule[]) {
  const totals = {
    emi: { payments: 0, interest: 0, tenure: 0 },
    prepayment: { payments: 0, interest: 0, tenure: 0 },
    od: { payments: 0, interest: 0, tenure: 0 },
  };

  let cumulativeODeposit = 0;
  for (const item of schedules) {

    // EMI
    if (item.original) {

      totals.emi.tenure++;
      totals.emi.payments += (item.original?.payment || 0);
      totals.emi.interest += (item.original?.interest || 0);
    }

    // Prepayment
    if (item.prepayment) {
      totals.prepayment.tenure++;
      totals.prepayment.payments += item.prepayment.payment;
      totals.prepayment.interest += item.prepayment.interest;
    }

    // OD
    if (item.od && !item.od.isInterestFree) {
      totals.od.tenure++;
      totals.od.payments += item.od.payment;
      totals.od.interest += item.od.interest;
      cumulativeODeposit = item.od.cumulativeODeposit;
    }
  }

  totals.od.payments += Math.max(0, cumulativeODeposit);
  return [
    {
      variation: "EMI Only",
      totalPayments: totals.emi.payments,
      totalInterest: totals.emi.interest,
      tenureMonths: totals.emi.tenure,
      interestSaved: 0,
      tenureSaved: 0,
      cheaperThanEMI: "-",
    },
    {
      variation: "With Prepayment",
      totalPayments: totals.prepayment.payments,
      totalInterest: totals.prepayment.interest,
      tenureMonths: totals.prepayment.tenure,
      interestSaved: totals.emi.interest - totals.prepayment.interest,
      tenureSaved: totals.emi.tenure - totals.prepayment.tenure,
      cheaperThanEMI: totals.prepayment.payments < totals.emi.payments ? "Yes" : "No",
    },
    {
      variation: "With OD",
      totalPayments: totals.od.payments,
      totalInterest: totals.od.interest,
      tenureMonths: totals.od.tenure,
      interestSaved: totals.emi.interest - totals.od.interest,
      interestSavedWithPrepayment: totals.prepayment.interest - totals.od.interest,
      totalPaymentsWithPrepayment: totals.prepayment.payments - totals.od.payments,

      tenureSaved: totals.emi.tenure - totals.od.tenure,
      cheaperThanEMI: totals.od.payments < totals.emi.payments ? "Yes" : "No",
      cheaperThanPrepayment: totals.od.payments < totals.prepayment.payments ? "Yes" : "No",
    },
  ];
}
