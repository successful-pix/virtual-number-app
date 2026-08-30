# Numberly — Virtual Number App

A Next.js foundation for a compliant virtual-number management service. Numbers are intended for legitimate communications and provider-supported messaging use cases; the app does not implement verification-code bypasses or evasion of third-party security controls.

## Current foundation
- Responsive Numberly landing page
- Country and number availability selector
- Account entry point
- Security-focused provider architecture notes

## Planned production modules
- Authentication and user profiles
- Authorized provider adapter API
- Number inventory and reservations
- Messaging inbox for provider-supported inbound messages
- Orders, billing and transaction history
- Admin console
- Provider webhooks and audit logs

## Development

```bash
npm install
npm run dev
```

Provider API keys must remain server-side environment variables and must never be committed to the repository.
