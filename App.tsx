import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { mockTasks } from './src/data/mockTasks';
import { ArchiveScreen } from './src/screens/ArchiveScreen';
import { OracleScreen } from './src/screens/OracleScreen';

type TabKey = 'oracle' | 'vault';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('oracle');

  const isOracle = activeTab === 'oracle';

  return (
    <View style={styles.app}>
      <View style={styles.content}>
        {isOracle ? <OracleScreen tasks={mockTasks} /> : <ArchiveScreen tasks={mockTasks} />}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('oracle')}
          style={[styles.tabButton, isOracle && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, isOracle && styles.tabTextActive]}>Oracle</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('vault')}
          style={[styles.tabButton, !isOracle && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, !isOracle && styles.tabTextActive]}>Vault</Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f4f0e6',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#d7d0c0',
    backgroundColor: '#eee6d7',
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#bcae8f',
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#22321f',
    borderColor: '#22321f',
  },
  tabText: {
    color: '#22321f',
    fontWeight: '600',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#f3ecd9',
  },
});
