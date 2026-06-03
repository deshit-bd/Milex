# MileX

MileX logistics management portal.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deploy on Vercel

1. Import this GitHub repository in Vercel.
2. Set the **Root Directory** to `frontend`.
3. Keep the detected framework preset as **Next.js**.
4. Add the Google Sheets environment variables from `frontend/.env.example`.
5. Deploy.

## Google Sheets Database

The Next.js API route at `frontend/app/api/database/route.js` stores business data in Google Sheets.

Required environment variables:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

Create a Google Cloud service account, copy its email/private key, and share the Google Sheet with that service account email as an editor. The app will create these tabs automatically when the API runs:

- `Records`
- `Customers`
- `Workflow`
