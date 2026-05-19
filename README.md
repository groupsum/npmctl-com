# npmctl.com

Standalone MdWrk lander repository for [npmctl.com](https://npmctl.com).

## Commands

- `npm ci`
- `npm run check`
- `npm run build`
- `npm run docker:build`
- `npm run dns:plan` (uses PyPI `npmctl` plus `npmctl-namecheap`)
- `npm run proxy:plan` (uses PyPI `npmctl`)

The GitHub workflows install `npmctl` and `npmctl-namecheap` from PyPI, then use `npmctl validate`, `npmctl plan`, and `npmctl apply` against `desired-state/`.

## Deployment

This repo deploys as the `npmctl-com` self-hosted Docker service. DNS is managed through the PyPI `npmctl-namecheap` provider for the `npmctl.com` zone and is declared in `desired-state/dns.yaml`.
