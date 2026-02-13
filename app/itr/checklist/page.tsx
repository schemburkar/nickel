'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type IncomeSection =
  {
    title: string;
    items: { id: string; name: string; description: string }[];
  }
  | {
    title: string;
    categories: {
      category: string;
      items: { id: string; name: string; description: string }[];
    }[];
  };

export default function ITRChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [checkedNAItems, setCheckedNAItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNACheck = (id: string) => {
    setCheckedNAItems(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const incomeSections: IncomeSection[] = [
    {
      title: 'Salary Income',
      items: [
        { id: 'form16', name: 'Form 16 (Part A & B)', description: 'TDS certificate from employer' },
        { id: 'salarySlips', name: 'Salary Slips (All months)', description: 'To verify allowances, perks, exemptions' },
        { id: 'form12bb', name: 'Form 12BB', description: 'Declaration submitted to employer for deductions' },
        { id: 'hraReceipts', name: 'Rent Receipts & Landlord PAN', description: 'If claiming HRA exemption' },
      ],
    },
    {
      title: 'House Property Income',
      items: [
        { id: 'rentalAgreement', name: 'Rental Agreement', description: 'Registered or notarized rent agreement' },
        { id: 'rentReceipts', name: 'Rent Receipts (Monthly/Annual)', description: 'Signed receipts from tenant' },
        { id: 'homeLoanCert', name: 'Home Loan Interest Certificate', description: 'From bank for self-occupied or let-out property' },
        { id: 'coownerDetails', name: 'Co-ownership Details', description: 'If property is co-owned' },
        { id: 'municipalTax', name: 'Municipal Tax Paid Receipt', description: 'For 30% standard deduction claim' },
      ],
    },
    {
      title: 'Capital Gains',
      categories: [
        // Equity Shares & ETFs (Demat)
        {
          category: 'Equity Shares, ETFs & Bonds (Demat)',
          items: [
            { id: 'cgCdsl', name: 'CDSL Capital Gains Statement', description: 'For equity shares, ETFs, bonds in demat' },
            { id: 'cgNsdl', name: 'NSDL Capital Gains Statement', description: 'For shares held with other depository' },
          ]
        },

        // Mutual Funds
        {
          category: 'Mutual Funds',
          items: [
            { id: 'cgCams', name: 'CAMS Capital Gains Statement', description: 'Mutual funds serviced by CAMS' },
            { id: 'cgKfin', name: 'KFintech Capital Gains Statement', description: 'Mutual funds serviced by KFintech' },
          ]
        },

        // Unlisted Shares & Other Securities
        {
          category: 'Unlisted Shares & Pre-IPO',
          items: [
            { id: 'cgRta', name: 'Other RTA / Broker Statements', description: 'For unlisted shares, pre-IPO, ESOPs, etc.' },
          ]
        },

        // Immovable Property
        {
          category: 'Immovable Property',
          items: [
            { id: 'propertySale', name: 'Property Sale Deed & Cost Records', description: 'Sale agreement, old purchase deed, improvement costs, indexation proof' },
            { id: '54Exemption', name: 'Section 54 / 54F Exemption Documents', description: 'New house purchase/construction proof if claiming exemption' },
          ]
        },

        // Capital Gains Bonds (54EC)
        {
          category: '54EC Capital Gains Bonds',
          items: [
            { id: 'cgBonds', name: 'Capital Gains Bonds (54EC)', description: 'NHAI, REC, PFC, IRFC bonds allotment proof & investment certificate' },
          ]
        },
      ],
    },
    {
      title: 'Income from Other Sources',
      items: [
        { id: 'bankInterest', name: 'Interest Certificates (Savings/FD/RD)', description: 'Form 16A if TDS deducted' },
        { id: 'dividend', name: 'Dividend Warrants / Statements', description: 'From Indian companies & mutual funds' },
        { id: 'lottery', name: 'Lottery / Game Show Winnings', description: 'With TDS certificate if applicable' },
        { id: 'gift', name: 'Taxable Gifts Received', description: 'Above ₹50,000 from non-relatives' },
        { id: 'freelance', name: 'Freelance / Professional Receipts', description: 'Invoices + Form 16A if TDS deducted' },
        { id: 'familyPension', name: 'Family Pension', description: 'Bank statement or pension order' },
      ],
    },
  ];

  const deductionSections = [
    {
      title: 'Chapter VI-A Deductions',
      items: [
        { id: '80c', name: 'Section 80C (Max ₹1.5 lakh)', description: 'LIC, PPF, ELSS, NSC, Tuition, Home loan principal, etc.' },
        { id: '80ccd1b', name: '80CCD(1B) - NPS Additional', description: 'Up to ₹50,000 extra in NPS' },
        { id: '80d', name: 'Section 80D - Health Insurance', description: 'Self, family, parents (senior citizen benefit)' },
        { id: '80e', name: 'Section 80E - Education Loan Interest', description: 'No limit, for 8 years' },
        { id: '80g', name: 'Section 80G - Donations', description: 'With 50%/100% deduction receipts' },
        { id: '80tta', name: 'Section 80TTA / 80TTB', description: 'Savings interest (₹10K / ₹50K for seniors)' },
      ],
    },
  ];

  const taxPaidSection = {
    title: 'Taxes Paid & Verification',
    items: [
      { id: '26as', name: 'Form 26AS', description: 'Must match with all TDS/TCS' },
      { id: 'ais', name: 'Annual Information Statement (AIS)', description: 'Check for high-value transactions, interest, dividends' },
      { id: 'tcs', name: 'TCS Statements', description: 'LRS, car purchase, foreign tour, etc.' },
      { id: 'advanceTax', name: 'Advance Tax Challans', description: 'All 4 installments if applicable' },
      { id: 'selfAssess', name: 'Self-Assessment Tax Paid', description: 'Challan before filing ITR' },
    ],
  };

  return (
    <div className="flex flex-col items-center  print:items-start ">


      <section className="m-4 w-4/5 print:hidden">
        <a className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
          href="/itr/checklist">
          <div className="mb-2 mt-4 text-lg font-medium">
            Income Tax - Returns Filing Checklist (FY 2025 - 2026 &amp; FY 2026 - 2027)
          </div>
          <p className="text-sm leading-tight text-muted-foreground">
            Mark documents as you collect them
          </p>
          <p className="text-sm leading-7 text-muted-foreground ">
            Disclaimer: The documents shown below are a general guidance and for personal use only. Please consult your tax advisor for entire applicable list and calculations.
          </p>
        </a>
      </section>

      <section className="m-4 w-4/5 print:m-1 print:w-full [&_input]:invalid:text-red-400  [&_input]:invalid:border-red-500 [&_input]:print:hidden">

        {/* Income Sources */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-primary">Income Sources</h2>
          {incomeSections.map((section) => (
            <Card key={section.title} className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {"items" in section ? (
                  // Old flat structure (for Salary, House Property, etc.)
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Document</TableHead>
                        <TableHead className="w-[50%]">Purpose / Notes</TableHead>
                        <TableHead className="w-[10%] text-center">Done</TableHead>
                        <TableHead className="w-[10%] text-center">N/A</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox disabled={!!checkedNAItems[item.id]}
                              checked={!!checkedItems[item.id]}
                              onCheckedChange={() => toggleCheck(item.id)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox disabled={!!checkedItems[item.id]}
                              checked={!!checkedNAItems[item.id]}
                              onCheckedChange={() => toggleNACheck(item.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  // New grouped structure (for Capital Gains)
                  section.categories.map((category) => (
                    <div key={category.category} className="space-y-3">
                      <h4 className="font-semibold text-md text-primary">
                        {category.category}
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">Document</TableHead>
                            <TableHead className="w-[50%]">Purpose / Notes</TableHead>
                            <TableHead className="w-[10%] text-center">Done</TableHead>
                            <TableHead className="w-[10%] text-center">N/A</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {item.description}
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox disabled={!!checkedNAItems[item.id]}
                                  checked={!!checkedItems[item.id]}
                                  onCheckedChange={() => toggleCheck(item.id)}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox disabled={!!checkedItems[item.id]}
                                  checked={!!checkedNAItems[item.id]}
                                  onCheckedChange={() => toggleNACheck(item.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deductions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-primary">Deductions & Exemptions</h2>
          {deductionSections.map((section) => (
            <Card key={section.title} className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deduction</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-center">Collected</TableHead>
                      <TableHead className="text-center">N/A</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox disabled={!!checkedNAItems[item.id]}
                            checked={!!checkedItems[item.id]}
                            onCheckedChange={() => toggleCheck(item.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox disabled={!!checkedItems[item.id]}
                            checked={!!checkedNAItems[item.id]}
                            onCheckedChange={() => toggleNACheck(item.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Taxes Paid */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-primary">Taxes Already Paid</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{taxPaidSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Verified</TableHead>
                    <TableHead className="text-center">N/A</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxPaidSection.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox disabled={!!checkedNAItems[item.id]}
                          checked={!!checkedItems[item.id]}
                          onCheckedChange={() => toggleCheck(item.id)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox disabled={!!checkedItems[item.id]}
                          checked={!!checkedNAItems[item.id]}
                          onCheckedChange={() => toggleNACheck(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          All checks complete? You're ready to file your ITR!
        </div>
      </section>
    </div>
  );
}
