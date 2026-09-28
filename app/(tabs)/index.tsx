import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsiveLayout } from "@/hooks/use-responsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versao, setVersao] = useState("");
  const [atributos, setAtributos] = useState("");
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { pagePadding, contentMaxWidth, titleSize, bodyTextSize, isCompact } = useResponsiveLayout();

  const highlights = [
    {
      id: 'ranger-hero',
      tag: 'Picape destaque',
      title: 'Ford Ranger segue como referência em versatilidade',
      text: 'Tração 4x4, pacote robusto e versões para trabalho ou uso premium.',
      action: 'Ver catálogo',
      route: '/carros',
    },
    {
      id: 'mustang-news',
      tag: 'Performance',
      title: 'Mustang mantém o DNA esportivo com V8 e presença marcante',
      text: 'Uma escolha para quem quer tradição, som forte e condução envolvente.',
      action: 'Comparar modelos',
      route: '/detalhes',
    },
    {
      id: 'shop-cta',
      tag: 'Peças e serviços',
      title: 'Monte seu kit de manutenção sem sair do app',
      text: 'Filtro, freio, iluminação e itens essenciais em uma loja rápida de consultar.',
      action: 'Ir para loja',
      route: '/pecas',
    },
  ];

  const quickLinks = [
    { label: 'Carros', subtitle: 'Linha Ford completa', route: '/carros' },
    { label: 'Loja', subtitle: 'Peças e carrinho', route: '/pecas' },
    { label: 'Novidades', subtitle: 'Conteúdo e destaques', route: '/explore' },
    { label: 'Guia', subtitle: 'Comparador rápido', route: '/detalhes' },
  ];

  const handleSubmit = () => {
    if (!modelo.trim()) {
      Alert.alert("Informe um modelo", "Digite o modelo Ford que deseja consultar.");
      return;
    }
    router.push({
      pathname: "/specs",
      params: { marca: marca.trim(), modelo: modelo.trim(), versao: versao.trim(), atributos: atributos.trim() },
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: pagePadding }]}>
      <View style={[styles.shell, { maxWidth: contentMaxWidth }]}>
      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>Ford Intelligence Suite</Text>
        </View>
        <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Sua home da Ford, com catálogo, loja e novidades</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText, fontSize: bodyTextSize }]}>Uma página inicial pensada para quem acompanha a marca, pesquisa modelos e quer acesso rápido a conteúdo útil.</Text>

        <View style={[styles.metricsRow, isCompact && styles.metricsColumn]}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricValue, { color: colors.text }]}>08</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Modelos em catálogo</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.metricValue, { color: colors.text }]}>4 áreas</Text>
            <Text style={[styles.metricLabel, { color: colors.mutedText }]}>Carros, loja, novidades e suporte</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Atalhos rápidos</Text>
        <View style={[styles.quickGrid, isCompact && styles.quickGridStack]}>
          {quickLinks.map((item) => (
            <Pressable key={item.label} onPress={() => router.push(item.route as never)} style={({ pressed }) => [styles.quickCard, { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.92 : 1 }]}>
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.quickSubtitle, { color: colors.mutedText }]}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Novidades e destaques</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Conteúdo editorial e informações úteis para quem gosta da Ford.</Text>

        <View style={styles.newsList}>
          {highlights.map((item) => (
            <Pressable key={item.id} style={({ pressed }) => [styles.newsCard, { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.94 : 1 }]} onPress={() => router.push(item.route as never)}>
              <Text style={[styles.newsTag, { color: colors.accent }]}>{item.tag}</Text>
              <Text style={[styles.newsTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.newsText, { color: colors.mutedText }]}>{item.text}</Text>
              <Text style={[styles.newsAction, { color: colors.tint }]}>{item.action}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Montar análise</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Preencha os campos abaixo para abrir a ficha técnica.</Text>

        <Text style={[styles.label, { color: colors.text }]}>Marca</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex: Ford"
          placeholderTextColor={colors.mutedText}
          value={marca}
          onChangeText={setMarca}
        />

        <Text style={[styles.label, { color: colors.text }]}>Modelo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex: Ranger"
          placeholderTextColor={colors.mutedText}
          value={modelo}
          onChangeText={setModelo}
        />

        <Text style={[styles.label, { color: colors.text }]}>Versão</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex: XLS"
          placeholderTextColor={colors.mutedText}
          value={versao}
          onChangeText={setVersao}
        />

        <Text style={[styles.label, { color: colors.text }]}>Atributos técnicos</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Ex: Motor 2.0 Turbo, tração 4x4, pacote premium"
          placeholderTextColor={colors.mutedText}
          value={atributos}
          onChangeText={setAtributos}
          multiline
        />

        <Pressable style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.tint, opacity: pressed ? 0.92 : 1 }]} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Gerar especificações</Text>
        </Pressable>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 32,
    gap: 18,
  },
  shell: {
    width: "100%",
    gap: 18,
    alignSelf: "center",
  },
  hero: {
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 620,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricsColumn: {
    flexDirection: "column",
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  quickGrid: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  quickGridStack: {
    flexDirection: "column",
  },
  quickCard: {
    flexGrow: 1,
    minWidth: 145,
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  quickSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  newsList: {
    gap: 10,
  },
  newsCard: {
    borderRadius: 22,
    padding: 16,
    gap: 6,
  },
  newsTag: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  newsTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  newsText: {
    fontSize: 14,
    lineHeight: 21,
  },
  newsAction: {
    fontSize: 13,
    fontWeight: "800",
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 84,
    justifyContent: "space-between",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  formCard: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: 6,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
