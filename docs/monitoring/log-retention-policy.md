# Log Retention Policy

## Objectives

* Ensure critical logs are retained for auditing, debugging, and incident analysis.
* Optimize storage usage and avoid unnecessary long-term retention of verbose logs.
* Comply with operational and security best practices.

## Retention Duration by Log Level

| Log Level | Retention Duration | Storage Location                                         | Rationale                                                                                                                                                                             |
|-----------|--------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Error** | **90 days**        | Centralized storage (e.g., ELK, Loki) with daily backups | Contains critical incidents, exceptions, and failures. Long retention enables thorough incident response, root cause analysis, security audits, and compliance reporting.             |
| **Warn**  | **30 days**        | Centralized logging system                               | Indicates potential problems or degraded performance. Retained for operational monitoring and trend analysis. Shorter than `error` to reduce volume while keeping sufficient context. |
| **Info**  | **7–14 days**      | Local log files (rotated) or central storage             | Includes routine events (e.g., service start, health checks, request logs). Short retention supports active debugging or load analysis without overloading storage.                   |
| **Debug** | **1–3 days**       | Local ephemeral storage (e.g., tmpfs, docker logs)       | Extremely verbose. Captures detailed traces used only during development or immediate investigation of transient issues. Automatically discarded to conserve resources.               |

## Archival & Deletion Strategy

| Action           | Schedule/Frequency                   | Method                                                                                                                                                                                                      |
|------------------|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Log Rotation** | Daily or when log size exceeds 100MB | Managed via tools like `logrotate`, `filebeat`, or `pino-multi-stream` (for JSON logs). Ensures logs are segmented and indexed efficiently.                                                                 |
| **Archival**     | Weekly/monthly (post-retention)      | Critical logs (`error`, `warn`) are compressed (e.g., `.gz`) and moved to cold storage (e.g., AWS S3 Glacier, Google Cloud Coldline). Index metadata (e.g., timestamp, service) retained for searchability. |
| **Deletion**     | End of retention + archival verified | Automatically purged via lifecycle policies (e.g., S3 lifecycle rules, cron jobs, or log management system TTL settings). Ensures compliance and prevents data bloat.                                       |

## Implementation Notes

* Sampling: Applied for info, debug, and warn logs to reduce volume (e.g., 20–30% sample rate), especially under a high
  load.
* Centralization: All `warn` and `error` logs are sent to a centralized logging system (e.g., ELK, Loki, or DataDog)
  with
  alerting hooks.
* Compliance: Retention aligns with organizational policy and relevant data protection standards (e.g., GDPR, SOC2).

## Justification

* Error logs are essential for long-term analysis, especially during security incidents or customer impact.
* Warn logs provide signals of potential issues but do not always indicate failure, so shorter retention is sufficient.
* Info/Debug logs generate high volume and are only necessary during active issue resolution or development.
* Storage cost and performance: Rotating and purging logs prevent disk bloat and reduce the cost of long-term storage.