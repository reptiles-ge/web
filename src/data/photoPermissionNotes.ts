import type { AppLocale } from "@/i18n/routing";

export type PhotoPermissionNoteSet = {
  feePolicy: string;
  responseTime: string;
};

export const PHOTO_PERMISSION_NOTES: Record<AppLocale, PhotoPermissionNoteSet> =
  {
    en: { feePolicy: "", responseTime: "" },
    ka: { feePolicy: "", responseTime: "" },
    ru: { feePolicy: "", responseTime: "" },
    tr: { feePolicy: "", responseTime: "" },
  };
