# playwright-BDD-AWS

Playwright version of the Selenium BDD flows.

This standalone TypeScript project ports the browser scenarios in
`../Selenium-BDD-AWS/src/test/resources/features` to Playwright Test:

- CMS administrator login, dashboard, and logout verification
- CRM valid and invalid sign-in
- HRM login and Projects/Tasks navigation

The existing Java/Selenium project remains unchanged.

## Requirements

- Node.js 20 or later
- npm

## Install and run

From this directory:

```powershell
npm ci
npm run install:browsers
npm test
```

Useful commands:

```powershell
npm run test:headed
npm run test:ui
npm run test:report
npm run typecheck
```

The Chromium browser is used by default. Playwright captures screenshots, traces,
and video for failed tests; the HTML report is written to `playwright-report/`.
The CMS test also attaches screenshots before login, after login, and after logout
to the report.

## Configuration

The sample credentials and URLs mirror the existing feature files. Override them
with environment variables when needed:

| Variable | Default |
| --- | --- |
| `CMS_LOGIN_URL` | `https://cms.anhtester.com/login` |
| `CMS_EMAIL` | `admin@example.com` |
| `CMS_PASSWORD` | `123456` |
| `CRM_SIGNIN_URL` | `https://rise.fairsketch.com/signin` |
| `CRM_VALID_EMAIL` | `admin@demo.com` |
| `CRM_VALID_PASSWORD` | `riseDemo` |
| `CRM_INVALID_EMAIL` | `admin123@demo.com` |
| `CRM_INVALID_PASSWORD` | `riseDemo` |
| `HRM_URL` | `https://hrm.anhtester.com/` |
| `HRM_USERNAME` | `admin_example` |
| `HRM_PASSWORD` | `123456` |

## Email reports

After each Playwright run, the project creates a PDF from the HTML report and
emails both report files using Yahoo SMTP. Set the SMTP app password in the
environment before running tests; never commit it to the repository:

```powershell
$env:SMTP_PASSWORD = "<your Yahoo app password>"
npm test
```

Mail settings can be overridden with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and
`REPORT_EMAIL_TO`. The defaults use Yahoo SMTP on port 587 and the sender and
recipient configured in the original Selenium sample. For local runs where
email is intentionally not needed, set `EMAIL_REPORT_ENABLED=false`.
