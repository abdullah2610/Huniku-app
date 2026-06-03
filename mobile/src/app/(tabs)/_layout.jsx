import { Tabs } from 'expo-router';
import { Home, Search, Heart, MessageSquare, User } from 'lucide-react-native';
import { T } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.surface,
          borderTopWidth: 1,
          borderTopColor: T.border,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#10284014',
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarActiveTintColor: T.action,
        tabBarInactiveTintColor: T.muted,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '800',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <Home color={color} size={23} strokeWidth={color === T.action ? 2.4 : 1.9} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarIcon: ({ color }) => <Search color={color} size={23} strokeWidth={color === T.action ? 2.4 : 1.9} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorit',
          tabBarIcon: ({ color, focused }) => (
            <Heart color={color} size={23} fill={focused ? color : 'none'} strokeWidth={focused ? 0 : 1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Pesan',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={23} strokeWidth={color === T.action ? 2.4 : 1.9} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User color={color} size={23} strokeWidth={color === T.action ? 2.4 : 1.9} />,
        }}
      />
    </Tabs>
  );
}
