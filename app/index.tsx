import { supabase } from '@/services/supabase'; // Confirme se o caminho é esse mesmo
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      // Pergunta pro Supabase: "Tem alguém logado aí?"
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Se tiver logado, pode entrar
        router.replace('/(tabs)');
      } else {
        // Se NÃO tiver logado, vai pra tela de Login/Cadastro
        router.replace('/auth');
      }
    } catch (error) {
      // Se der erro, joga pro login por segurança
      router.replace('/auth');
    } finally {
      setLoading(false);
    }
  }

  // Enquanto verifica, mostra uma bolinha carregando
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}