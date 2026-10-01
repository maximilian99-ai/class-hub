import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { LocaleCode } from "@class-hub/shared";
import { t } from "../lib/i18n";
import type { AppScreen } from "../types/navigation";

type HomeScreenProps = {
  locale: LocaleCode;
  isLoggedIn: boolean;
  welcomeName: string;
  onNavigate: (screen: AppScreen) => void;
};

export function HomeScreen({
  locale,
  isLoggedIn,
  welcomeName,
  onNavigate,
}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#111827", "#1f2937"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.badge}>B2B Class Ops SaaS MVP</Text>
        <Text style={styles.heroTitle}>{t(locale, "home.titleLine1")}</Text>
        <Text style={styles.heroTitle}>{t(locale, "home.titleLine2")}</Text>
        <Text style={styles.heroDesc}>{t(locale, "home.description")}</Text>
      </LinearGradient>

      <Text style={styles.welcome}>
        {isLoggedIn
          ? t(locale, "nav.welcome", { name: welcomeName })
          : t(locale, "nav.publicHint")}
      </Text>

      <View style={styles.grid}>
        <FeatureCard
          emoji="🗓️"
          title={t(locale, "feature.schedule.title")}
          desc={t(locale, "feature.schedule.desc")}
          onPress={() => onNavigate("schedule")}
        />
        <FeatureCard
          emoji="✅"
          title={t(locale, "feature.attendance.title")}
          desc={t(locale, "feature.attendance.desc")}
          onPress={() => onNavigate("attendance")}
        />
        <FeatureCard
          emoji="📚"
          title={t(locale, "feature.classes.title")}
          desc={t(locale, "feature.classes.desc")}
          onPress={() => onNavigate("classes")}
        />
      </View>

      {!isLoggedIn ? (
        <View style={styles.authRow}>
          <Pressable style={[styles.authButton, styles.authOutline]} onPress={() => onNavigate("signup")}>
            <Text style={styles.authOutlineText}>{t(locale, "nav.signup")}</Text>
          </Pressable>
          <Pressable style={[styles.authButton, styles.authSolid]} onPress={() => onNavigate("login")}>
            <Text style={styles.authSolidText}>{t(locale, "nav.login")}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type FeatureCardProps = {
  emoji: string;
  title: string;
  desc: string;
  onPress: () => void;
};

function FeatureCard({ emoji, title, desc, onPress }: FeatureCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  hero: {
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  badge: {
    color: "#93c5fd",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroTitle: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
  },
  heroDesc: {
    color: "#cbd5e1",
    marginTop: 8,
    lineHeight: 20,
  },
  welcome: {
    color: "#dbeafe",
    fontWeight: "600",
  },
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: "#0b1220",
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardTitle: {
    color: "#f8fafc",
    fontWeight: "800",
    fontSize: 16,
  },
  cardDesc: {
    color: "#94a3b8",
    lineHeight: 18,
  },
  authRow: {
    flexDirection: "row",
    gap: 10,
  },
  authButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  authOutline: {
    borderWidth: 1,
    borderColor: "#334155",
  },
  authSolid: {
    backgroundColor: "#22d3ee",
  },
  authOutlineText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  authSolidText: {
    color: "#082f49",
    fontWeight: "800",
  },
});
