#!/usr/bin/env python3
"""Normalize Namecheap hosts to DNS records only while preserving valid DNS."""

from __future__ import annotations

import os
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


VALID_DNS_TYPES = {"A", "AAAA", "CNAME", "TXT", "MX", "NS", "SRV", "CAA"}


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"missing required environment variable: {name}")
    return value


def parse_records(path: Path) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("- provider:"):
            if current:
                records.append(current)
            current = {}
            continue
        if current is None or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key in {"zone", "type", "name", "value", "ttl"}:
            current[key] = value
    if current:
        records.append(current)
    return records


def host_name(name: str, zone: str) -> str:
    if name == "@":
        return "@"
    suffix = f".{zone}"
    if name.endswith(suffix):
        name = name[: -len(suffix)]
    return name


def request_namecheap(params: dict[str, str]) -> ET.Element:
    base = "https://api.namecheap.com/xml.response"
    url = f"{base}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=30) as response:
        data = response.read()
    root = ET.fromstring(data)
    if root.attrib.get("Status") != "OK":
        errors = [node.text or "" for node in root.findall(".//{*}Error")]
        raise SystemExit("; ".join(errors) or "Namecheap API request failed")
    return root


def common_params(command: str, sld: str, tld: str) -> dict[str, str]:
    return {
        "ApiUser": require_env("NAMECHEAP_API_USER"),
        "ApiKey": require_env("NAMECHEAP_API_KEY"),
        "UserName": require_env("NAMECHEAP_USERNAME"),
        "ClientIp": require_env("NAMECHEAP_CLIENT_IP"),
        "Command": command,
        "SLD": sld,
        "TLD": tld,
    }


def split_zone(zone: str) -> tuple[str, str]:
    parts = zone.split(".", 1)
    if len(parts) != 2:
        raise SystemExit(f"unsupported zone format: {zone}")
    return parts[0], parts[1]


def main() -> int:
    desired_path = Path(sys.argv[1] if len(sys.argv) > 1 else ".tmp/dns.yaml")
    desired = parse_records(desired_path)
    zones = sorted({record["zone"] for record in desired})
    if not zones:
        raise SystemExit(f"no dns_records found in {desired_path}")

    for zone in zones:
        sld, tld = split_zone(zone)
        root = request_namecheap(common_params("namecheap.domains.dns.getHosts", sld, tld))
        existing = []
        dropped = []
        for host in root.findall(".//{*}host"):
            record_type = (host.attrib.get("Type") or "").upper()
            row = {
                "Name": host.attrib.get("Name", ""),
                "Type": record_type,
                "Address": host.attrib.get("Address", ""),
                "TTL": host.attrib.get("TTL", "300"),
                "MXPref": host.attrib.get("MXPref", "10"),
            }
            if record_type in VALID_DNS_TYPES:
                existing.append(row)
            else:
                dropped.append(f"{row['Name']} {record_type}")

        by_key = {(row["Name"], row["Type"]): row for row in existing}
        for record in desired:
            if record["zone"] != zone:
                continue
            record_type = record["type"].upper()
            if record_type not in VALID_DNS_TYPES:
                raise SystemExit(f"desired record is not a DNS record: {record_type}")
            name = host_name(record["name"], zone)
            if record_type == "CNAME":
                for key in list(by_key):
                    if key[0] == name:
                        by_key.pop(key)
            else:
                by_key.pop((name, "CNAME"), None)
            by_key[(name, record_type)] = {
                "Name": name,
                "Type": record_type,
                "Address": record["value"],
                "TTL": record.get("ttl", "300"),
                "MXPref": "10",
            }

        next_records = sorted(by_key.values(), key=lambda row: (row["Name"], row["Type"], row["Address"]))
        params = common_params("namecheap.domains.dns.setHosts", sld, tld)
        for index, row in enumerate(next_records, start=1):
            params[f"HostName{index}"] = row["Name"]
            params[f"RecordType{index}"] = row["Type"]
            params[f"Address{index}"] = row["Address"]
            params[f"TTL{index}"] = row["TTL"]
            if row["Type"] == "MX":
                params[f"MXPref{index}"] = row["MXPref"]

        request_namecheap(params)
        if dropped:
            print(f"{zone}: removed non-DNS Namecheap records: {', '.join(dropped)}")
        print(f"{zone}: normalized {len(next_records)} DNS records")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
