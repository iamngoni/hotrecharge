//
//  zesa-recharge.ts
//  hotrecharge
//
//  Created by Ngonidzashe Mangudya on 1/2/2023.

export default interface ZesaRecharge {
  Amount: number;
  TargetNumber: string;
  meterNumber: string;
  CustomerSMS: string | null;
}
