# MileX LocalStorage Software Testing Guide

## 0. Fresh Test Setup

1. Open `http://localhost:3000/login`.
2. Click `Reset Demo Data`.
3. Use the demo login buttons or credentials below.

## Demo Users

| Role | Email | Password |
| --- | --- | --- |
| KAM | `kam@milex.com` | `123456` |
| Sales Coordinator | `sales@milex.com` | `123456` |
| Line Manager | `manager@milex.com` | `123456` |

## Important Routes

| Role | Dashboard | Task/Record | Customers |
| --- | --- | --- | --- |
| KAM | `/kam/dashboard` | `/kam/recommendations` | `/kam/customers` |
| Sales Coordinator | `/sales/dashboard` | `/sales/tasks` | `/sales/customers` |
| Line Manager | `/line-manager/dashboard` | `/line-manager/tasks` | `/line-manager/customers` |

## 1. KAM Creates Recommendation

Login as KAM: `kam@milex.com / 123456`.

Go to `/kam/recommendations`.

Step 1 Basic Info:

| Field | Value |
| --- | --- |
| Account Name | `L'USINE FASHION LTD.` |
| Primary Address | `A-127-131, 135-138, 142-145, B-501-503 BSCIC Industrial Area, Enayetnagar, Shashangaon, Fatullah, Narayanganj P.O. Box: 1400` |
| Area Name | `Narayanganj` |
| Zone Name | `Dhaka` |
| Mobile Number | `+8802997746185` |
| Email Address | `info@fakirapparels.com` |
| Office Phone | `+8802997746185` |
| Fax Number | `N/A` |
| Business Type | `Garments` |
| Service Required | `Inbound & Outbound` |
| Account Mode | `Regular Account` |

Step 2 Financial:

| Field | Value |
| --- | --- |
| Account Type | `Credit` |
| Credit Limit | `50000` |
| Credit Period | `30` |

Step 3 Contact Persons:

| Field | Value |
| --- | --- |
| Senior Name | `Mr. Hasan` |
| Senior Designation | `Managing Director` |
| Senior Mobile | `+8801711111111` |
| Senior Email | `hasan@example.com` |
| Key Name | `Mr. Xyz` |
| Key Designation | `Operations Manager` |
| Key Mobile | `+8802997746185` |
| Key Email | `info@fakirapparels.com` |
| Financial Name | `Mr. GPO` |
| Financial Designation | `CFO` |
| Financial Mobile | `+8802997746185` |
| Financial Email | `billing@fakirapparels.com` |

Step 4 Shipping:

| Field | Value |
| --- | --- |
| Shipment Type | `Document`, `Non-Document` |
| Rate For | `Export` |
| Destination Country | `United States` |
| Monthly Volume | `150` |
| Monthly Weight | `5000` |
| Monthly Revenue | `10000` |
| Current Service Provider | `DHL` |

Step 5 Recommendation Note:

Use this note:

```text
Customer has consistent export shipment volume and a stable business profile in the garments sector. The requested credit limit is aligned with the expected monthly shipment revenue and standard settlement period. The account has reliable contact persons for operations and finance. Recommend offering MX rate to improve conversion and secure recurring logistics volume.
```

Expected:

- Submit success message appears.
- KAM dashboard returns.
- `/sales/tasks` now contains `MLX25DHK001` with `PENDING RATE PREPARATION`.

## 2. Sales Coordinator Prepares Rate

Login as Sales Coordinator: `sales@milex.com / 123456`.

Go to `/sales/dashboard`.

Expected:

- Action queue shows `L'USINE FASHION LTD.`.
- Click `Process File`.
- It opens `/sales/tasks/MLX25DHK001`.

On Sales record:

1. Click `Generate Rate`.
2. Optional: attach any Excel/CSV file.
3. Click `Forward to Line Manager`.

Expected:

- Status becomes `PENDING LM APPROVAL`.
- `/line-manager/tasks` now shows the record as pending approval.

## 3. Line Manager Approves Rate

Login as Line Manager: `manager@milex.com / 123456`.

Go to `/line-manager/dashboard`.

Expected:

- Action queue shows `L'USINE FASHION LTD.`.
- Click `Process File`.

On Line Manager record:

1. Click `Download Excel to Verify` if needed.
2. Add note: `Rate verified and approved.`
3. Click `Approve`.

Expected:

- `/sales/tasks` status becomes `APPROVED (PENDING OFFER LETTER)`.

Revision test:

- Instead of `Approve`, click `Revision`.
- Expected status: `REVISION REQUESTED BY LM`, revision `R-1`.

## 4. Sales Generates Offer Letter

Login as Sales Coordinator again.

Go to `/sales/tasks`.

Open `MLX25DHK001`.

Expected:

- Action box says rate approved by LM.

Click:

1. `Generate & Email Offer Letter`
2. Check print preview.
3. Close preview.
4. Click `Generate Agreement` if needed.

Expected:

- Status becomes `OFFER DELIVERED (PENDING AGREEMENT)`.
- Required action box shows customer agreement workflow.

## 5. Customer Agrees and Final Profile Is Completed

On the Sales record:

1. Click `Customer Agreed`.
2. Final Account Profile Data form appears.

Regular account test:

| Field | Value |
| --- | --- |
| Account Configuration Mode | `Regular Account` |
| Name of Managing Partner | `Mr. Hasan` |
| BIN Number | `BIN-123456789` |
| TIN Number | `TIN-987654321` |
| Destinations | `USA, UK, Germany` |
| Preferred Carrier | `DHL` |
| Nature of Business | `Garments Export` |
| Account Specifics | `Monthly export shipments` |
| Final Amount Limit | `50000` |
| Final Time Limit | `30` |

Click `Next`.

Provisional account test:

1. Select `Provisional Account`.
2. Enter reason: `Managing Director sign missing`.
3. Fill required profile fields.
4. Click `Next`.

Expected:

- Supporting Documentation panel appears.
- Status becomes `CLIENT FINAL DATA UPDATE`.

## 6. Upload Documents and Activate

On Supporting Documentation:

Upload a file for each required document:

- Offer Letter
- Signed Agreement
- Customer TIN
- Customer BIN
- Trade License

Optional:

- Other Documents

Enter document number and expiry date where available.

Click `Activate & Distribute Profile`.

Expected:

- Status becomes `ACTIVE & DISTRIBUTED`.
- `/sales/customers`, `/line-manager/customers`, and `/kam/customers` show the customer in active profiles.

## 7. Persistence Test

1. Refresh the browser.
2. Logout and login again.
3. Visit `/sales/tasks` and `/sales/customers`.

Expected:

- Records remain in the same state.
- Customer activation remains visible.
- Data only resets if you click `Reset Demo Data` on login.

## LocalStorage Keys

Main database:

- `milex.database.v1`

Workflow state:

- `milex.kam.recommendation.submitted`
- `milex.sales.rate-action`
- `milex.line-manager.approval`
- `milex.sales.offer-document`
- `milex.sales.client-finalization`

Session:

- `milex.session`
