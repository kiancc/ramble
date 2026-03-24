import { StyleSheet, Text, View } from 'react-native';

export function VaultScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>Vault</Text>
      <Text style={styles.title}>All captured tasks</Text>
      <Text style={styles.copy}>
        This is the full archive. We will later group tasks by category and add filters.
      </Text>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Nothing captured yet</Text>
        <Text style={styles.emptyCopy}>
          Once voice entries are saved, they will appear here for deep review.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
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
});
