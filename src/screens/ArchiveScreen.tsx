import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TaskDetailModal } from '../components/TaskDetailModal';
import type { Task } from '../types/task';

type ArchiveScreenProps = {
  tasks: Task[];
  onMarkTaskDone: (taskId: string) => void;
};

function groupTasksByCategory(tasks: Task[]) {
  return tasks.reduce<Record<string, Task[]>>((groups, task) => {
    groups[task.category] ??= [];
    groups[task.category].push(task);
    return groups;
  }, {});
}

export function ArchiveScreen({ tasks, onMarkTaskDone }: ArchiveScreenProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const visibleTasks = showCompleted ? tasks : tasks.filter((task) => task.status !== 'Done');
  const grouped = groupTasksByCategory(visibleTasks);
  const categories = Object.keys(grouped).sort();

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Vault</Text>
        <Text style={styles.title}>All captured tasks</Text>
        <Text style={styles.copy}>Tap a task to inspect its full schema details.</Text>

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setShowCompleted((value) => !value)}
            style={[styles.filterChip, showCompleted && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, showCompleted && styles.filterChipTextActive]}>
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Text>
          </Pressable>
        </View>

        {categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing captured yet</Text>
            <Text style={styles.emptyCopy}>
              Once voice entries are saved, they will appear here for deep review.
            </Text>
          </View>
        ) : (
          categories.map((category) => (
            <View key={category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{category}</Text>

              {grouped[category].map((task) => (
                <Pressable
                  key={task.id}
                  onPress={() => setSelectedTask(task)}
                  style={styles.taskRow}
                >
                  <Text style={styles.taskName}>{task.taskName}</Text>
                  <Text style={styles.taskMeta}>
                    {task.status} • {task.energyLevel} • {task.oraclePlacement}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <TaskDetailModal
        task={selectedTask}
        visible={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onMarkDone={(taskId) => {
          onMarkTaskDone(taskId);
          setSelectedTask(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 12,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    color: '#5f4e2f',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    color: '#2d2617',
    fontWeight: '800',
  },
  copy: {
    color: '#50462f',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#9f8b65',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff6df',
  },
  filterChipActive: {
    borderColor: '#4f5c4d',
    backgroundColor: '#e4efe1',
  },
  filterChipText: {
    color: '#5a4f36',
    fontSize: 13,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#2f4a2d',
  },
  emptyState: {
    marginTop: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7c8aa',
    backgroundColor: '#fff9eb',
    padding: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2617',
  },
  emptyCopy: {
    fontSize: 15,
    color: '#5a4f36',
    lineHeight: 20,
  },
  categoryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7c8aa',
    backgroundColor: '#fff9eb',
    padding: 14,
    gap: 8,
  },
  categoryTitle: {
    color: '#443820',
    fontSize: 16,
    fontWeight: '700',
  },
  taskRow: {
    borderTopWidth: 1,
    borderTopColor: '#e7dbc3',
    paddingTop: 8,
    gap: 2,
  },
  taskName: {
    fontSize: 15,
    color: '#2d2617',
    fontWeight: '600',
  },
  taskMeta: {
    fontSize: 12,
    color: '#665b44',
  },
});
