"use client";

import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Announcement } from "@/data/market";
import { useMergedAnnouncements } from "@/hooks/use-merged-market";
import { saveAnnouncementsOverride } from "@/lib/market-overrides";

export default function ManagerAnnouncementsPage() {
  const list = useMergedAnnouncements();

  const persist = (next: Announcement[], message?: string) => {
    saveAnnouncementsOverride(next);
    if (message) toast.success(message);
  };

  const update = (id: number, patch: Partial<Announcement>) => {
    persist(list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const add = () => {
    const id = list.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    persist([...list, { id, title: "New announcement", time: "Today", body: "Details go here." }], "Announcement added");
  };

  const remove = (id: number) => {
    if (list.length <= 1) {
      toast.error("Keep at least one announcement.");
      return;
    }
    persist(
      list.filter((a) => a.id !== id),
      "Removed",
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Announcements</h1>
          <p className="mt-2 text-sm text-muted-foreground">Edits save as you type. Shown on the public announcements page.</p>
        </div>
        <Button type="button" variant="outline" className="rounded-full" onClick={add}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <ul className="mt-8 space-y-6">
        {list.map((a) => (
          <li key={a.id} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-mono text-muted-foreground">id:{a.id}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => remove(a.id)}
                aria-label="Remove announcement"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`t-${a.id}`}>Title</Label>
                <Input id={`t-${a.id}`} value={a.title} onChange={(e) => update(a.id, { title: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`time-${a.id}`}>Time / date line</Label>
                <Input id={`time-${a.id}`} value={a.time} onChange={(e) => update(a.id, { time: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor={`b-${a.id}`}>Body</Label>
              <Textarea id={`b-${a.id}`} rows={3} value={a.body} onChange={(e) => update(a.id, { body: e.target.value })} className="rounded-xl" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
