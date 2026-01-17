import { verificarAcesso } from '@/services/subscription'; // Certifique-se que o caminho está certo
import { FontAwesome } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const router = useRouter();

  // --- O CÓDIGO DO "FISCAL" COMEÇA AQUI ---
  useEffect(() => {
    const protegerApp = async () => {
      // Pergunta para o serviço se o usuário pode entrar
      const acessoPermitido = await verificarAcesso();
      
      if (!acessoPermitido) {
        // Se NÃO tiver acesso (teste acabou e não pagou), manda para o Paywall
        // O 'replace' impede que ele volte usando o botão voltar do celular
        router.replace('/paywall'); 
      }
    };
    
    protegerApp();
  }, []);
  // --- FIM DO CÓDIGO DO "FISCAL" ---

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2C3E50', // Azul Escuro
      tabBarInactiveTintColor: '#999999', // Cinza
      tabBarStyle: { 
        height: 60, 
        paddingBottom: 10, 
        backgroundColor: '#FFF' 
      },
    }}>
      
      {/* 1. TELA ESQUERDA (Dashboard) -> Vira "CARTEIRA" */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Carteira', 
          tabBarIcon: ({ color }) => <FontAwesome name="money" size={24} color={color} />,
        }}
      />

      {/* 2. TELA DO MEIO (Arquivo resumo.tsx) -> Vira "RESUMO" */}
      <Tabs.Screen
        name="resumo"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
        }}
      />

      {/* --- ITENS REMOVIDOS --- */}

      {/* Remove o Explore */}
      <Tabs.Screen name="explore" options={{ href: null }} />

      {/* Garante que outros não apareçam */}
      <Tabs.Screen name="financeiro" options={{ href: null }} />
      <Tabs.Screen name="auth" options={{ href: null }} />
      <Tabs.Screen name="modal" options={{ href: null }} />
      {/* <Tabs.Screen name="tabs" options={{ href: null }} />  <- Comentei para evitar erro de rota duplicada */}
      {/* <Tabs.Screen name="(tabs)" options={{ href: null }} /> <- Comentei para evitar erro de rota duplicada */}

    </Tabs>
  );
}