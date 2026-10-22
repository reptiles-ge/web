import { isLocalAdminEnabled } from "@/lib/adminAccess";

export async function loadSelectionContentEditor() {
  return process.env.NODE_ENV !== "production" && isLocalAdminEnabled()
    ? (await import("@/components/admin/SelectionContentEditor"))
        .SelectionContentEditor
    : null;
}

export async function loadSpeciesPageAnalysis() {
  return process.env.NODE_ENV !== "production" && isLocalAdminEnabled()
    ? (await import("@/components/admin/SpeciesPageAnalysis"))
        .SpeciesPageAnalysis
    : null;
}
