"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 px-4 md:px-8 py-3"
      style={{ paddingTop: "calc(var(--safe-top) + 0.6rem)" }}
    >
      <Link href="/" className="flex items-center gap-2.5 md:hidden">
        <Image src="/logo-mark.png" alt="Planin Work" width={30} height={30} className="rounded-[8px]" priority />
        <span className="text-[15px] font-semibold tracking-tight text-text-primary">PLANIN WORK</span>
      </Link>

      <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md">
        <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 focus-within:ring-2 focus-within:ring-brand/30">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SKU, product, person, team..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
        </div>
      </form>

      <Link
        href="/search"
        aria-label="Search"
        className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-2 tap-target"
      >
        <Search size={20} />
      </Link>
    </header>
  );
}
