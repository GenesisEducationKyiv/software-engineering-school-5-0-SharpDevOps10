# HTTP vs. gRPC Protocol Performance Comparison

## Introduction

This document presents a comparative performance analysis of two communication protocols used in microservices: *
*HTTP/REST** and **gRPC**. The comparison focuses on measuring latency, throughput, and stability under high load
conditions.

To evaluate both protocols, there was implemented a simple `GetWeather(city)` endpoint, exposed via:

- **HTTP REST API**
- **gRPC (Protocol Buffers)**

There were used two widely adopted benchmarking tools:

- [ab (ApacheBench)](https://httpd.apache.org/docs/2.4/programs/ab.html) — for HTTP testing
- [ghz](https://ghz.sh/) — for gRPC testing

Each test used **30,000 total requests** with a **concurrency level of 50 clients**.

## ⚙️ Load Testing Tools and Configuration

### 1. ApacheBench (`ab`)

Command:

```bash
$ ab -n 30000 -c 50 "http://localhost:3003/weather?city=London"
```

### 2. ghz (gRPC Benchmark)

Command:

```bash
$ ghz \
  --proto ./libs/proto/weather.proto \
  --call weather.WeatherService.GetWeather \
  -d '{"city": "Kyiv"}' \
  -n 30000 \
  -c 50 \
  --insecure \
  localhost:3003
```

## HTTP Benchmark Result (ApacheBench)

### Raw Output:

```
This is ApacheBench, Version 2.3 <$Revision: 1913912 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 3000 requests
Completed 6000 requests
Completed 9000 requests
Completed 12000 requests
Completed 15000 requests
Completed 18000 requests
Completed 21000 requests
Completed 24000 requests
Completed 27000 requests
Completed 30000 requests
Finished 30000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3003

Document Path:          /weather?city=London
Document Length:        64 bytes

Concurrency Level:      50
Time taken for tests:   16.810 seconds
Complete requests:      30000
Failed requests:        0
Total transferred:      8130000 bytes
HTML transferred:       1920000 bytes
Requests per second:    1784.65 [#/sec] (mean)
Time per request:       28.017 [ms] (mean)
Time per request:       0.560 [ms] (mean, across all concurrent requests)
Transfer rate:          472.31 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       6
Processing:     7   28   6.9     26      90
Waiting:        1   27   6.9     25      89
Total:          7   28   7.0     26      90

Percentage of the requests served within a certain time (ms)
  50%     26
  66%     27
  75%     29
  80%     30
  90%     36
  95%     44
  98%     51
  99%     55
 100%     90 (longest request)
```

---

## gRPC Benchmark Result (ghz)

### 🔹 Raw Output:

```
Summary:
  Count:        30000
  Total:        8.01 s
  Slowest:      28.63 ms
  Fastest:      1.21 ms
  Average:      11.69 ms
  Requests/sec: 3745.09

Response time histogram:
  1.213  [1]     |
  3.955  [56]    |
  6.697  [445]   |∎
  9.439  [4060]  |∎∎∎∎∎∎∎∎∎∎
  12.181 [15500] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  14.923 [7028]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  17.665 [1640]  |∎∎∎∎
  20.407 [754]   |∎∎
  23.149 [348]   |∎
  25.891 [104]   |
  28.633 [64]    |

Latency distribution:
  10 % in 8.90 ms 
  25 % in 10.07 ms 
  50 % in 11.24 ms 
  75 % in 12.82 ms 
  90 % in 14.84 ms 
  95 % in 17.02 ms 
  99 % in 21.82 ms 

Status code distribution:
  [OK]   30000 responses   

```

## Metric Comparison Table

| Metric                  | HTTP (ab)   | gRPC (ghz)         |
|-------------------------|-------------|--------------------|
| Total Requests          | 30000       | 30000              |
| Failed Requests         | 0           | 0                  |
| Duration                | 16.81 s     | 8.01 s             |
| Requests per second     | **1784.65** | **3745.09**        |
| Average latency         | 28.017 ms   | 11.69 ms           |
| Median latency          | 26 ms       | 11.24 ms           |
| 95th percentile latency | 44 ms       | 17.02 ms           |
| 99th percentile latency | 55 ms       | 21.82 ms           |
| Transfer rate           | 472.31 KB/s | N/A (not reported) |

---

## Conclusion

The benchmarking results show a clear performance advantage of gRPC over HTTP/REST, particularly in high-load
conditions. Here's a detailed breakdown:

1. **gRPC handles double the throughput**: At the same concurrency level, gRPC served over 2× more requests per second,
   with lower CPU and latency impact.
2. **Lower and more stable latency:** gRPC exhibits tighter latency distribution — the 95th and 99th percentiles remain
   low, meaning even under stress, tail latencies stay predictable. HTTP latencies are more spread out.
3. **Faster response time per request:** The average request in gRPC was over 2× faster than HTTP, and even the slowest
   gRPC request (28.63 ms) was close to the mean latency of HTTP.
4. **HTTP/REST overhead**:
    * Uses text-based JSON (slower to parse).
    * Operates over HTTP/1.1, lacking features like multiplexing.
    * Payloads are larger, increasing serialization and network time.
5. **gRPC advantages:**
    * Uses Protocol Buffers (binary format, faster serialization).
    * Supports HTTP/2 features like multiplexing, reducing connection overhead.
    * Built-in support for bidirectional streaming and flow control.