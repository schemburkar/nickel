import { CashFlow, CashFlowFractionOfYear } from "./CashFlow";
import { IncosistentCashFlowException, InvalidCalculationException } from "./IncosistentCashFlowException";

export const xirr = (cashflows: CashFlow[], decimals: number = 4, maxRate: number = 1000000) => {
    if (cashflows.filter(x => x.Amount > 0).length <= 0)
        throw new IncosistentCashFlowException();


    if (cashflows.filter(x => x.Amount < 0).length <= 0)
        throw new IncosistentCashFlowException();



    const precision = Math.pow(10, -decimals);
    const minRate = -(1 - precision);
    return (XIRRCalculator(minRate, maxRate, cashflows).Calculate(precision, decimals));

};

const XIRRCalculator = (lowRate: number, highRate: number, cashFlow: CashFlow[]) => {



    const CalcEquation = (cashflows: CashFlowFractionOfYear[], interestRate: number): number => {
        return cashflows.map(x => (x.Amount / (Math.pow((1 + interestRate), x.Years)))).reduce((acc, curr) => acc + curr, 0);
    }

    const ToFractionOfYears = (cashflows: CashFlow[]): CashFlowFractionOfYear[] => {

        //get min date
        let firstDate: Date = cashflows[0].Date;
        for (let index = 0; index < cashflows.length; index++) {
            const element = cashflows[index];
            if (element.Date < firstDate)
                firstDate = element.Date
        }


        const result = cashflows
            .map(x => ({
                Amount: x.Amount,
                Years: (x.Date.getTime() - firstDate?.getTime()) / (1000 * 60 * 60 * 24 * 365)
            }));

        console.log(result);
        return result;
    }

    let LowRate = lowRate;
    let HighRate = highRate;

    const fractionYearsCashFlow = ToFractionOfYears(cashFlow);
    const CashFlow = fractionYearsCashFlow;
    let LowResult = CalcEquation(fractionYearsCashFlow, LowRate);
    let HighResult = CalcEquation(fractionYearsCashFlow, HighRate);


    const Calculate = (precision: number, decimals: number): number => {
        if (Math.sign(LowResult) == Math.sign(HighResult)) {
            throw new InvalidCalculationException("Value cannot be calculated");
        }

        const middleRate = (LowRate + HighRate) / 2;
        const middleResult = CalcEquation(CashFlow, middleRate);
        if (Math.sign(middleResult) == Math.sign(LowResult)) {
            LowRate = middleRate;
            LowResult = middleResult;
        }
        else {
            HighRate = middleRate;
            HighResult = middleResult;
        }
        if (Math.abs(middleResult) > precision) {
            return Calculate(precision, decimals);
        }
        else {

            const factor = Math.pow(10, decimals);
            const result = Math.round((HighRate + LowRate) / 2 * factor) / factor;
            return result;
        }
    };

    const TryCalculate = (precision: number, decimals: number) => {
        try {
            return Calculate(precision, decimals);
        } catch {
            return NaN;
        }
    }
    return {
        Calculate: TryCalculate
    }
}