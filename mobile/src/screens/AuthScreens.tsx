import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { LocaleCode } from "@class-hub/shared";
import { t } from "../lib/i18n";
import { useAuth } from "../hooks/use-auth";

type AuthScreenProps = {
  locale: LocaleCode;
  onSuccess: () => void;
};

export function LoginScreen({ locale, onSuccess }: AuthScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t(locale, "login.title"), t(locale, "auth.errorRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ email, password });
      if (!result.ok) {
        Alert.alert(
          t(locale, "login.title"),
          result.message ?? t(locale, "auth.errorInvalidCredentials"),
        );
        return;
      }
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t(locale, "login.title")}</Text>
      <LabeledInput
        label={t(locale, "login.emailLabel")}
        value={email}
        onChangeText={setEmail}
        placeholder={t(locale, "login.emailPlaceholder")}
        keyboardType="email-address"
      />
      <LabeledInput
        label={t(locale, "login.passwordLabel")}
        value={password}
        onChangeText={setPassword}
        placeholder={t(locale, "login.passwordPlaceholder")}
        secureTextEntry
      />
      <Pressable style={styles.submitButton} onPress={onSubmit} disabled={isSubmitting}>
        <Text style={styles.submitText}>{t(locale, "login.submit")}</Text>
      </Pressable>
    </View>
  );
}

export function SignupScreen({ locale, onSuccess }: AuthScreenProps) {
  const { signup } = useAuth();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t(locale, "signup.title"), t(locale, "auth.errorRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup({ nickname, email, password });
      if (!result.ok) {
        if (result.error === "EMAIL_EXISTS") {
          Alert.alert(t(locale, "signup.title"), t(locale, "auth.errorEmailExists"));
        } else {
          Alert.alert(
            t(locale, "signup.title"),
            result.message ?? t(locale, "auth.errorInvalidCredentials"),
          );
        }
        return;
      }
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t(locale, "signup.title")}</Text>
      <LabeledInput
        label={t(locale, "signup.nicknameLabel")}
        value={nickname}
        onChangeText={setNickname}
        placeholder={t(locale, "signup.nicknamePlaceholder")}
      />
      <LabeledInput
        label={t(locale, "signup.emailLabel")}
        value={email}
        onChangeText={setEmail}
        placeholder={t(locale, "signup.emailPlaceholder")}
        keyboardType="email-address"
      />
      <LabeledInput
        label={t(locale, "signup.passwordLabel")}
        value={password}
        onChangeText={setPassword}
        placeholder={t(locale, "signup.passwordPlaceholder")}
        secureTextEntry
      />
      <Pressable style={styles.submitButton} onPress={onSubmit} disabled={isSubmitting}>
        <Text style={styles.submitText}>{t(locale, "signup.submit")}</Text>
      </Pressable>
    </View>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
};

function LabeledInput({
  label,
  value,
  placeholder,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
}: LabeledInputProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0b1220",
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  title: {
    color: "#f8fafc",
    fontWeight: "800",
    fontSize: 20,
    marginBottom: 2,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: "#cbd5e1",
    fontSize: 13,
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
  submitButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#22d3ee",
  },
  submitText: {
    color: "#082f49",
    fontWeight: "800",
  },
});
