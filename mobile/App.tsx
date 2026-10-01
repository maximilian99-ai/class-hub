import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { getLocales } from "expo-localization";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DEFAULT_LOCALE, type LocaleCode } from "@class-hub/shared";
import { useAuth } from "./src/hooks/use-auth";
import { t } from "./src/lib/i18n";
import { LoginScreen, SignupScreen } from "./src/screens/AuthScreens";
import { AttendanceScreen } from "./src/screens/AttendanceScreen";
import { ClassesScreen } from "./src/screens/ClassesScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ScheduleScreen } from "./src/screens/ScheduleScreen";
import type { AppScreen } from "./src/types/navigation";

const queryClient = new QueryClient();
const SUPPORTED_APP_LOCALES: LocaleCode[] = ["en", "ko"];

function resolveDeviceLocale(): LocaleCode {
  const locales = getLocales();

  for (const locale of locales) {
    const exactTag = locale.languageTag?.toLowerCase();
    if (exactTag && SUPPORTED_APP_LOCALES.includes(exactTag as LocaleCode)) {
      return exactTag as LocaleCode;
    }

    const base = locale.languageCode?.toLowerCase();
    if (base && SUPPORTED_APP_LOCALES.includes(base as LocaleCode)) {
      return base as LocaleCode;
    }
  }

  return DEFAULT_LOCALE;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MainApp />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isLoggedIn, user, logout } = useAuth();
  const [locale, setLocale] = useState<LocaleCode>(resolveDeviceLocale);
  const [screen, setScreen] = useState<AppScreen>("home");

  const showFeatureTabs = useMemo(
    () => screen === "schedule" || screen === "attendance" || screen === "classes",
    [screen],
  );
  const isTablet = width >= 768;
  const horizontalPadding = isTablet ? 22 : 14;
  const tabBottomInset = Math.max(insets.bottom, 10);
  const tabBarReservedHeight = showFeatureTabs ? 74 + tabBottomInset : 24;
  const contentMaxWidth = isTablet ? 820 : undefined;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, 8),
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Pressable onPress={() => setScreen("home")}>
            <Text style={styles.logo}>{t(locale, "appName")}</Text>
          </Pressable>
          <View style={styles.headerRight}>
            <LocalePill
              active={locale === "ko"}
              label="KO"
              onPress={() => setLocale("ko")}
            />
            <LocalePill
              active={locale === "en"}
              label="EN"
              onPress={() => setLocale("en")}
            />
            {isLoggedIn ? (
              <Pressable style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>{t(locale, "nav.logout")}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: tabBarReservedHeight,
            },
          ]}
        >
          <View style={[styles.contentContainer, contentMaxWidth ? { maxWidth: contentMaxWidth } : null]}>
            {screen === "home" ? (
              <HomeScreen
                locale={locale}
                isLoggedIn={isLoggedIn}
                welcomeName={user?.name ?? t(locale, "nav.userFallback")}
                onNavigate={setScreen}
              />
            ) : null}

            {screen === "login" ? (
              <LoginScreen locale={locale} onSuccess={() => setScreen("home")} />
            ) : null}

            {screen === "signup" ? (
              <SignupScreen locale={locale} onSuccess={() => setScreen("login")} />
            ) : null}

            {screen === "schedule" ? <ScheduleScreen locale={locale} /> : null}
            {screen === "attendance" ? <AttendanceScreen locale={locale} /> : null}
            {screen === "classes" ? <ClassesScreen locale={locale} /> : null}
          </View>
        </ScrollView>

        {showFeatureTabs ? (
          <View
            style={[
              styles.tabBar,
              {
                left: horizontalPadding,
                right: horizontalPadding,
                bottom: tabBottomInset,
              },
            ]}
          >
            <TabButton
              label={t(locale, "feature.schedule.title")}
              active={screen === "schedule"}
              onPress={() => setScreen("schedule")}
            />
            <TabButton
              label={t(locale, "feature.attendance.title")}
              active={screen === "attendance"}
              onPress={() => setScreen("attendance")}
            />
            <TabButton
              label={t(locale, "feature.classes.title")}
              active={screen === "classes"}
              onPress={() => setScreen("classes")}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tabButton, active ? styles.tabButtonActive : null]} onPress={onPress}>
      <Text style={[styles.tabText, active ? styles.tabTextActive : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function LocalePill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.localePill, active ? styles.localePillActive : null]} onPress={onPress}>
      <Text style={[styles.localeText, active ? styles.localeTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },
  appShell: {
    flex: 1,
    position: "relative",
  },
  header: {
    paddingVertical: 10,
    borderBottomColor: "#1e293b",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#020617",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  localePill: {
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  localePillActive: {
    backgroundColor: "#22d3ee",
    borderColor: "#22d3ee",
  },
  localeText: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 12,
  },
  localeTextActive: {
    color: "#082f49",
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  logoutText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 12,
  },
  scrollContent: {
    paddingTop: 12,
    minHeight: "100%",
  },
  contentContainer: {
    width: "100%",
    alignSelf: "center",
  },
  tabBar: {
    position: "absolute",
    padding: 8,
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: "rgba(2, 6, 23, 0.96)",
    flexDirection: "row",
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    borderColor: "#334155",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: "#cffafe",
    borderColor: "#67e8f9",
  },
  tabText: {
    color: "#cbd5e1",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#155e75",
  },
});
