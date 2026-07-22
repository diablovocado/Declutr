# Declutr Agent Human-in-the-Loop Approval Model

All agent plans containing destructive or sensitive tasks (deleting assets, moving data, bulk updates, sharing content, external connector calls) are flagged with `IsDestructive=true` and `RequiresReview=true`.

Users can inspect proposals in the Approval Center (`/agents/plans`) and either Approve or Reject plans with feedback comments. Approved plans update operational memory (`SUCCESS`), while rejected plans teach the agent user preferences (`FEEDBACK`).
