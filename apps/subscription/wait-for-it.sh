#!/usr/bin/env sh

set -e

host="$1"
shift
port="$1"
shift

timeout=15
quiet=0
cmd="$@"

echo "Waiting for $host:$port..."

for i in $(seq $timeout); do
  if nc -z "$host" "$port" 2>/dev/null; then
    echo "$host:$port is available after $i seconds"
    exec $cmd
  fi
  sleep 1
done

echo "Timeout after ${timeout}s waiting for $host:$port"
exit 1