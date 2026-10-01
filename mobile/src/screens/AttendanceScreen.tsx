import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocaleCode } from "@class-hub/shared";
import { useAuth } from "../hooks/use-auth";
import { t } from "../lib/i18n";
import {
  createAttendance,
  deleteAttendance,
  listAttendance,
  updateAttendance,
} from "../lib/core-api";
import { mockAttendance } from "../lib/mock-data";
import type { AttendanceItem } from "../types/domain";

export function AttendanceScreen({ locale }: { locale: LocaleCode }) {
  const { isLoggedIn, accessToken } = useAuth();
  const [items, setItems] = useState<AttendanceItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isLoggedIn || !accessToken) {
        setItems(mockAttendance);
        return;
      }

      try {
        const data = await listAttendance({ accessToken });
        setItems(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
      }
    }

    void load();
  }, [isLoggedIn, accessToken]);

  const submitStudent = async () => {
    if (!isLoggedIn || !accessToken || !studentName.trim()) return;

    try {
      if (editingId) {
        const updated = await updateAttendance({
          accessToken,
          id: editingId,
          studentName: studentName.trim(),
        });
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setEditingId(null);
      } else {
        const created = await createAttendance({
          accessToken,
          studentName: studentName.trim(),
          present: false,
        });
        setItems((prev) => [created, ...prev]);
      }
      setStudentName("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const toggleAttendance = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;

    const target = items.find((item) => item.id === id);
    if (!target) return;

    try {
      const updated = await updateAttendance({ accessToken, id, present: !target.present });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const removeStudent = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;
    try {
      await deleteAttendance({ accessToken, id });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const presentCount = useMemo(() => items.filter((item) => item.present).length, [items]);
  const absentCount = items.length - presentCount;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✅ {t(locale, "feature.attendance.title")}</Text>

      {!isLoggedIn ? <Text style={styles.hint}>{t(locale, "common.readonlyHint")}</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.formCard}>
        <TextInput
          value={studentName}
          onChangeText={setStudentName}
          placeholder={t(locale, "attendance.field.studentName")}
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <View style={styles.row}>
          <ActionButton
            title={editingId ? t(locale, "common.save") : t(locale, "common.add")}
            onPress={submitStudent}
            disabled={!isLoggedIn}
          />
          <ActionButton
            title={t(locale, "common.cancel")}
            onPress={() => {
              setEditingId(null);
              setStudentName("");
            }}
            variant="outline"
            disabled={!editingId || !isLoggedIn}
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📌 {t(locale, "attendance.sidebar.title")}</Text>
        <Text style={styles.summaryLine}>{t(locale, "attendance.sidebar.presentLabel")}: {presentCount}</Text>
        <Text style={styles.summaryLine}>{t(locale, "attendance.sidebar.absentLabel")}: {absentCount}</Text>
      </View>

      <View style={styles.listWrap}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View>
              <Text style={styles.itemTitle}>👤 {item.studentName}</Text>
              <Text style={styles.itemSub}>
                {item.present ? t(locale, "attendance.present") : t(locale, "attendance.absent")}
              </Text>
            </View>
            <View style={styles.row}>
              <ActionButton
                title="Edit"
                onPress={() => {
                  if (!isLoggedIn) return;
                  setEditingId(item.id);
                  setStudentName(item.studentName);
                }}
                variant="outline"
                compact
              />
              <ActionButton
                title="Delete"
                onPress={() => void removeStudent(item.id)}
                variant="danger"
                compact
                disabled={!isLoggedIn}
              />
              <ActionButton
                title={item.present ? t(locale, "attendance.present") : t(locale, "attendance.absent")}
                onPress={() => void toggleAttendance(item.id)}
                variant={item.present ? "solid" : "outline"}
                compact
                disabled={!isLoggedIn}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ActionButton({
  title,
  onPress,
  disabled,
  variant = "solid",
  compact = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline" | "danger";
  compact?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.button,
        compact ? styles.buttonCompact : null,
        variant === "solid" ? styles.buttonSolid : null,
        variant === "outline" ? styles.buttonOutline : null,
        variant === "danger" ? styles.buttonDanger : null,
        disabled ? styles.buttonDisabled : null,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 20,
  },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "900",
  },
  hint: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 12,
    color: "#cbd5e1",
    padding: 10,
  },
  error: {
    color: "#fecaca",
    backgroundColor: "#7f1d1d",
    padding: 10,
    borderRadius: 12,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    backgroundColor: "#0b1220",
    padding: 12,
    gap: 8,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    backgroundColor: "#0b1220",
    padding: 12,
    gap: 6,
  },
  summaryTitle: {
    color: "#bae6fd",
    fontWeight: "800",
  },
  summaryLine: {
    color: "#cbd5e1",
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f8fafc",
    backgroundColor: "#0f172a",
  },
  listWrap: {
    gap: 8,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    backgroundColor: "#0b1220",
    padding: 10,
    gap: 8,
  },
  itemTitle: {
    color: "#f8fafc",
    fontWeight: "700",
  },
  itemSub: {
    color: "#94a3b8",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },
  buttonCompact: {
    minWidth: 56,
    paddingHorizontal: 10,
  },
  buttonSolid: {
    backgroundColor: "#22d3ee",
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#334155",
  },
  buttonDanger: {
    backgroundColor: "#b91c1c",
  },
  buttonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});
