import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocaleCode } from "@class-hub/shared";
import { useAuth } from "../hooks/use-auth";
import { t } from "../lib/i18n";
import { createClassTask, deleteClassTask, listClassTasks, updateClassTask } from "../lib/core-api";
import { mockTasks } from "../lib/mock-data";
import type { ClassTask } from "../types/domain";

export function ClassesScreen({ locale }: { locale: LocaleCode }) {
  const { isLoggedIn, accessToken } = useAuth();
  const [items, setItems] = useState<ClassTask[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [topic, setTopic] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    async function load() {
      if (!isLoggedIn || !accessToken) {
        setItems(mockTasks);
        return;
      }

      try {
        const data = await listClassTasks({ accessToken });
        setItems(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
      }
    }

    void load();
  }, [isLoggedIn, accessToken]);

  const ongoing = useMemo(() => items.filter((item) => item.status === "ongoing"), [items]);
  const completed = useMemo(() => items.filter((item) => item.status === "completed"), [items]);

  const submitTask = async () => {
    if (!isLoggedIn || !accessToken || !className || !topic || !assignee) return;

    try {
      if (editingId) {
        const target = items.find((item) => item.id === editingId);
        if (!target) return;

        const updated = await updateClassTask({
          accessToken,
          id: editingId,
          className,
          topic,
          assignee,
          status: target.status,
        });
        setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        setEditingId(null);
      } else {
        const created = await createClassTask({
          accessToken,
          className,
          topic,
          assignee,
          status: "ongoing",
        });
        setItems((prev) => [created, ...prev]);
      }
      setClassName("");
      setTopic("");
      setAssignee("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const toggleStatus = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;
    const target = items.find((item) => item.id === id);
    if (!target) return;

    try {
      const updated = await updateClassTask({
        accessToken,
        id,
        status: target.status === "ongoing" ? "completed" : "ongoing",
      });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  const removeTask = async (id: string) => {
    if (!isLoggedIn || !accessToken) return;
    try {
      await deleteClassTask({ accessToken, id });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "REQUEST_FAILED");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 {t(locale, "feature.classes.title")}</Text>

      {!isLoggedIn ? <Text style={styles.hint}>{t(locale, "common.readonlyHint")}</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.formCard}>
        <Field value={className} onChangeText={setClassName} placeholder={t(locale, "classes.field.className")} />
        <Field value={topic} onChangeText={setTopic} placeholder={t(locale, "classes.field.topic")} />
        <Field value={assignee} onChangeText={setAssignee} placeholder={t(locale, "classes.field.assignee")} />
        <View style={styles.row}>
          <ActionButton
            title={editingId ? t(locale, "common.save") : t(locale, "classes.add")}
            onPress={submitTask}
            disabled={!isLoggedIn}
          />
          <ActionButton
            title={t(locale, "common.cancel")}
            onPress={() => {
              setEditingId(null);
              setClassName("");
              setTopic("");
              setAssignee("");
            }}
            variant="outline"
            disabled={!editingId || !isLoggedIn}
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📌 {t(locale, "classes.sidebar.title")}</Text>
        <Text style={styles.summaryLine}>{t(locale, "classes.sidebar.ongoingLabel")}: {ongoing.length}</Text>
        <Text style={styles.summaryLine}>{t(locale, "classes.sidebar.completedLabel")}: {completed.length}</Text>
      </View>

      <View style={styles.listWrap}>
        <KanbanColumn
          locale={locale}
          title={t(locale, "classes.ongoing")}
          items={ongoing}
          isLoggedIn={isLoggedIn}
          onToggle={toggleStatus}
          onDelete={removeTask}
          onEdit={(task) => {
            setEditingId(task.id);
            setClassName(task.className);
            setTopic(task.topic);
            setAssignee(task.assignee);
          }}
        />

        <KanbanColumn
          locale={locale}
          title={t(locale, "classes.completed")}
          items={completed}
          isLoggedIn={isLoggedIn}
          onToggle={toggleStatus}
          onDelete={removeTask}
          onEdit={(task) => {
            setEditingId(task.id);
            setClassName(task.className);
            setTopic(task.topic);
            setAssignee(task.assignee);
          }}
        />
      </View>
    </ScrollView>
  );
}

function KanbanColumn({
  locale,
  title,
  items,
  isLoggedIn,
  onToggle,
  onDelete,
  onEdit,
}: {
  locale: LocaleCode;
  title: string;
  items: ClassTask[];
  isLoggedIn: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: ClassTask) => void;
}) {
  return (
    <View style={styles.columnCard}>
      <Text style={styles.columnTitle}>{title} ({items.length})</Text>
      <View style={styles.listWrap}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemSub}>{item.className}</Text>
            <Text style={styles.itemTitle}>{item.topic}</Text>
            <Text style={styles.itemSub}>{t(locale, "classes.assignee")}: {item.assignee}</Text>
            <View style={styles.row}>
              <ActionButton title="Edit" onPress={() => onEdit(item)} variant="outline" compact />
              <ActionButton
                title="Delete"
                onPress={() => void onDelete(item.id)}
                variant="danger"
                compact
                disabled={!isLoggedIn}
              />
              <ActionButton
                title={t(locale, "classes.toggle")}
                onPress={() => void onToggle(item.id)}
                variant="outline"
                compact
                disabled={!isLoggedIn}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
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
  columnCard: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    backgroundColor: "#0b1220",
    padding: 10,
    gap: 8,
  },
  columnTitle: {
    color: "#f8fafc",
    fontWeight: "800",
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    backgroundColor: "#0f172a",
    padding: 10,
    gap: 6,
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
