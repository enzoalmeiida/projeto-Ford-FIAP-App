import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsiveLayout } from "@/hooks/use-responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type SupportTicket = { id: string; description: string; createdAt: string };
const TICKETS_STORAGE_KEY = "@ford-fiap/support/tickets";

export default function SuporteScreen() {
  const [descricao, setDescricao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { pagePadding, contentMaxWidth, titleSize, bodyTextSize } = useResponsiveLayout();

  useEffect(() => {
    AsyncStorage.getItem(TICKETS_STORAGE_KEY)
      .then((storedTickets) => {
        if (!storedTickets) return;
        const parsedTickets: unknown = JSON.parse(storedTickets);
        if (Array.isArray(parsedTickets)) {
          setTickets(parsedTickets.filter((item): item is SupportTicket =>
            Boolean(item && typeof item === "object" && "id" in item && "description" in item && "createdAt" in item)
          ));
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSubmit = async () => {
    const description = descricao.trim();
    if (description.length < 10) {
      Alert.alert("Descreva melhor", "Conte um pouco mais sobre o problema (no mínimo 10 caracteres). ");
      return;
    }

    setIsSubmitting(true);
    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const parsedTickets: unknown = storedTickets ? JSON.parse(storedTickets) : [];
      const tickets = Array.isArray(parsedTickets) ? parsedTickets as SupportTicket[] : [];
      const ticket: SupportTicket = { id: `${Date.now()}`, description, createdAt: new Date().toISOString() };
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify([ticket, ...tickets]));
      setTickets((current) => [ticket, ...current]);
      setDescricao("");
      Alert.alert("Chamado registrado", `Protocolo ${ticket.id}. O registro foi salvo neste dispositivo.`);
    } catch {
      Alert.alert("Não foi possível salvar", "Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: pagePadding }]}>
      <View style={[styles.shell, { maxWidth: contentMaxWidth }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Suporte ao cliente</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText, fontSize: bodyTextSize }]}>Um fluxo mais claro para abertura de chamados e contato direto.</Text>

      <View style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>Entre em contato</Text>
        <Text style={[styles.contactText, { color: colors.mutedText }]}>Telefone: (11) 4002-8922</Text>
        <Text style={[styles.contactText, { color: colors.mutedText }]}>Email: suporte@fordfiap.com</Text>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>Abrir chamado</Text>
        <Text style={[styles.contactText, { color: colors.mutedText }]}>Descreva o que aconteceu. Seu protocolo ficará salvo neste dispositivo.</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.text }]}
          placeholder="Descreva seu problema"
          placeholderTextColor={colors.mutedText}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={1000}
          textAlignVertical="top"
          accessibilityLabel="Descrição do chamado"
        />
        <Text style={[styles.counter, { color: colors.mutedText }]}>{descricao.length}/1000</Text>

        <Pressable accessibilityRole="button" disabled={isSubmitting} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.tint, opacity: pressed || isSubmitting ? 0.75 : 1 }]} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? "Registrando..." : "Abrir chamado"}</Text>
        </Pressable>
      </View>

      {tickets.length > 0 ? (
        <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>Chamados recentes</Text>
          {tickets.slice(0, 3).map((ticket) => (
            <View key={ticket.id} style={[styles.ticketRow, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.ticketId, { color: colors.accent }]}>Protocolo {ticket.id}</Text>
              <Text style={[styles.contactText, { color: colors.text }]} numberOfLines={3}>{ticket.description}</Text>
              <Text style={[styles.ticketDate, { color: colors.mutedText }]}>{new Date(ticket.createdAt).toLocaleString("pt-BR")}</Text>
            </View>
          ))}
        </View>
      ) : null}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: "center",
    gap: 14,
  },
  shell: { width: "100%", gap: 14 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  contactCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
  },
  formCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  contactText: {
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  historyCard: { padding: 16, borderRadius: 22, borderWidth: 1, gap: 10 },
  ticketRow: { padding: 12, borderRadius: 16, gap: 4 },
  ticketId: { fontSize: 12, fontWeight: "800" },
  ticketDate: { fontSize: 12 },
  counter: { alignSelf: "flex-end", fontSize: 12, marginTop: -6 },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
