"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Check,
  KanbanSquare,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { mockTasks } from "@/lib/mock-data";
import { t } from "@/lib/i18n";
import { isLocaleCode } from "@/lib/locale";
import { ClassTask } from "@/types/domain";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";

export default function ClassesPage() {
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<ClassTask[]>(mockTasks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [topic, setTopic] = useState("");
  const [assignee, setAssignee] = useState("");

  const ongoing = useMemo(
    () => items.filter((item) => item.status === "ongoing"),
    [items],
  );
  const completed = useMemo(
    () => items.filter((item) => item.status === "completed"),
    [items],
  );

  const submitTask = () => {
    if (!isLoggedIn || !className || !topic || !assignee) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, className, topic, assignee } : item,
        ),
      );
      setEditingId(null);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          className,
          topic,
          assignee,
          status: "ongoing",
        },
      ]);
    }

    setClassName("");
    setTopic("");
    setAssignee("");
  };

  const startEdit = (task: ClassTask) => {
    if (!isLoggedIn) return;
    setEditingId(task.id);
    setClassName(task.className);
    setTopic(task.topic);
    setAssignee(task.assignee);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setClassName("");
    setTopic("");
    setAssignee("");
  };

  const removeTask = (id: string) => {
    if (!isLoggedIn) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };

  const toggleStatus = (id: string) => {
    if (!isLoggedIn) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "ongoing" ? "completed" : "ongoing",
            }
          : item,
      ),
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <div className="order-2 space-y-4 xl:order-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KanbanSquare className="h-5 w-5" />
              📚 {t(locale, "feature.classes.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLoggedIn && (
              <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                {t(locale, "common.readonlyHint")}
              </p>
            )}

            <div className="grid gap-2 md:grid-cols-3">
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={t(locale, "classes.field.className")}
              />
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t(locale, "classes.field.topic")}
              />
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder={t(locale, "classes.field.assignee")}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={submitTask} disabled={!isLoggedIn}>
                {editingId ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {editingId ? t(locale, "common.save") : t(locale, "classes.add")}
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
                disabled={!editingId || !isLoggedIn}
              >
                <X className="mr-2 h-4 w-4" />
                {t(locale, "common.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <KanbanColumn
            locale={locale}
            title={t(locale, "classes.ongoing")}
            emoji="🚀"
            items={ongoing}
            onToggle={toggleStatus}
            onEdit={startEdit}
            onDelete={removeTask}
            canEdit={isLoggedIn}
          />
          <KanbanColumn
            locale={locale}
            title={t(locale, "classes.completed")}
            emoji="✅"
            items={completed}
            onToggle={toggleStatus}
            onEdit={startEdit}
            onDelete={removeTask}
            canEdit={isLoggedIn}
          />
        </div>
      </div>

      <Card className="order-1 xl:order-2">
        <CardHeader>
          <CardTitle>📌 {t(locale, "classes.sidebar.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "classes.sidebar.ongoingLabel")}</p>
            <p className="text-sm font-semibold">{t(locale, "classes.ongoing")}</p>
            <p className="text-sm text-muted-foreground">{ongoing.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "classes.sidebar.completedLabel")}</p>
            <p className="text-sm font-semibold">{t(locale, "classes.completed")}</p>
            <p className="text-sm text-muted-foreground">{completed.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({
  locale,
  title,
  emoji,
  items,
  onToggle,
  onEdit,
  onDelete,
  canEdit,
}: {
  locale: LocaleCode;
  title: string;
  emoji: string;
  items: ClassTask[];
  onToggle: (id: string) => void;
  onEdit: (item: ClassTask) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {emoji} {title} ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border/70 p-3">
            <p className="text-sm text-muted-foreground">{item.className}</p>
            <p className="mt-1 font-semibold">{item.topic}</p>
            <p className="mt-1 text-sm">
              {t(locale, "classes.assignee")}: {item.assignee}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item)}
                disabled={!canEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(item.id)}
                disabled={!canEdit}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggle(item.id)}
                disabled={!canEdit}
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                {t(locale, "classes.toggle")}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
