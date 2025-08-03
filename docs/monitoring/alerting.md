# Monitoring Alerts for Application Health and Stability

This section describes critical alerts configured for application observability, including metric-based and log-based
alerts. These alerts ensure rapid detection of issues affecting user experience, service reliability, or system
performance.

## Log-Based Alerts

| Alert                             | Description                                                                   | Reason for Importance                                               |
|-----------------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------|
| **Error Log Rate Spike**          | Alert if error logs exceed a threshold (e.g., >20 errors/minute)              | Indicates unhandled exceptions, service failures, or critical bugs. |
| **Warning Log Rate Spike**        | Alert if warning logs exceed a threshold (e.g., >50 warnings/hour)            | Helps detect degraded but non-critical behavior early.              |
| **Sampling Coverage Decrease**    | Alert if error logs drop suddenly (possible sampling misconfig)               | Ensures errors aren't missed due to faulty log sampling.            |
| **Log Message Pattern Detection** | Alert on specific patterns: e.g., “Failed to push metrics” or “token invalid” | Detects recurring known failure types for proactive resolution.     |

## Metric-Based Alerts

### Redis Alerts

| Alert                    | Description                                                                                                                                                  |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **High Redis Errors**    | Alert when `redis_errors_total` increases rapidly (e.g., >10 errors/min), indicating connection issues or failed read operations from Redis.                 |
| **High Cache Miss Rate** | Triggered if `misses_total / requests_total > 0.5` for 5 consecutive minutes — may indicate ineffective caching, increased latency, or incorrect cache keys. |
| **Slow Redis Responses** | Alert if 95th percentile (`P95`) of `redis_response_time_seconds` exceeds 500ms — implies Redis is becoming a performance bottleneck.                        |
| **Write Failures**       | Fires when `write_errors_total` increases (e.g., >5 write failures per minute), indicating issues persisting data to Redis.                                  |

### Subscription Service Alerts

| Alert                               | Description                                                                                                                                  |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **Subscription Failures**           | Alert when `subscription_created_total{status="fail"}` increases rapidly — could mean validation issues, DB errors, or user misuse.          |
| **Invalid Token Spike**             | Triggered if `invalid_token_total` crosses threshold (e.g., >5/min) — may indicate token expiry issues or malicious requests.                |
| **City Validation Failures**        | Fires when `city_validation_fail_total` increases — could mean third-party weather API failures or invalid city inputs.                      |
| **High Processing Duration**        | Alert if `subscription_processing_duration_seconds` P95 > 2 seconds — indicates latency in subscription creation.                            |
| **Unconfirmed Subscriptions Spike** | Triggered if `subscription_count{confirmed="false"}` grows significantly over time — may suggest confirmation email issues or user drop-off. |

### Notification Service Alerts

| Alert                           | Description                                                                                                                                    |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| **Email Send Failures**         | Fires when `notification_email_send_attempts{status="fail"}` increases — could be due to downstream email service errors or invalid addresses. |
| **Subscription Fetch Failures** | Alert if `subscription_fetch_attempts{status="fail"}` increases — may indicate RPC or broker issues with the subscription service.             |
| **Slow Email Dispatch**         | Triggered if `notification_email_response_time_seconds` P95 > 2 seconds — indicates slow weather fetching or email dispatch latency.           |
| **Slow Subscription Fetch**     | Fires if `subscription_fetch_duration_seconds` P95 > 1 second — possible latency in fetching subscriber data from backend.                     |

### Email Service Alerts

| Alert                        | Description                                                                                                                                            |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Email Send Failure Rate**  | Alert when `email_send_total{status="fail"}` exceeds 10 failures per minute — indicates issues with email template, provider, or message payload.      |
| **Invalid Templates Used**   | Fires when `template_validation_failures_total` > 1/min — suggests code or data issues triggering invalid email templates.                             |
| **Slow Email Send Duration** | Alert if `email_send_duration_seconds` P95 > 1 second — implies the email provider or rendering engine is slowing down.                                |
| **No Metrics Pushed**        | Fires if Prometheus Pushgateway doesn’t receive email service metrics for one full push interval — could mean metrics pusher failure or service crash. |

## Recommended Alerting Tools

* Prometheus + Alertmanager: Use PromQL rules for thresholds and anomaly detection.
* Grafana Alerts: Visual dashboards with alert panels.
* Loki Log Alerts: For log spike detection

## Conclusion

These alerts ensure:

* Reliability: Detect and act on failures quickly.
* Performance: Track latency and efficiency bottlenecks.
* Security/Abuse: Spot unusual patterns (invalid tokens, city fails).