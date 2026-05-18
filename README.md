# npmctl.com

Standalone MdWrk lander repository for [npmctl.com](https://npmctl.com).

## Commands

- `npmctl install`
- `npmctl check`
- `npmctl build`
- `npmctl docker:build`
- `npmctl dns:plan`
- `npmctl deploy:dry-run`

The local npm scripts mirror those npmctl lifecycle commands for CI and Docker workers.

## Deployment

This repo deploys as the `npmctl-com` self-hosted Docker service. DNS is managed through Namecheap for the `npmctl.com` zone and is declared in `site.manifest.json`.
