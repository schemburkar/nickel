import { Schedule } from "./Schedule";

export const getMapValue = (map: Map<number, number>, index: number, defaultValue: number): number => {
  if (map.has(index)) return map.get(index)!;
  const lastIndex = [...map.keys()].sort((a, b) => a - b).findLast(i => i < index);
  if (lastIndex) return map.get(lastIndex)!;

  return defaultValue;

}
export function calculateAmortization(
  loanAmount: number,
  tenure: number,
  interestRate: number,
  interestRateOD: number,
  inputsPrepayment: Map<number, number>,
  inputsOD: Map<number, number>,
  inputsAdditionalEMI: Map<number, number>,
  inputsInterestRate: Map<number, number>,
  inputsInterestRateOD: Map<number, number>,
): Schedule[] {

  const monthlyRateFn = (r: number) => r / 12 / 100;
  const emiFn = (mr: number) => (loanAmount * mr * Math.pow(1 + mr, tenure)) /
    (Math.pow(1 + mr, tenure) - 1);



  const emi = emiFn(monthlyRateFn(interestRate));
  const emiOD = emiFn(monthlyRateFn(interestRateOD));

  let balanceOriginal = loanAmount;
  let balancePrepay = loanAmount;
  let balanceOD = loanAmount;
  let cumulativeOD = 0;
  let cumulativePrepay = 0;
  let cumulativeODeposit = 0;

  const schedule = [];

  for (let i = 1; i <= tenure && (balanceOriginal > 0 || balancePrepay > 0 || balanceOD > 0); i++) {
    const [includeOriginal, includePrepay, IncludeOd] = [i <= tenure && balanceOriginal > 0, i <= tenure && balancePrepay > 0, balanceOD > 0]
    let prepay = inputsPrepayment.get(i - 1) || 0;
    const odDeposit = inputsOD.get(i - 1) || 0;
    const moreEMI = getMapValue(inputsAdditionalEMI, i - 1, 0);

    const monthlyRate = monthlyRateFn(getMapValue(inputsInterestRate, i - 1, interestRate));
    const monthlyRateOD = monthlyRateFn(getMapValue(inputsInterestRateOD, i - 1, interestRateOD)); //ratesOD.get(i - 1) || monthlyRateFn(annualRateOD);

    // Original
    const openingBalanceOriginal = balanceOriginal;

    const interestOriginal = balanceOriginal * monthlyRate;
    let principalOriginal = emi - interestOriginal;
    let actualEMIOriginal = emi;


    if (principalOriginal > balanceOriginal) {
      principalOriginal = balanceOriginal;
      actualEMIOriginal = interestOriginal + principalOriginal;
    }




    balanceOriginal -= principalOriginal;
    balanceOriginal = Math.max(balanceOriginal, 0);

    // Prepay
    const openingBalancePrepay = balancePrepay;
    const effectiveBalancePrepay = Math.max(balancePrepay - prepay, 0);
    const interestPrepay = effectiveBalancePrepay * monthlyRate;
    let principalPrepay = emi + moreEMI - interestPrepay;

    let flag = false;
    let actualEMIPrepay = emi + moreEMI;
    if (prepay + principalPrepay > balancePrepay) {

      const totalPrincipal = balancePrepay;
      principalPrepay = balancePrepay;
      principalPrepay = Math.min(emi + moreEMI - interestPrepay, totalPrincipal); // cap to what EMI can carry
      prepay = totalPrincipal - principalPrepay; // rest goes to prepay
      actualEMIPrepay = interestPrepay + principalPrepay;
      flag = true;
    }
    cumulativePrepay += prepay;



    // let actualEMIPrepay = emi;
    // if(principalPrepay > balancePrepay){
    //   principalPrepay = balancePrepay;
    //   actualEMIOD = interestOD + principalOD;
    // }
    balancePrepay -= (principalPrepay + prepay);
    balancePrepay = Math.max(balancePrepay, 0);

    // OD
    const openingBalanceOD = balanceOD;

    cumulativeOD += odDeposit;
    cumulativeODeposit += odDeposit;

    if (cumulativeOD < 0) {

      balanceOD -= cumulativeOD;
      cumulativeOD = 0;
    }

    const effectiveBalanceOD = Math.max(balanceOD - cumulativeOD, 0);
    const interestOD = effectiveBalanceOD * monthlyRateOD;
    const scheduledPrincipal = emiOD + moreEMI - (balanceOD * monthlyRateOD);
    let principalOD = Math.min(scheduledPrincipal, balanceOD);
    const excessOD = emiOD + moreEMI - interestOD - principalOD;
    // cumulativeOD += excessOD;

    if (principalOD < balanceOD) {
      cumulativeOD += excessOD;
    }

    // const actualEMIOD = interestOD + principalOD;
    let actualEMIOD = emiOD + moreEMI;
    if (principalOD >= balanceOD) {
      principalOD = balanceOD;
      actualEMIOD = interestOD + principalOD;
    }




    balanceOD -= principalOD;
    balanceOD = Math.max(balanceOD, 0);








    schedule.push({
      original: includeOriginal ? {
        month: i,
        emi: actualEMIOriginal,
        interest: interestOriginal,
        principal: principalOriginal,
        payment: actualEMIOriginal,
        cumulative: loanAmount - balanceOriginal,
        balance: balanceOriginal,
        effectiveBalance: balanceOriginal,
        openingBalance: openingBalanceOriginal
      } : null,
      prepayment: includePrepay ? {
        month: i,
        emi: actualEMIPrepay,
        interest: interestPrepay,
        principal: principalPrepay,
        payment: actualEMIPrepay + prepay,
        cumulative: cumulativePrepay,
        balance: balancePrepay,
        effectiveBalance: effectiveBalancePrepay,
        actualPrePay: flag ? prepay : null,
        openingBalance:openingBalancePrepay
      } : null,
      od: IncludeOd ? {
        month: i,
        emi: actualEMIOD,
        interest: interestOD,
        principal: principalOD,
        payment: actualEMIOD,
        cumulative: cumulativeOD,
        balance: balanceOD,
        effectiveBalance: effectiveBalanceOD,
        effectiveBalanceEnd: Math.max(0, balanceOD - cumulativeOD),
        isInterestFree: cumulativeOD >= balanceOD && interestOD <= 0,
        cumulativeODeposit,
        openingBalance:openingBalanceOD
      } : null,
    });
  }

  return schedule;
}
