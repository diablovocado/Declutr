import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RecommendationCard, MobilePrediction } from './RecommendationCard';

export interface PredictionFeedProps {
  predictions: MobilePrediction[];
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const PredictionFeed: React.FC<PredictionFeedProps> = ({ predictions, onAccept, onDismiss }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Life Intelligence Suggestions</Text>
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecommendationCard
            prediction={item}
            onAccept={() => onAccept(item.id)}
            onDismiss={() => onDismiss(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
