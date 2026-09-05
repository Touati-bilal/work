import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { AppData, Product } from "@/lib/types";
import { formatDateTime, formatDuration, formatFileDate } from "@/lib/utils/date";
import { ITEM_TYPE_META, STAGE_META } from "@/lib/constants";
import { personById } from "@/lib/selectors";

const BRAND = [79, 70, 229] as const;
const INK = [15, 23, 42] as const;
const MUTED = [100, 116, 139] as const;

function handleOf(data: AppData, id: string | null | undefined): string {
  const p = personById(data, id);
  return p ? p.handle : "—";
}

export function generateProductReportPdf(data: AppData, product: Product): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text("PLANIN WORK", margin, 50);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Product Report", margin, 68);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(`${product.sku} — ${product.name}`, margin, 90);

  doc.setDrawColor(...BRAND);
  doc.setLineWidth(2);
  doc.line(margin, 100, pageWidth - margin, 100);

  const sorted = [...product.history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const issues = sorted.filter((h) => h.kind === "ISSUE");
  const corrections = sorted.filter((h) => h.kind === "CORRECTION");
  const notes = sorted.filter((h) => h.kind === "NOTE");

  autoTable(doc, {
    startY: 116,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: BRAND as unknown as [number, number, number] },
    body: [
      ["Item Type", ITEM_TYPE_META[product.itemType].label],
      ["Given By", handleOf(data, product.givenByPersonId)],
      ["Received (Created)", formatDateTime(product.createdAt)],
      ["Design — Responsible", handleOf(data, product.designPersonId)],
      ["Video Editing — Responsible", product.itemType === "PRODUCT" ? handleOf(data, product.videoEditingPersonId) : "—"],
      ["Testing — Responsible", product.itemType === "PRODUCT" ? handleOf(data, product.testingPersonId) : "—"],
      ["Deadline Given", formatDateTime(product.deadline)],
      ["Completed At", formatDateTime(product.completedAt)],
      ["Time Taken", formatDuration(product.createdAt, product.completedAt)],
      ["Final Stage", STAGE_META[product.stage].label],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 140 } },
  });

  let y = lastY(doc) + 20;

  y = section(doc, "Problems Found", y, margin, pageWidth, issues.map((h) => [formatDateTime(h.timestamp), h.label]));
  y = section(doc, "Notes & Comments", y, margin, pageWidth, notes.map((h) => [formatDateTime(h.timestamp), h.label]));
  y = section(doc, "Corrections & Changes", y, margin, pageWidth, corrections.map((h) => [formatDateTime(h.timestamp), h.label]));

  if (product.notes) {
    y = sectionTitle(doc, "Summary Notes", y, pageWidth, margin);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(product.notes, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 14;
  }

  y = sectionTitle(doc, "Complete Workflow Timeline", y, pageWidth, margin);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "striped",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 41, 59] },
    head: [["When", "Event"]],
    body: sorted.map((h) => [formatDateTime(h.timestamp), h.label]),
    columnStyles: { 0: { cellWidth: 110 } },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`PLANIN WORK · ${product.sku}`, margin, doc.internal.pageSize.getHeight() - 20);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 60, doc.internal.pageSize.getHeight() - 20);
  }

  doc.save(`planin-work-${product.sku}-report-${formatFileDate()}.pdf`);
}

function lastY(doc: jsPDF): number {
  const withAutoTable = doc as unknown as { lastAutoTable?: { finalY: number } };
  return withAutoTable.lastAutoTable ? withAutoTable.lastAutoTable.finalY : 130;
}

function sectionTitle(doc: jsPDF, title: string, y: number, pageWidth: number, margin: number): number {
  let nextY = y;
  if (nextY > doc.internal.pageSize.getHeight() - 100) {
    doc.addPage();
    nextY = 50;
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin, nextY);
  void pageWidth;
  return nextY + 10;
}

function section(
  doc: jsPDF,
  title: string,
  y: number,
  margin: number,
  pageWidth: number,
  rows: string[][]
): number {
  const startY = sectionTitle(doc, title, y, pageWidth, margin);
  if (rows.length === 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    doc.text("None recorded.", margin, startY + 4);
    doc.setFont("helvetica", "normal");
    return startY + 22;
  }
  autoTable(doc, {
    startY,
    margin: { left: margin, right: margin },
    theme: "striped",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 41, 59] },
    head: [["When", "Details"]],
    body: rows,
    columnStyles: { 0: { cellWidth: 110 } },
  });
  return lastY(doc) + 18;
}
