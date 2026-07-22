import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ProcessingService, MobileProcessingJob } from "../services/processing-service";

export function ProcessingStatusCard() {
  const [jobs, setJobs] = useState<MobileProcessingJob[]>([]);

  useEffect(() => {
    ProcessingService.getActiveJobs().then(setJobs);
  }, []);

  if (jobs.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Processing Background Jobs</Text>
      {jobs.map((job) => (
        <View key={job.jobId} style={styles.jobRow}>
          <View style={styles.jobInfo}>
            <ActivityIndicator size="small" color="#34d399" />
            <Text style={styles.jobType}>{job.jobType}</Text>
          </View>
          <Text style={styles.status}>{job.status}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: {
    color: "#94a3b8",
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 12,
  },
  jobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobType: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "500",
  },
  status: {
    color: "#34d399",
    fontSize: 12,
    fontWeight: "bold",
  },
});
