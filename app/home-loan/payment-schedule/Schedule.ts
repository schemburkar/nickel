export type Schedule = {
  original: ScheduleItem| null
  prepayment: (ScheduleItem & {
    actualPrePay: number | null;
  }) | null;
  od: (ScheduleItem & {
    effectiveBalanceEnd: number;
    isInterestFree: boolean;
    cumulativeODeposit: number;
  }) | null;
};
export type ScheduleItem = {

  month: number;
  emi: number;

  openingBalance: number
  interest: number;
  principal: number;
  payment: number;
  cumulative: number;
  balance: number;
  effectiveBalance: number;
};
