"use client";

import { useState } from "react";
import { CalendarClock, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { mockSchedules } from "@/lib/mock-data";
import { ScheduleItem } from "@/types/domain";
import { t } from "@/lib/i18n";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";
import { isLocaleCode } from "@/lib/locale";

export default function SchedulePage() {
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale) ? params.locale : DEFAULT_LOCALE;
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>(mockSchedules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  const submitItem = () => {
    if (!isLoggedIn || !title || !time || !room) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, title, time, room } : item,
        ),
      );
      setEditingId(null);
    } else {
      setItems((prev) => [...prev, { id: crypto.randomUUID(), title, time, room }]);
    }
    setTitle("");
    setTime("");
    setRoom("");
  };

  const startEdit = (item: ScheduleItem) => {
    if (!isLoggedIn) return;
    setEditingId(item.id);
    setTitle(item.title);
    setTime(item.time);
    setRoom(item.room);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setTime("");
    setRoom("");
  };

  const removeItem = (id: string) => {
    if (!isLoggedIn) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

  const sortedItems = [...items].sort((a, b) => a.time.localeCompare(b.time));
  const nextItem = sortedItems[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <Card className="order-2 xl:order-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            🗓️ {t(locale, "feature.schedule.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLoggedIn && (
            <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              {t(locale, "common.readonlyHint")}
            </p>
          )}

          <div className="grid gap-2 md:grid-cols-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t(locale, "schedule.field.title")} />
            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder={t(locale, "schedule.field.time")} />
            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder={t(locale, "schedule.field.room")} />
            <div className="flex gap-2">
              <Button onClick={submitItem} disabled={!isLoggedIn} className="flex-1">
                {editingId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? t(locale, "common.save") : t(locale, "common.add")}
              </Button>
              {editingId ? (
                <Button variant="outline" onClick={cancelEdit} disabled={!isLoggedIn}>
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 p-3"
              >
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.time} · {item.room}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(item)} disabled={!isLoggedIn}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} disabled={!isLoggedIn}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="order-1 xl:order-2">
        <CardHeader>
          <CardTitle>📌 {t(locale, "schedule.sidebar.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "schedule.sidebar.totalLabel")}</p>
            <p className="text-sm font-semibold">{t(locale, "feature.schedule.title")}</p>
            <p className="text-sm text-muted-foreground">{sortedItems.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "schedule.sidebar.nextLabel")}</p>
            <p className="text-sm font-semibold">{nextItem?.title ?? "-"}</p>
            <p className="text-sm text-muted-foreground">{nextItem ? `${nextItem.time} · ${nextItem.room}` : "-"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
