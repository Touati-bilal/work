import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { AppData } from "@/lib/types";
import type { WeeklyReportData } from "./weeklyReport";
import { formatDate, formatDateTime, formatFileDate, formatWeekLabel } from "@/lib/utils/date";
import { ITEM_TYPE_META, STAGE_META, STAGE_ORDER, STATUS_META } from "@/lib/constants";
import { currentAssignee, personById } from "@/lib/selectors";

const BRAND = [79, 70, 229] as const; // indigo-600
const INK = [15, 23, 42] as const;
const MUTED = [100, 116, 139] as const;

function handleOf(data: AppData, id: string | null | undefined): string {
  const p = personById(data, id);
  return p ? p.handle : "Unassigned";
}

export function generateWeeklyReportPdf(data: AppData, report: WeeklyReportData): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFontSize(18);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.text("PLANIN WORK", margin, 50);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Weekly Work Report", margin, 68);

  doc.setFontSize(10);
  doc.text(`Period: ${formatWeekLabel(report.week)}`, margin, 86);
  doc.text(`Generated: ${formatDateTime(report.generatedAt)}`, margin, 100);

  doc.setDrawColor(...BRAND);
  doc.setLineWidth(2);
  doc.line(margin, 112, pageWidth - margin, 112);

  let y = 130;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Created", "Completed", "Currently Pending", "Currently Overdue"]],
    body: [[
      String(report.createdThisWeek.length),
      String(report.completedThisWeek.length),
      String(report.pendingNow.length),
      String(report.pendingNow.filter((p) => p.deadline && new Date(p.deadline) < new Date()).length),
    ]],
    theme: "grid",
    headStyles: { fillColor: BRAND as unknown as [number, number, number] },
    styles: { fontSize: 9, halign: "center" },
  });
  y = lastY(doc);

  autoTable(doc, {
    startY: y + 16,
    margin: { left: margin, right: margin },
    head: [["Design", "Video Editing", "Testing", "Finished"]],
    body: [[
      String(report.stageCountsNow.DESIGN),
      String(report.stageCountsNow.VIDEO_EDITING),
      String(report.stageCountsNow.TESTING),
      String(report.stageCountsNow.FINISHED),
    ]],
    theme: "grid",
    headStyles: { fillColor: INK as unknown as [number, number, number] },
    styles: { fontSize: 9, halign: "center" },
  });
  y = lastY(doc);

  for (const stage of STAGE_ORDER) {
    const entries = report.stageActivity[stage];
    y = sectionTitle(doc, `${STAGE_META[stage].label} Activity`, y, pageWidth, margin);
    if (entries.length === 0) {
      y = noActivity(doc, y, margin);
      continue;
    }
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["SKU", "Product", "Type", "Owner", "Stage", "Deadline", "Notes"]],
      body: entries.map(({ product }) => [
        product.sku,
        product.name,
        ITEM_TYPE_META[product.itemType].label,
        currentAssignee(data, product)?.handle ?? "Unassigned",
        STAGE_META[product.stage].label,
        formatDate(product.deadline),
        product.notes ?? "",
      ]),
      theme: "striped",
      styles: { fontSize: 8, cellWidth: "wrap" },
      headStyles: { fillColor: [30, 41, 59] },
      columnStyles: { 1: { cellWidth: 90 }, 6: { cellWidth: 110 } },
    });
    y = lastY(doc);
  }

  y = sectionTitle(doc, "Product Research Activity", y, pageWidth, margin);
  if (report.researchActivity.length === 0) {
    y = noActivity(doc, y, margin);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Product", "Category", "Found By", "Status", "Priority", "Source", "Notes"]],
      body: report.researchActivity.map((r) => [
        r.name,
        r.category,
        handleOf(data, r.foundByPersonId),
        r.status.replace(/_/g, " "),
        r.priority,
        r.source ?? "",
        r.notes ?? "",
      ]),
      theme: "striped",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
    });
    y = lastY(doc);
  }

  y = sectionTitle(doc, "Landing Page Activity", y, pageWidth, margin);
  if (report.landingActivity.length === 0) {
    y = noActivity(doc, y, margin);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Product", "SKU", "Assigned", "Status", "Priority", "Deadline", "Notes"]],
      body: report.landingActivity.map((l) => [
        l.productName,
        l.sku ?? "",
        handleOf(data, l.assignedPersonId),
        STATUS_META[l.status].label,
        l.priority,
        formatDate(l.deadline),
        l.notes ?? "",
      ]),
      theme: "striped",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
    });
    y = lastY(doc);
  }

  y = sectionTitle(doc, "Completed This Week", y, pageWidth, margin);
  if (report.completedThisWeek.length === 0) {
    y = noActivity(doc, y, margin);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["SKU", "Product", "Type", "Testing Owner", "Completed At", "Notes"]],
      body: report.completedThisWeek.map((p) => [
        p.sku,
        p.name,
        ITEM_TYPE_META[p.itemType].label,
        handleOf(data, p.testingPersonId ?? p.designPersonId),
        formatDateTime(p.completedAt),
        p.notes ?? "",
      ]),
      theme: "striped",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 122, 87] },
    });
    y = lastY(doc);
  }

  y = sectionTitle(doc, "People Activity", y, pageWidth, margin);
  const peopleRows = Object.entries(report.peopleActivityCount).map(([id, count]) => [handleOf(data, id), String(count)]);
  if (peopleRows.length === 0) {
    y = noActivity(doc, y, margin);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Person", "Items touched this week"]],
      body: peopleRows,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: BRAND as unknown as [number, number, number] },
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`PLANIN WORK · ${formatWeekLabel(report.week)}`, margin, doc.internal.pageSize.getHeight() - 20);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 60, doc.internal.pageSize.getHeight() - 20);
  }

  const filename = `planin-work-report-${formatFileDate(report.week.start)}.pdf`;
  doc.save(filename);
}

function lastY(doc: jsPDF): number {
  const withAutoTable = doc as unknown as { lastAutoTable?: { finalY: number } };
  return withAutoTable.lastAutoTable ? withAutoTable.lastAutoTable.finalY : 130;
}

function sectionTitle(doc: jsPDF, title: string, y: number, pageWidth: number, margin: number): number {
  let nextY = y + 24;
  if (nextY > doc.internal.pageSize.getHeight() - 80) {
    doc.addPage();
    nextY = 50;
  }
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(title, margin, nextY);
  void pageWidth;
  return nextY + 10;
}

function noActivity(doc: jsPDF, y: number, margin: number): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...MUTED);
  doc.text("No activity this week.", margin, y + 4);
  doc.setFont("helvetica", "normal");
  return y + 20;
}
