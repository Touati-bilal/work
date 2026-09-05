import type { Person } from "@/lib/types";
import { avatarColor, initials } from "@/lib/utils/avatarColor";
import { User } from "lucide-react";

export function PersonAvatar({ person, size = 28 }: { person?: Person | null; size?: number }) {
  if (!person) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full bg-surface-2 border border-border text-text-muted shrink-0"
        style={{ width: size, height: size }}
      >
        <User size={size * 0.55} />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold shrink-0 ${avatarColor(person.id)}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      title={person.handle}
    >
      {initials(person.name)}
    </span>
  );
}

export function PersonChip({ person }: { person?: Person | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
      <PersonAvatar person={person} size={22} />
      {person ? person.handle : "Unassigned"}
    </span>
  );
}
