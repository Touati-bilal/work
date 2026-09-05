"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Calendar, User, Clock, FileDown, Timer, UserCog } from "lucide-react";
import { useData } from "@/lib/data/DataProvider";
import { personById } from "@/lib/selectors";
import { StageBadge, ItemTypeBadge } from "@/components/ui/StageBadge";
import { OverdueTag } from "@/components/ui/OverdueTag";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { ProductForm } from "@/components/manager/ProductForm";
import { ProductHistory } from "@/components/product/ProductHistory";
import { PipelineStepper } from "@/components/product/PipelineStepper";
import { AddNoteForm } from "@/components/product/AddNoteForm";
import { formatDate, formatDateTime, formatDuration } from "@/lib/utils/date";
import { generateProductReportPdf } from "@/lib/report/productPdf";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data } = useData();
  const [editing, setEditing] = useState(false);

  const product = data.products.find((p) => p.id === id);
  if (!product) return notFound();

  const givenBy = personById(data, product.givenByPersonId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/manager" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="font-mono text-xs font-semibold text-text-muted">{product.sku}</p>
            <h1 className="text-lg font-bold text-text-primary tracking-tight leading-tight">{product.name}</h1>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-2 shrink-0"
        >
          <Pencil size={14} /> Edit
        </button>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={product.stage} />
          <ItemTypeBadge itemType={product.itemType} />
          <OverdueTag deadline={product.deadline} completedAt={product.completedAt} />
        </div>

        <dl className="grid grid-cols-2 gap-4 pt-1">
          <Info icon={UserCog} label="Given By" value={givenBy ? givenBy.handle : "—"} />
          <Info icon={Calendar} label="Received" value={formatDate(product.createdAt)} />
          <Info icon={Clock} label="Deadline" value={formatDate(product.deadline)} />
          <Info icon={Calendar} label="Completed" value={formatDateTime(product.completedAt)} />
          <Info icon={Timer} label="Time Taken" value={formatDuration(product.createdAt, product.completedAt)} />
        </dl>

        {product.notes && (
          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-text-muted mb-1">Summary Notes</p>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{product.notes}</p>
          </div>
        )}

        <Button variant="secondary" className="w-full" onClick={() => generateProductReportPdf(data, product)}>
          <FileDown size={16} /> Export Product Report
        </Button>
      </Card>

      <Card>
        <SectionHeader title="Pipeline" subtitle="Design → Video Editing → Testing → Completed" />
        <PipelineStepper product={product} />
      </Card>

      <Card>
        <SectionHeader title="Add to Timeline" subtitle="Log a note, problem or correction" />
        <AddNoteForm productId={product.id} />
      </Card>

      <Card>
        <SectionHeader title="Complete History" subtitle={`${product.history.length} events`} />
        <ProductHistory history={product.history} />
      </Card>

      <Sheet open={editing} onClose={() => setEditing(false)} title={`Edit ${product.sku}`}>
        <ProductForm product={product} onDone={() => setEditing(false)} />
      </Sheet>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
        <Icon size={12} /> {label}
      </p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
