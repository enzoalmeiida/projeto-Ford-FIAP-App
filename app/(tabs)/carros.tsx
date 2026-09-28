import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsiveLayout } from "@/hooks/use-responsive";
import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { carrosCatalogo } from "./carrosData";

export default function CarrosScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { pagePadding, contentMaxWidth, titleSize, bodyTextSize, imageHeight, isTablet } = useResponsiveLayout();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: pagePadding }]}>
      <View style={[styles.shell, { maxWidth: contentMaxWidth }]}>
      <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.kicker, { color: colors.accent }]}>Catálogo premium</Text>
        <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Lista de carros Ford</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText, fontSize: bodyTextSize }]}>Selecione um veículo para abrir a ficha com apresentação mais refinada.</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={carrosCatalogo}
        keyExtractor={(item) => item.id}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? styles.columnGap : undefined}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border, flex: isTablet ? 1 : undefined },
            ]}
            onPress={() => router.push({ pathname: "/specs", params: { modelo: item.nome } })}
          >
            <Image source={item.foto} style={[styles.image, { height: imageHeight }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={[styles.text, { color: colors.text }]}>{item.nome}</Text>
                <Text style={[styles.chevron, { color: colors.accent }]}>›</Text>
              </View>
              <Text style={[styles.details, { color: colors.mutedText }]}>{item.subtitulo}</Text>
              <View style={styles.pillRow}>
                <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
                  <Text style={[styles.pillLabel, { color: colors.accent }]}>Motor</Text>
                  <Text style={[styles.pillValue, { color: colors.text }]}>{item.motor}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: colors.surfaceMuted }]}>
                  <Text style={[styles.pillLabel, { color: colors.mutedText }]}>Potência</Text>
                  <Text style={[styles.pillValue, { color: colors.text }]}>{item.potencia}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaText, { color: colors.mutedText }]}>{item.categoria}</Text>
                <Text style={[styles.metaText, { color: colors.tint }]}>{item.precoReferencia}</Text>
              </View>
              <Text style={[styles.highlight, { color: colors.text }]}>{item.destaque}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  shell: {
    width: "100%",
    flex: 1,
    gap: 16,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    gap: 8,
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
  listContent: {
    gap: 14,
    paddingBottom: 24,
  },
  columnGap: {
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  image: {
    width: "100%",
    aspectRatio: 1.48,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
  },
  chevron: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "400",
  },
  details: {
    fontSize: 14,
    lineHeight: 21,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  pillValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  highlight: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
});


