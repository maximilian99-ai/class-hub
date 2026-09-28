"use client";

import { useState } from "react";
import { Check, CheckCheck, Pencil, Plus, Trash2, UserRoundCheck, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { mockAttendance } from "@/lib/mock-data";
import { AttendanceItem } from "@/types/domain";
import { t } from "@/lib/i18n";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";
import { isLocaleCode } from "@/lib/locale";

export default function AttendancePage() {
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale) ? params.locale : DEFAULT_LOCALE;
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<AttendanceItem[]>(mockAttendance);
  const [studentName, setStudentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const submitStudent = () => {
    if (!isLoggedIn || !studentName.trim()) return;
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, studentName: studentName.trim() } : item,
        ),
      );
      setEditingId(null);
    } else {
      setItems((prev) => [
        ...prev,
        { id: crypto.randomUUID(), studentName: studentName.trim(), present: false },
      ]);
    }
    setStudentName("");
  };

  const startEdit = (item: AttendanceItem) => {
    if (!isLoggedIn) return;
    setEditingId(item.id);
    setStudentName(item.studentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setStudentName("");
  };

  const removeStudent = (id: string) => {
    if (!isLoggedIn) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  };

  const toggleAttendance = (id: string) => {
    if (!isLoggedIn) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, present: !item.present } : item,
      ),
    );
  };

  const presentCount = items.filter((item) => item.present).length;
  const absentCount = items.length - presentCount;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <Card className="order-2 xl:order-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundCheck className="h-5 w-5" />
            ✅ {t(locale, "feature.attendance.title")}
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
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t(locale, "attendance.field.studentName")}
            />
            <Button onClick={submitStudent} disabled={!isLoggedIn}>
              {editingId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? t(locale, "common.save") : t(locale, "common.add")}
            </Button>
            <Button variant="outline" onClick={cancelEdit} disabled={!editingId || !isLoggedIn}>
              <X className="mr-2 h-4 w-4" />
              {t(locale, "common.cancel")}
            </Button>
          </div>

          <div className="rounded-2xl border border-border/70 p-4 text-sm text-muted-foreground">
            <CheckCheck className="mr-2 inline h-4 w-4" />
            {t(locale, "attendance.summary", {
              present: String(presentCount),
              total: String(items.length),
            })}
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 p-3"
              >
                <p className="font-medium">👤 {item.studentName}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(item)} disabled={!isLoggedIn}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeStudent(item.id)} disabled={!isLoggedIn}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={item.present ? "default" : "outline"}
                    onClick={() => toggleAttendance(item.id)}
                    disabled={!isLoggedIn}
                  >
                    {item.present ? t(locale, "attendance.present") : t(locale, "attendance.absent")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="order-1 xl:order-2">
        <CardHeader>
          <CardTitle>📌 {t(locale, "attendance.sidebar.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "attendance.sidebar.presentLabel")}</p>
            <p className="text-sm font-semibold">{t(locale, "attendance.present")}</p>
            <p className="text-sm text-muted-foreground">{presentCount}</p>
          </div>
          <div className="rounded-2xl border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">{t(locale, "attendance.sidebar.absentLabel")}</p>
            <p className="text-sm font-semibold">{t(locale, "attendance.absent")}</p>
            <p className="text-sm text-muted-foreground">{absentCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
