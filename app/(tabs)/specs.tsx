import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsiveLayout } from "@/hooks/use-responsive";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { carrosData } from "./carrosData";

export default function SpecsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { pagePadding, contentMaxWidth, titleSize, bodyTextSize, imageHeight, isCompact } = useResponsiveLayout();
  const { marca, modelo, versao, atributos, nome } = useLocalSearchParams<{
    marca?: string;
    modelo?: string;
    versao?: string;
    atributos?: string;
    nome?: string;
  }>();

  const modelQuery = [nome, modelo].find((value) => typeof value === "string" && value.trim().length > 0)?.trim();
  const normalizedModelQuery = modelQuery?.toLocaleLowerCase("pt-BR");
  const searchKey = normalizedModelQuery
    ? (Object.keys(carrosData) as (keyof typeof carrosData)[]).find((key) => {
        const entry = carrosData[key];
        return key.toLocaleLowerCase("pt-BR") === normalizedModelQuery ||
          entry.modelo.toLocaleLowerCase("pt-BR") === normalizedModelQuery ||
          key.toLocaleLowerCase("pt-BR").replace(/^ford\s+/, "") === normalizedModelQuery;
      })
    : undefined;
  const dados = searchKey ? carrosData[searchKey] : null;
  const atributosManuais =
    typeof atributos === "string" && atributos.length > 0
      ? atributos.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  const atributosExibidos = dados?.atributos ?? atributosManuais;
  const marcaExibida = dados?.marca ?? marca ?? "Ford";
  const modeloExibido = dados?.modelo ?? modelo ?? "Informe um modelo";
  const versaoExibida = dados?.versao ?? versao ?? "-";

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background, padding: pagePadding }]}>
      <View style={[styles.shell, { maxWidth: contentMaxWidth }]}>
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.kicker, { color: colors.accent }]}>Ficha técnica</Text>
        <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>{marcaExibida} {modeloExibido}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText, fontSize: bodyTextSize }]}>Visual executivo com os dados que você enviou e os atributos reconhecidos da base.</Text>

        <View style={[styles.heroMeta, isCompact && styles.heroMetaColumn]}>
          <View style={[styles.metaChip, { backgroundColor: colors.surfaceMuted }]}>
            <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Versão</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{versaoExibida}</Text>
          </View>
          <View style={[styles.metaChip, { backgroundColor: colors.surfaceMuted }]}>
            <Text style={[styles.metaLabel, { color: colors.mutedText }]}>Itens</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{atributosExibidos.length}</Text>
          </View>
        </View>
      </View>

      {dados ? (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.grid, isCompact && styles.gridStack]}>
            <View style={[styles.infoCard, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedText }]}>Marca</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{dados.marca}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.infoLabel, { color: colors.mutedText }]}>Modelo</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{dados.modelo}</Text>
            </View>
          </View>

          {dados.foto ? <Image source={dados.foto} style={[styles.image, { height: imageHeight }]} /> : null}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Atributos principais</Text>
          <View style={styles.attributesList}>
            {atributosExibidos.length > 0 ? (
              atributosExibidos.map((attr: string, index: number) => (
                <View key={`${attr}-${index}`} style={[styles.attributeItem, { borderColor: colors.border }]}>
                  <View style={[styles.dot, { backgroundColor: colors.tint }]} />
                  <Text style={[styles.attributeText, { color: colors.text }]}>{attr}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.mutedText }]}>Nenhum atributo disponível para esta consulta.</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nenhum dado encontrado</Text>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>Use a home ou a lista de carros para carregar um modelo reconhecido pela base.</Text>
        </View>
      )}

      <Pressable style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.tint, opacity: pressed ? 0.92 : 1 }]} onPress={() => router.push("/carros")}>
        <Text style={styles.primaryButtonText}>Voltar para carros</Text>
      </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    gap: 16,
    paddingBottom: 28,
  },
  shell: {
    width: "100%",
    gap: 16,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroMeta: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  heroMetaColumn: {
    flexDirection: "column",
  },
  metaChip: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  gridStack: {
    flexDirection: "column",
  },
  infoCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: "800",
  },
  image: {
    width: "100%",
    aspectRatio: 1.55,
    borderRadius: 22,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  attributesList: {
    gap: 10,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 5,
  },
  attributeText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
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
