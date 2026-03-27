# Project Memory

## Target Git Repository
- URL: `https://github.com/ylevin1989/pulscare.git`
- Status: repository is approved as the future destination for this project.
- Note: no push/deploy has been performed yet (by request).

## Workflow Note
When requested later:
1. Initialize/connect local git repository.
2. Set `origin` to the URL above.
3. Commit current site state.
4. Push to the selected branch.

Updated: 2026-03-27

## Infrastructure Notes
- Production domain: `https://pulscare.ru/`
- VPS access: `root@37.233.83.172`
- Current VPS state: there is an existing container with a placeholder/stub site.
- Planned action (later): remove/replace the stub container and deploy the full project version (React + Node.js backend) when development is complete.
- Deployment strategy: Docker-first (`Dockerfile` + `docker-compose.yml` in project root).
