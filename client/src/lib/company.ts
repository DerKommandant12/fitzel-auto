/**
 * Date firmă — actualizează cu valorile de pe certificat / ANAF.
 * Folosit în Footer; păstrează legal.html sincronizat manual.
 */
export const COMPANY_INFO = {
  brandName: "Automobile Fitzel Pot",
  /** Denumire legală completă */
  legalName: "DAMPF PROD SRL",
  /** CUI / CIF */
  cui: "4113967",
  /** Nr. Registrul Comerțului */
  tradeRegister: "J1993001078338",
  address: "727573 Spătărești, România",
  email: "ovi_beredecasa@yahoo.com",
  phone: "0743691717",
  phoneDisplay: "0743 691 717",
} as const;

export function companyLegalLines(): { label: string; value: string }[] {
  return [
    { label: "Nume Firmă", value: COMPANY_INFO.legalName },
    { label: "CUI", value: COMPANY_INFO.cui },
    { label: "Nr. Reg. Com", value: COMPANY_INFO.tradeRegister },
    { label: "Adresă", value: COMPANY_INFO.address },
  ];
}
