/**
 * Migrates a product from the pre-pipeline shape (category/usage/images/team/status/
 * assignedPersonId) into the current Design -> Video Editing -> Testing -> Finished shape.
 * Runs before schema validation so existing browsers/backups don't lose their product history
 * when the workflow model changes.
 */
export function migrateLegacyProduct(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) return raw;
  const p = raw as Record<string, unknown>;

  // Already in the current shape.
  if (typeof p.itemType === "string" && typeof p.stage === "string") return p;

  // Not the recognizable legacy shape either — let validation reject it normally.
  if (typeof p.team !== "string" && typeof p.status !== "string") return p;

  const team = typeof p.team === "string" ? p.team : "PHOTO";
  const status = typeof p.status === "string" ? p.status : "ZU_ERLEDIGEN";
  const assignedPersonId = typeof p.assignedPersonId === "string" ? p.assignedPersonId : null;

  const stage = status === "VOLLSTANDIG" ? "FINISHED" : team === "VIDEO" ? "VIDEO_EDITING" : team === "TESTING" ? "TESTING" : "DESIGN";

  const designPersonId = stage === "DESIGN" ? assignedPersonId : null;
  const videoEditingPersonId = stage === "VIDEO_EDITING" ? assignedPersonId : null;
  const testingPersonId = stage === "TESTING" || stage === "FINISHED" ? assignedPersonId : null;

  const {
    category: _category,
    usage: _usage,
    images: _images,
    team: _team,
    assignedPersonId: _assignedPersonId,
    assignedAt,
    status: _status,
    sourceProductId: _sourceProductId,
    ...rest
  } = p;
  void _category;
  void _usage;
  void _images;
  void _team;
  void _assignedPersonId;
  void _status;
  void _sourceProductId;

  return {
    ...rest,
    itemType: "PRODUCT",
    stage,
    designPersonId,
    videoEditingPersonId,
    testingPersonId,
    stageEnteredAt: typeof assignedAt === "string" ? assignedAt : (p.createdAt ?? new Date().toISOString()),
  };
}

export function migrateAppDataShape(input: unknown): unknown {
  if (typeof input !== "object" || input === null) return input;
  const data = input as Record<string, unknown>;
  if (!Array.isArray(data.products)) return input;
  return { ...data, products: data.products.map(migrateLegacyProduct) };
}
