import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TaskDetailModal } from '../components/TaskDetailModal';
import type { OraclePlacement, Task } from '../types/task';

type OracleScreenProps = {
  tasks: Task[];
};

type OracleSection = {
  key: Extract<OraclePlacement, 'On Fire' | 'Momentum Builder' | 'Rabbit Hole'>;
  emptyText: string;
};

const oracleSections: OracleSection[] = [
  {
    key: 'On Fire',
    emptyText: 'No urgent tasks yet.',
  },
  {
    key: 'Momentum Builder',
    emptyText: 'No low-friction tasks yet.',
  },
  {
    key: 'Rabbit Hole',
    emptyText: 'No deep-work tasks yet.',
  },
];

export function OracleScreen({ tasks }: OracleScreenProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <Text style={styles.eyebrow}>Oracle</Text>
        <Text style={styles.title}>Do this next</Text>
        <Text style={styles.copy}>
          Tap any task for its full schema. Tasks are grouped by executive-function buckets.
        </Text>

        {oracleSections.map((section) => {
          const sectionTasks = tasks.filter(
            (task) => task.oraclePlacement === section.key && task.status !== 'Done',
          );

          return (
            <View key={section.key} style={styles.card}>
              <Text style={styles.cardLabel}>{section.key}</Text>

              {sectionTasks.length === 0 ? (
                <Text style={styles.cardText}>{section.emptyText}</Text>
              ) : (
                sectionTasks.slice(0, 3).map((task) => (
                  <Pressable
                    key={task.id}
                    onPress={() => setSelectedTask(task)}
                    style={styles.taskItem}
                  >
                    <Text style={styles.taskTitle}>{task.taskName}</Text>
                    <Text style={styles.taskMeta}>
                      {task.category} • {task.energyLevel} • {task.status}
                    </Text>
                    <Text style={styles.cardText}>{task.nextPhysicalAction}</Text>
                  </Pressable>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>

      <TaskDetailModal
        task={selectedTask}
        visible={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
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
    color: '#4f5c4d',
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    color: '#1f2f1c',
    fontWeight: '800',
  },
  copy: {
    color: '#3d473a',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cfc4ad',
    backgroundColor: '#f8f4eb',
    padding: 14,
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#4f5c4d',
    fontWeight: '700',
  },
  cardText: {
    color: '#2a3228',
    fontSize: 15,
  },
  taskItem: {
    gap: 2,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e6dcc9',
    marginTop: 4,
  },
  taskTitle: {
    color: '#1f2f1c',
    fontSize: 16,
    fontWeight: '700',
  },
  taskMeta: {
    color: '#51624f',
    fontSize: 12,
    marginBottom: 2,
  },
});
