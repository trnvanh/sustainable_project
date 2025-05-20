import React from 'react';
import { Stack, useNavigation, useRouter, usePathname, Slot } from 'expo-router';
import { Pressable, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
//import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

function AppLayout() {
  const navigation = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  //const { user } = useAuth();
  const user = useAuthStore((state) => state.user);

  const hideNavRoutes = ['/login', '/register', '/welcome', '/prelogin', '/email-signup', '/offer'];

  const shouldShowNav = user && !hideNavRoutes.includes(pathname);

  return (
    <View style={{ flex: 1, paddingBottom: shouldShowNav ? 70 : 0 }}>
      <Slot />
      {shouldShowNav && (
        <View style={styles.navBar}>
          <NavItem
            icon="search"
            label="Explore"
            active={pathname === '/explore'}
            onPress={() => router.push('/explore')}
          />
          <NavItem
            icon="heart"
            label="Favorite"
            active={pathname === '/favorite'}
            onPress={() => router.push('/favorite')}
          />
          <NavItem
            icon="person"
            label="Profile"
            active={pathname === '/profile'}
            onPress={() => router.push('/profile')}
          />
          <NavItem
            icon="cart"
            label="Orders"
            active={pathname === '/orders'}
            onPress={() => router.push('/orders')}
          />
        </View>
      )}
    </View>
  );
}

// Wrapping AppLayout with AuthProvider
// export default function LayoutWrapper() {
//   return (
//     <AuthProvider>
//       <AppLayout />
//     </AuthProvider>
//   );
// }
export default AppLayout;


function NavItem({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons
        name={active ? icon : `${icon}-outline`}
        size={24}
        color={active ? '#ff6600' : '#fff'}
      />
      <Text style={[styles.navLabel, { color: active ? '#ff6600' : '#fff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: '#16423C',
    borderTopWidth: 1,
    borderTopColor: '#16423C',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
