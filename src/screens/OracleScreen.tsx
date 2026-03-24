import { StyleSheet, Text, View } from 'react-native';

export function OracleScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>Oracle</Text>
      <Text style={styles.title}>Do this next</Text>
      <Text style={styles.copy}>
        This is your triage feed. Next, we will plug in On Fire, Momentum Builders, and
        Rabbit Holes.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>On Fire</Text>
        <Text style={styles.cardText}>No urgent tasks yet.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Momentum Builder</Text>
        <Text style={styles.cardText}>No low-friction tasks yet.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Rabbit Hole</Text>
        <Text style={styles.cardText}>No deep-work tasks yet.</Text>
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
});
