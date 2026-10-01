import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocaleCode } from "@class-hub/shared";
import { useAuth } from "../hooks/use-auth";
import { t } from "../lib/i18n";
import { createSchedule, deleteSchedule, listSchedules, updateSchedule } from "../lib/core-api";
import { mockSchedules } from "../lib/mock-data";
import type { ScheduleItem } from "../types/domain";

export function ScheduleScreen({ locale }: { locale: LocaleCode }) {
  const { isLoggedIn, accessToken } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    async function load() {
      if (!isLoggedIn || !accessToken) {
        setItems(mockSchedules);
        return;
      }

      try {
        const data = await listSchedules({ accessToken });
        setItems(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
      }
    }

    void load();
  }, [isLoggedIn, accessToken]);

  const submitItem = async () => {
    if (!isLoggedIn || !accessToken || !title || !time || !room) return;

    setErrorMessage(null);

    try {
      if (editingId) {
        const updated = await updateSchedule({ accessToken, id: editingId, title, time, room });
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
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const sortedItems = useMemo(() => [...items].sort((a, b) => a.time.localeCompare(b.time)), [items]);
  const nextItem = sortedItems[0];

  const removeItem = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;
    try {
      await deleteSchedule({ accessToken, id });
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setTime("");
        setRoom("");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🗓️ {t(locale, "feature.schedule.title")}</Text>

      {!isLoggedIn ? <Text style={styles.hint}>{t(locale, "common.readonlyHint")}</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.formCard}>
        <Field value={title} onChangeText={setTitle} placeholder={t(locale, "schedule.field.title")} />
        <Field value={time} onChangeText={setTime} placeholder={t(locale, "schedule.field.time")} />
        <Field value={room} onChangeText={setRoom} placeholder={t(locale, "schedule.field.room")} />
        <View style={styles.row}>
          <ActionButton
            title={editingId ? t(locale, "common.save") : t(locale, "common.add")}
            onPress={submitItem}
            disabled={!isLoggedIn}
          />
          {editingId ? (
            <ActionButton
              title={t(locale, "common.cancel")}
              onPress={() => {
                setEditingId(null);
                setTitle("");
                setTime("");
                setRoom("");
              }}
              variant="outline"
            />
          ) : null}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📌 {t(locale, "schedule.sidebar.title")}</Text>
        <Text style={styles.summaryLine}>
          {t(locale, "schedule.sidebar.totalLabel")}: {sortedItems.length}
        </Text>
        <Text style={styles.summaryLine}>
          {t(locale, "schedule.sidebar.nextLabel")}: {nextItem ? `${nextItem.title} (${nextItem.time})` : "-"}
        </Text>
      </View>

      <View style={styles.listWrap}>
        {sortedItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>{item.time} · {item.room}</Text>
            </View>
            <View style={styles.row}>
              <ActionButton
                title="Edit"
                onPress={() => {
                  if (!isLoggedIn) return;
                  setEditingId(item.id);
                  setTitle(item.title);
                  setTime(item.time);
                  setRoom(item.room);
                }}
                variant="outline"
                compact
              />
              <ActionButton
                title="Delete"
                onPress={() => void removeItem(item.id)}
                variant="danger"
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

function Field({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      style={styles.input}
    />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
