import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SpecificationsTable = ({ specifications }) => {
  return (
    <View style={styles.specificationsContainer}>
      <Text style={styles.specificationsTitle}>Specifications:</Text>
      <View style={styles.specificationTable}>
        {specifications.map(({ label, value }, index) => (
          <View
            key={index}
            style={[
              styles.specificationRow,
              index % 2 === 0
                ? styles.specificationRowEven
                : styles.specificationRowOdd,
            ]}
          >
            <Text style={styles.specificationKey}>{label}</Text>
            <Text style={styles.specificationValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  specificationsContainer: {
    marginVertical: 16,
    paddingHorizontal: 1,
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  specificationTable: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  specificationRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  specificationRowEven: {
    backgroundColor: '#f7f7f7',
  },
  specificationRowOdd: {
    backgroundColor: '#e0e0e0',
  },
  specificationKey: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  specificationValue: {
    fontSize: 14,
    color: '#666',
  },
});

export default SpecificationsTable;
