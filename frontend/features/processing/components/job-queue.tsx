"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, XCircle, RefreshCw, FileText } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";
import { ProcessingService, ProcessingJob } from "../services/processing-service";

export function JobQueue() {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);

  useEffect(() => {
    ProcessingService.getJobs().then(setJobs);
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-800 rounded-xl bg-slate-900/50">
        <p className="text-slate-400 text-sm">No jobs in queue.</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Job Type</th>
              <th className="px-4 py-3 font-medium">Asset ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {jobs.map((job) => (
              <tr key={job.jobId} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium text-slate-200">{job.jobType}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{job.assetId}</td>
                <td className="px-4 py-3">
                  {job.status === "QUEUED" && <Badge variant="outline">QUEUED</Badge>}
                  {job.status === "RUNNING" && <Badge variant="blue" className="animate-pulse">RUNNING</Badge>}
                  {job.status === "COMPLETED" && <Badge variant="emerald">COMPLETED</Badge>}
                  {job.status === "FAILED" && <Badge variant="rose">FAILED</Badge>}
                </td>
                <td className="px-4 py-3 text-slate-400">P{job.priority}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {(job.status === "FAILED" || job.status === "CANCELLED") && (
                      <button onClick={() => ProcessingService.retryJob(job.jobId)} className="text-slate-400 hover:text-white" title="Retry">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    {(job.status === "QUEUED" || job.status === "RUNNING") && (
                      <button onClick={() => ProcessingService.cancelJob(job.jobId)} className="text-slate-400 hover:text-rose-400" title="Cancel">
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
