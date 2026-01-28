import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../i18n'; // <--- AQUI: Inicializa as traduções antes de tudo
import { supabase } from '../services/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsMounted(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Identifica onde o usuário está
    const inTabsGroup = segments[0] === '(tabs)';
    const inAuthGroup = segments[0] === 'auth';
    const inResetPassword = segments[0] === 'reset-password';
    const inPaywall = segments[0] === 'paywall'; // ✅ NOVO: Reconhece o Paywall

    if (session) {
      // --- USUÁRIO LOGADO ---
      
      // 1. Se tentar voltar pra tela de login, joga pra Home
      if (inAuthGroup) {
        router.replace('/(tabs)');
      } 
      // 2. Se estiver perdido (fora das abas, fora do reset e FORA DO PAYWALL), joga pra Home.
      // AQUI ESTAVA O ERRO: Adicionamos '!inPaywall' para ele não tirar a pessoa de lá.
      else if (!inTabsGroup && !inResetPassword && !inPaywall) {
        router.replace('/(tabs)');
      }

    } else {
      // --- USUÁRIO DESLOGADO ---
      
      // Se tentar acessar Abas ou Paywall sem conta, manda pro Login
      if (inTabsGroup || inPaywall) {
        router.replace('/auth');
      }
      // Nota: Não bloqueamos o 'reset-password' para permitir recuperar senha
    }
  }, [session, isMounted, segments]);

  if (!isMounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="paywall" /> 
      {/* Adicionei o paywall na stack para a transição ser suave */}
      
      <Stack.Screen name="reset-password" /> 
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}