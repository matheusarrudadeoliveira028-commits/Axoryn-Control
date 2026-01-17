// app/(tabs)/explore.tsx
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { supabase } from '@/services/supabase';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TabTwoScreen() {

  const handleSair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Erro", error.message);
  };

  const handleExcluirConta = async () => {
    Alert.alert(
      "Tem certeza?",
      "Isso apagará sua conta e todos os dados para sempre.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "SIM, EXCLUIR", 
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.rpc('delete_user');
              if (error) throw error;
              await supabase.auth.signOut();
              Alert.alert("Conta Excluída", "Tchau! 👋");
            } catch (error: any) {
              Alert.alert("Erro", "Erro ao excluir: " + error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Configurações
        </ThemedText>
      </ThemedView>

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.btnLogout} onPress={handleSair}>
          <IconSymbol name="arrow.right.square" size={20} color="#333" />
          <ThemedText style={styles.txtLogout}>Sair da Conta</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDelete} onPress={handleExcluirConta}>
          <IconSymbol name="trash" size={20} color="#FFF" />
          <ThemedText style={styles.txtDelete}>Excluir Minha Conta</ThemedText>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { color: '#808080', bottom: -90, left: -35, position: 'absolute' },
  titleContainer: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  contentContainer: { marginTop: 20, gap: 15 },
  btnLogout: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E0E0', padding: 15, borderRadius: 10, gap: 10 },
  txtLogout: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  btnDelete: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, gap: 10, justifyContent: 'center' },
  txtDelete: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});