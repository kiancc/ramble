import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { sendCaptureRamble } from './src/lib/captureFlow';
import { loadStoredTasks, saveStoredTasks } from './src/lib/taskStorage';
import { applyUrgencyEscalation } from './src/lib/urgency';
import { ArchiveScreen } from './src/screens/ArchiveScreen';
import { OracleScreen } from './src/screens/OracleScreen';
import type { Task } from './src/types/task';

type TabKey = 'oracle' | 'vault';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('oracle');
  const [isHydrated, setIsHydrated] = useState(false);

  const isOracle = activeTab === 'oracle';

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromStorage() {
      const storedTasks = await loadStoredTasks();
      const sourceTasks = storedTasks ?? [];
      const escalatedTasks = applyUrgencyEscalation(sourceTasks);

      if (!cancelled) {
        setTasks(escalatedTasks);
        setIsHydrated(true);
      }
    }

    hydrateFromStorage();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveStoredTasks(tasks).catch(() => {
      // Keep app responsive even if local persistence fails.
    });
  }, [tasks, isHydrated]);

  const handleCaptureSubmit = async (ramble: string) => {
    const createdTask = await sendCaptureRamble(ramble);

    setTasks((prevTasks) => applyUrgencyEscalation([createdTask, ...prevTasks]));
  };

  const handleMarkTaskDone = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'Done',
            }
          : task,
      ),
    );
  };

  return (
    <View style={styles.app}>
      <View style={styles.content}>
        {isOracle ? (
          <OracleScreen
            tasks={tasks}
            onCaptureSubmit={handleCaptureSubmit}
            onMarkTaskDone={handleMarkTaskDone}
          />
        ) : (
          <ArchiveScreen tasks={tasks} onMarkTaskDone={handleMarkTaskDone} />
        )}
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
