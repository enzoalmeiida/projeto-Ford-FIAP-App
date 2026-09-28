import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useResponsiveLayout } from "@/hooks/use-responsive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type PecaItem = {
  id: string;
  nome: string;
  preco: number;
  estoque: "Disponível" | "Sob encomenda";
  categoria: string;
  compatibilidade: string;
  descricao: string;
};

const pecas: PecaItem[] = [
  {
    id: "1",
    nome: "Filtro de Óleo Motorcraft",
    preco: 80,
    estoque: "Disponível",
    categoria: "Manutenção",
    compatibilidade: "Ranger, Maverick, Territory",
    descricao: "Indicado para revisões periódicas e proteção do motor.",
  },
  {
    id: "2",
    nome: "Pastilha de Freio Premium",
    preco: 250,
    estoque: "Disponível",
    categoria: "Freios",
    compatibilidade: "Ranger, Edge, F-150",
    descricao: "Mais estabilidade na frenagem em uso urbano e rodoviário.",
  },
  {
    id: "3",
    nome: "Amortecedor de Suspensão",
    preco: 600,
    estoque: "Sob encomenda",
    categoria: "Suspensão",
    compatibilidade: "Ranger, Bronco",
    descricao: "Ideal para recuperar conforto, estabilidade e controle.",
  },
  {
    id: "4",
    nome: "Bateria 60Ah",
    preco: 480,
    estoque: "Disponível",
    categoria: "Elétrica",
    compatibilidade: "Mustang, Maverick, Territory",
    descricao: "Boa reserva de energia para sistemas modernos e multimídia.",
  },
  {
    id: "5",
    nome: "Filtro de Ar",
    preco: 120,
    estoque: "Disponível",
    categoria: "Manutenção",
    compatibilidade: "Linha Ford diesel e turbo",
    descricao: "Ajuda na respiração do motor e na eficiência de consumo.",
  },
  {
    id: "6",
    nome: "Disco de Freio",
    preco: 350,
    estoque: "Sob encomenda",
    categoria: "Freios",
    compatibilidade: "Ranger, Bronco, Edge",
    descricao: "Reposição recomendada para manutenção preventiva.",
  },
  {
    id: "7",
    nome: "Correia Dentada",
    preco: 200,
    estoque: "Disponível",
    categoria: "Motor",
    compatibilidade: "Motores selecionados da linha Ford",
    descricao: "Item crítico para a saúde do conjunto mecânico.",
  },
  {
    id: "8",
    nome: "Velas de Ignição",
    preco: 150,
    estoque: "Disponível",
    categoria: "Motor",
    compatibilidade: "Mustang, Maverick, Territory",
    descricao: "Melhora partida, desempenho e resposta do acelerador.",
  },
  {
    id: "9",
    nome: "Radiador",
    preco: 750,
    estoque: "Sob encomenda",
    categoria: "Arrefecimento",
    compatibilidade: "Linha utilitária e SUVs",
    descricao: "Ajuda a manter a temperatura ideal em uso severo.",
  },
  {
    id: "10",
    nome: "Farol LED",
    preco: 1200,
    estoque: "Disponível",
    categoria: "Iluminação",
    compatibilidade: "Ranger, F-150, Bronco",
    descricao: "Upgrade visual e funcional para dirigir à noite.",
  },
  {
    id: "11",
    nome: "Sensor ABS",
    preco: 300,
    estoque: "Disponível",
    categoria: "Segurança",
    compatibilidade: "Ranger, Edge, Territory",
    descricao: "Essencial para manutenção dos sistemas de frenagem.",
  },
];

export default function PecasScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const { pagePadding, contentMaxWidth, titleSize, bodyTextSize, isCompact } = useResponsiveLayout();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("@ford-fiap/store/cart")
      .then((storedCart) => {
        if (!active || !storedCart) return;
        const parsedCart: unknown = JSON.parse(storedCart);
        if (parsedCart && typeof parsedCart === "object" && !Array.isArray(parsedCart)) {
          const validCart = Object.fromEntries(Object.entries(parsedCart).filter(([id, quantity]) =>
            pecas.some((item) => item.id === id) && Number.isInteger(quantity) && Number(quantity) > 0
          )) as Record<string, number>;
          setCart(validCart);
        }
      })
      .catch(() => undefined)
      .finally(() => { if (active) setIsCartReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isCartReady) AsyncStorage.setItem("@ford-fiap/store/cart", JSON.stringify(cart)).catch(() => undefined);
  }, [cart, isCartReady]);

  const categories = useMemo(() => ["Todas", ...Array.from(new Set(pecas.map((item) => item.categoria)))], []);
  const visibleParts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    return pecas.filter((item) => {
      const matchesCategory = category === "Todas" || item.categoria === category;
      const matchesSearch = !normalizedSearch || `${item.nome} ${item.categoria} ${item.compatibilidade}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartItems = useMemo(() => {
    return pecas
      .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
      .filter((item) => item.quantity > 0);
  }, [cart]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.preco * item.quantity, 0);
  const shipping = subtotal > 0 ? 29.9 : 0;
  const total = subtotal + shipping;

  const addItem = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCart((current) => {
      const currentQuantity = current[id] ?? 0;

      if (currentQuantity <= 1) {
        const next = { ...current };
        delete next[id];
        return next;
      }

      return { ...current, [id]: currentQuantity - 1 };
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);

  const handleCheckout = () => {
    if (totalItems === 0) {
      Alert.alert("Carrinho vazio", "Adicione pelo menos um item antes de continuar.");
      return;
    }
    Alert.alert("Pedido registrado", `Seu pedido demonstrativo com ${totalItems} item(ns), no total de ${formatCurrency(total)}, foi registrado neste dispositivo.`, [
      { text: "OK", onPress: () => setCart({}) },
    ]);
  };

  const productColumns = isCompact ? 1 : 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: pagePadding }]}>
      <View style={[styles.shell, { maxWidth: contentMaxWidth }]}>
        <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.kicker, { color: colors.accent }]}>Loja Ford</Text>
          <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>Catálogo de peças e acessórios</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText, fontSize: bodyTextSize }]}>Monte seu carrinho com itens de manutenção, segurança e personalização para sua Ford.</Text>
          <View style={styles.heroStats}>
            <View style={[styles.heroStat, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.heroStatValue, { color: colors.text }]}>{pecas.length}</Text>
              <Text style={[styles.heroStatLabel, { color: colors.mutedText }]}>Itens</Text>
            </View>
            <View style={[styles.heroStat, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.heroStatValue, { color: colors.text }]}>{totalItems}</Text>
              <Text style={[styles.heroStatLabel, { color: colors.mutedText }]}>No carrinho</Text>
            </View>
            <View style={[styles.heroStat, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.heroStatValue, { color: colors.text }]}>{formatCurrency(total)}</Text>
              <Text style={[styles.heroStatLabel, { color: colors.mutedText }]}>Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.filters}>
          <TextInput
            accessibilityLabel="Buscar peças"
            style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="Buscar peça, categoria ou modelo"
            placeholderTextColor={colors.mutedText}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: category === item }}
                onPress={() => setCategory(item)}
                style={[styles.categoryChip, { backgroundColor: category === item ? colors.tint : colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.categoryChipText, { color: category === item ? "#fff" : colors.text }]}>{item}</Text>
              </Pressable>
            )}
          />
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleParts}
          keyExtractor={(item) => item.id}
          numColumns={productColumns}
          columnWrapperStyle={productColumns > 1 ? styles.columnGap : undefined}
          ListFooterComponent={
            <View style={[styles.cartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Carrinho</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>
                Itens escolhidos, subtotal e fechamento da compra.
              </Text>

              {cartItems.length > 0 ? (
                <View style={styles.cartList}>
                  {cartItems.map((item) => (
                    <View key={item.id} style={[styles.cartRow, { backgroundColor: colors.surfaceMuted }]}>
                      <View style={styles.cartRowText}>
                        <Text style={[styles.cartItemName, { color: colors.text }]}>{item.nome}</Text>
                        <Text style={[styles.cartItemMeta, { color: colors.mutedText }]}>
                          {item.quantity}x {formatCurrency(item.preco)}
                        </Text>
                      </View>
                      <View style={styles.cartActions}>
                        <Pressable onPress={() => removeItem(item.id)} style={[styles.qtyButton, { borderColor: colors.border }]}>
                          <Text style={[styles.qtyButtonText, { color: colors.text }]}>-</Text>
                        </Pressable>
                        <Text style={[styles.qtyValue, { color: colors.text }]}>{item.quantity}</Text>
                        <Pressable onPress={() => addItem(item.id)} style={[styles.qtyButton, { borderColor: colors.border }]}>
                          <Text style={[styles.qtyButtonText, { color: colors.text }]}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.emptyCart, { color: colors.mutedText }]}>Seu carrinho está vazio. Adicione itens da lista acima.</Text>
              )}

              <View style={styles.totalsBox}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.mutedText }]}>Subtotal</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.mutedText }]}>Frete</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>{shipping > 0 ? formatCurrency(shipping) : 'A calcular'}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>{formatCurrency(total)}</Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.checkoutButton, { backgroundColor: colors.tint, opacity: pressed ? 0.92 : 1 }]}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>{totalItems > 0 ? 'Finalizar compra' : 'Adicionar itens para comprar'}</Text>
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            <View style={[styles.cartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Nenhuma peça encontrada</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]}>Tente outro termo ou selecione a categoria “Todas”.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const quantity = cart[item.id] ?? 0;

            return (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, productColumns > 1 && styles.cardHalf]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
                    <Text style={[styles.price, { color: colors.tint }]}>{formatCurrency(item.preco)}</Text>
                  </View>
                  <Text style={[styles.estoque, { color: item.estoque === 'Disponível' ? colors.success : colors.warning }]}>
                    {item.estoque}
                  </Text>
                </View>

                <Text style={[styles.category, { color: colors.accent }]}>{item.categoria}</Text>
                <Text style={[styles.description, { color: colors.mutedText }]}>{item.descricao}</Text>
                <Text style={[styles.compatibility, { color: colors.text }]}>Compatível com: {item.compatibilidade}</Text>

                <View style={styles.buyRow}>
                  <Pressable
                    onPress={() => addItem(item.id)}
                    style={({ pressed }) => [styles.buyButton, { backgroundColor: colors.tint, opacity: pressed ? 0.92 : 1 }]}
                  >
                    <Text style={styles.buyButtonText}>Comprar</Text>
                  </Pressable>

                  {quantity > 0 ? (
                    <View style={[styles.qtyChip, { backgroundColor: colors.surfaceMuted }]}>
                      <Pressable onPress={() => removeItem(item.id)} style={styles.qtyInlineButton}>
                        <Text style={[styles.qtyInlineText, { color: colors.text }]}>-</Text>
                      </Pressable>
                      <Text style={[styles.qtyInlineValue, { color: colors.text }]}>{quantity}</Text>
                      <Pressable onPress={() => addItem(item.id)} style={styles.qtyInlineButton}>
                        <Text style={[styles.qtyInlineText, { color: colors.text }]}>+</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View style={[styles.qtyChip, { backgroundColor: colors.surfaceMuted }]}>
                      <Text style={[styles.qtyHint, { color: colors.mutedText }]}>Carrinho vazio</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  shell: { width: "100%", gap: 16 },
  hero: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    gap: 8,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  heroStat: {
    flex: 1,
    borderRadius: 18,
    padding: 12,
    gap: 2,
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  heroStatLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  kicker: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: { fontSize: 30, lineHeight: 34, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  listContent: { gap: 12, paddingBottom: 24 },
  filters: { gap: 10, marginBottom: 4 },
  searchInput: { minHeight: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 15 },
  categoryList: { gap: 8, paddingVertical: 2 },
  categoryChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  categoryChipText: { fontSize: 13, fontWeight: '700' },
  columnGap: { gap: 12 },
  card: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardHalf: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  nome: { flex: 1, fontSize: 17, fontWeight: "800" },
  price: { fontSize: 15, fontWeight: "800", marginTop: 4 },
  estoque: { fontSize: 12, fontWeight: "800", textTransform: 'uppercase' },
  category: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  description: { fontSize: 14, lineHeight: 20 },
  compatibility: { fontSize: 13, lineHeight: 19, fontWeight: '700' },
  buyRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 4 },
  buyButton: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  qtyChip: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8, gap: 10 },
  qtyInlineButton: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qtyInlineText: { fontSize: 16, fontWeight: '800' },
  qtyInlineValue: { minWidth: 18, textAlign: 'center', fontWeight: '800' },
  qtyHint: { fontSize: 12, fontWeight: '700' },
  cartCard: { borderRadius: 28, borderWidth: 1, padding: 18, gap: 12 },
  cartList: { gap: 10 },
  cartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderRadius: 18, padding: 14 },
  cartRowText: { flex: 1, gap: 2 },
  cartItemName: { fontSize: 14, fontWeight: '800' },
  cartItemMeta: { fontSize: 12, lineHeight: 18 },
  cartActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyButtonText: { fontSize: 16, fontWeight: '800' },
  qtyValue: { minWidth: 18, textAlign: 'center', fontWeight: '800' },
  emptyCart: { fontSize: 14, lineHeight: 20 },
  totalsBox: { gap: 10, paddingTop: 6 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  totalLabel: { fontSize: 13, fontWeight: '700' },
  totalValue: { fontSize: 15, fontWeight: '800' },
  checkoutButton: { borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  checkoutButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
