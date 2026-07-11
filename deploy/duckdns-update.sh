#!/usr/bin/env bash
# Keeps the DuckDNS A record pointed at this instance's current public IP.
# Install once via crontab (see deploy/README.md):
#   */5 * * * * DUCKDNS_SUBDOMAIN=quickrecall-aws DUCKDNS_TOKEN=xxxx /opt/quickrecall/deploy/duckdns-update.sh >> /var/log/duckdns.log 2>&1
set -euo pipefail

: "${DUCKDNS_SUBDOMAIN:?set DUCKDNS_SUBDOMAIN (the part before .duckdns.org)}"
: "${DUCKDNS_TOKEN:?set DUCKDNS_TOKEN (from your duckdns.org dashboard)}"

response=$(curl -fsS "https://www.duckdns.org/update?domains=${DUCKDNS_SUBDOMAIN}&token=${DUCKDNS_TOKEN}&ip=")
echo "$(date -u +%FT%TZ) duckdns update -> ${response}"

if [[ "$response" != OK* ]]; then
  echo "duckdns update failed" >&2
  exit 1
fi
