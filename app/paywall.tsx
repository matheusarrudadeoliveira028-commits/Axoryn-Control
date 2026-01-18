import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Se der erro nestes imports, me avise que criamos eles:
import { IconSymbol } from '@/components/ui/icon-symbol';
import { verificarAcesso } from '@/services/subscription';
import { router } from 'expo-router';

export default function PaywallScreen() {
  const [loading, setLoading] = useState(false);

  // Seus links do Stripe
  const LINK_MENSAL = 'https://buy.stripe.com/SEU_LINK_AQUI_MENSAL'; 
  const LINK_ANUAL = 'https://buy.stripe.com/SEU_LINK_AQUI_ANUAL';

  const abrirPagamento = (link: string) => {
    Linking.openURL(link);
  };

  const checarNovamente = async () => {
    setLoading(true);
    try {
        // Tenta verificar o acesso
        const temAcesso = await verificarAcesso();
        
        if (temAcesso) {
          Alert.alert("Sucesso!", "Pagamento confirmado. Bem-vindo de volta!");
          router.replace('/(tabs)');
        } else {
          Alert.alert("Ainda não identificado", "Se você já pagou, aguarde alguns instantes.");
        }
    } catch (error) {
        // Se a função não existir ou der erro, libera o acesso para teste (provisório)
        console.log("Erro ao verificar acesso (modo dev):", error);
        Alert.alert("Modo Dev", "Pulando verificação...");
        router.replace('/(tabs)');
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ícone de aviso/pagamento */}
      <IconSymbol name="house.fill" size={80} color="#2980B9" /> 
      
      <Text style={styles.titulo}>Seu Teste Grátis Acabou</Text>
      <Text style={styles.descricao}>
        Espero que você tenha gostado do Axoryn Control! Para continuar, escolha um plano abaixo.
      </Text>

      <View style={styles.card}>
        <Text style={styles.planoNome}>Mensal</Text>
        <Text style={styles.preco}>R$ 29,90<Text style={styles.mes}>/mês</Text></Text>
        <TouchableOpacity style={styles.btnAssinar} onPress={() => abrirPagamento(LINK_MENSAL)}>
          <Text style={styles.txtBtn}>ASSINAR MENSAL</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.destaque]}>
        <View style={styles.tag}><Text style={styles.tagTxt}>MELHOR VALOR</Text></View>
        <Text style={styles.planoNome}>Anual</Text>
        <Text style={styles.preco}>R$ 299,90<Text style={styles.mes}>/ano</Text></Text>
        <Text style={styles.economia}>Economize 2 meses</Text>
        <TouchableOpacity style={styles.btnAssinar} onPress={() => abrirPagamento(LINK_ANUAL)}>
          <Text style={styles.txtBtn}>ASSINAR ANUAL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnRefresh} onPress={checarNovamente} disabled={loading}>
        <Text style={styles.txtRefresh}>{loading ? "Verificando..." : "Já paguei / Atualizar"}</Text>
      </TouchableOpacity>
      
      {/* Botão Secreto para sair da tela enquanto você desenvolve */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{marginTop: 30}}>
         <Text style={{color: '#ccc', fontSize: 12}}>Sair (Modo Dev)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20, textAlign: 'center' },
  descricao: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 20, lineHeight: 22 },
  card: { backgroundColor: '#FFF', width: '100%', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 3 },
  destaque: { borderColor: '#2980B9', borderWidth: 2 },
  planoNome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  preco: { fontSize: 32, fontWeight: 'bold', color: '#2C3E50', marginVertical: 10 },
  mes: { fontSize: 16, color: '#999', fontWeight: 'normal' },
  btnAssinar: { backgroundColor: '#2980B9', width: '100%', padding: 15, borderRadius: 8, alignItems: 'center' },
  txtBtn: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  tag: { position: 'absolute', top: -12, backgroundColor: '#F1C40F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagTxt: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  economia: { color: '#27AE60', fontWeight: 'bold', marginBottom: 10 },
  btnRefresh: { marginTop: 20, padding: 10 },
  txtRefresh: { color: '#2980B9', fontSize: 16, fontWeight: 'bold' }
});