import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Task } from '../types/task';

type TaskDetailModalProps = {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
};

type FieldRowProps = {
  label: string;
  value: string;
};

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return 'null';
  }

  return new Date(value).toLocaleString();
}

export function TaskDetailModal({ task, visible, onClose }: TaskDetailModalProps) {
  if (!task) {
    return null;
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.heading}>Task schema detail</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.taskTitle}>{task.taskName}</Text>

            <FieldRow label="id" value={task.id} />
            <FieldRow label="taskName" value={task.taskName} />
            <FieldRow label="category" value={task.category} />
            <FieldRow label="taskSize" value={task.taskSize} />
            <FieldRow label="energyLevel" value={task.energyLevel} />
            <FieldRow label="status" value={task.status} />
            <FieldRow label="oraclePlacement" value={task.oraclePlacement} />
            <FieldRow label="deadline" value={formatDate(task.deadline)} />
            <FieldRow label="createdAt" value={formatDate(task.createdAt)} />
            <FieldRow label="nextPhysicalAction" value={task.nextPhysicalAction} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>icnuScores</Text>
              <View style={styles.icnuCard}>
                <Text style={styles.icnuText}>interest: {task.icnuScores.interest}</Text>
                <Text style={styles.icnuText}>challenge: {task.icnuScores.challenge}</Text>
                <Text style={styles.icnuText}>novelty: {task.icnuScores.novelty}</Text>
                <Text style={styles.icnuText}>urgency: {task.icnuScores.urgency}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 14, 8, 0.42)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: '#fff8ea',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: '#d7c8aa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e7dbc3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d2617',
  },
  closeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#9f8b65',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  closeButtonText: {
    color: '#2d2617',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
    gap: 10,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2d2617',
    marginBottom: 2,
  },
  row: {
    gap: 4,
    borderWidth: 1,
    borderColor: '#e7dbc3',
    borderRadius: 12,
    backgroundColor: '#fffdf8',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b6e52',
  },
  rowValue: {
    fontSize: 14,
    color: '#2d2617',
    lineHeight: 20,
  },
  icnuCard: {
    backgroundColor: '#f4ecd9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d7c8aa',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 3,
  },
  icnuText: {
    fontSize: 14,
    color: '#2d2617',
  },
});
