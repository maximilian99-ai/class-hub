"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { createSchedule, deleteSchedule, listSchedules, updateSchedule } from "@/lib/core-api";
import { mockSchedules } from "@/lib/mock-data";
import { ScheduleItem } from "@/types/domain";
import { t } from "@/lib/i18n";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";
import { isLocaleCode } from "@/lib/locale";

export default function SchedulePage() {
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale) ? params.locale : DEFAULT_LOCALE;
  const { isLoggedIn, accessToken } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    async function loadSchedules() {
      if (!isLoggedIn || !accessToken) {
        setItems(mockSchedules);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await listSchedules({ accessToken });
        setItems(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "REQUEST_FAILED";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSchedules();
  }, [isLoggedIn, accessToken]);

  const submitItem = async () => {
    if (!isLoggedIn || !accessToken || !title || !time || !room) return;

    setErrorMessage(null);

    try {
      if (editingId) {
        const updated = await updateSchedule({
          accessToken,
          id: editingId,
          title,
          time,
          room
        });
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setEditingId(null);
      } else {
        const created = await createSchedule({ accessToken, title, time, room });
        setItems((prev) => [created, ...prev]);
      }

      setTitle("");
      setTime("");
      setRoom("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "REQUEST_FAILED";
      setErrorMessage(message);
    }
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

  const removeItem = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;

    setErrorMessage(null);

    try {
      await deleteSchedule({ accessToken, id });
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "REQUEST_FAILED";
      setErrorMessage(message);
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

          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="grid gap-2 md:grid-cols-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t(locale, "schedule.field.title")} />
            <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder={t(locale, "schedule.field.time")} />
            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder={t(locale, "schedule.field.room")} />
            <div className="flex gap-2">
              <Button onClick={() => void submitItem()} disabled={!isLoggedIn} className="flex-1">
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
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              sortedItems.map((item) => (
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
                    <Button variant="ghost" size="sm" onClick={() => void removeItem(item.id)} disabled={!isLoggedIn}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
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
