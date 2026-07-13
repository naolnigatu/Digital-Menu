# MenuFlow: Restaurant SaaS Project Audit & Technical Specification

This document provides a comprehensive, high-fidelity audit of the **MenuFlow** codebase. It outlines the architectural design, features, security models, data flows, and current implementation details of the system exactly as it exists today.

---

## 1. Project Overview

### Project Purpose
**MenuFlow** is a multi-tenant Software-as-a-Service (SaaS) platform designed for restaurant operations. It coordinates and bridges the activities of all restaurant operational units—SaaS Platform Admins, Business Owners, Branch Managers, Waitstaff, Kitchen Chefs (KDS), Cashiers, and Customers—within a unified, real-time reactive ecosystem.

### Target Users
1. **SaaS Super Administrators:** Platform managers who oversee business approvals, publish platform-wide ads, customize subscription rate sheets, and monitor audit telemetry.
2. **Business Owners & Managers:** Operators who manage multi-branch menu catalogs, categories, kitchen stations, team invites, table layouts, and view business analytics.
3. **Waitstaff / Floor Captains:** Direct service workers who monitor dining room tables, book walk-in orders, and deliver ready dishes.
4. **Kitchen Chefs / Prep Staff:** Kitchen operators using the Kitchen Display System (KDS) to cook items and mark tickets as ready.
5. **Cashier Operators:** Staff members who handle split-billing, settle unpaid tables, and verify digital bank transfers (screenshot receipts).
6. **Customers:** Patrons who scan table QR codes to browse menus in dual-languages (English & Amharic), customize modifiers, and place dine-in or pre-orders.

### Technology Stack
- **Framework:** React 18+
- **Build System:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (using modern single-file CSS imports)
- **Icons:** `lucide-react`
- **State Management:** React Context API (`AppContext.tsx`)
- **Storage:** Local memory synchronized to `localStorage` key-value pairs
- **APIs:** Unified in-memory simulated database controller
- **Deployment Platform:** Cloud Run containers (running behind an Nginx reverse proxy routing to Port 3000)

---

## 2. Project Structure

The project code is modular, strongly typed, and structured cleanly to enforce the separation of core states, UI views, and custom templates:

```text
/
├── index.html                  # Browser entry point
├── package.json                # Project dependencies and operational scripts
├── metadata.json               # Application metadata, permissions, and capabilities
├── tailwind.config.js          # Tailwind styling configuration
├── src/
│   ├── main.tsx                # React application bootstrapper
│   ├── App.tsx                 # Core Dashboard Shell and role-based views routing
│   ├── index.css               # Global styling entry point importing Tailwind CSS
│   ├── types.ts                # Strong-type declarations and shared domain interfaces
│   ├── components/
│   │   └── Navbar.tsx          # App header with active simulator role indicators and switcher
│   ├── context/
│   │   └── AppContext.tsx      # Central State Engine: CRUD operations, database simulation, storage syncing
│   ├── data/
│   │   └── mockData.ts         # Seeding data: Default tenants, menu items, categories, staff accounts
│   └── views/
│       ├── SuperAdminView.tsx  # Platform administration dashboard and tenant directory
│       ├── BusinessOwnerView.tsx # Restaurant HQ, catalog builder, analytics, team roster
│       ├── CustomerView.tsx    # Customer portal, cart designer, checkout, receipts upload
│       ├── WaiterView.tsx      # Table management, floor captain ordering board
│       ├── KDSView.tsx         # Multi-station Kitchen Display System & stock manager
│       ├── CashierView.tsx     # Settlement screen, advance receipt verification, split-billing
│       └── OnboardingView.tsx  # Brand onboarding form for brand new business owners
```

---

## 3. Current Features

### Category: Tenant Onboarding & Platform Management
1. **Onboarding Form (`OnboardingView`)**
   - **What it does:** Allows a registered User with an `'owner'` role to create a business profile from scratch if they do not yet have an assigned `tenantId`.
   - **How it works:** Collects business name, slug, logo URL, description, and initial target subscription tier. On submit, provisions a new `Tenant` and an initial default `Branch`.
   - **Status:** Fully functional.
   - **Limitations:** Slug uniqueness checks are done purely in memory; does not interface with a remote server.
2. **Super Admin Dashboard (`SuperAdminView`)**
   - **What it does:** Oversees global metrics, processes registrations, runs platform ads, controls subscription configurations, and displays audit trails.
   - **How it works:** Accesses unified state inside `AppContext`.
   - **Status:** Fully functional.
   - **Limitations:** All changes persist only within the local browser storage context.

### Category: Multi-Branch & Catalog Builder
1. **Category Manager (`BusinessOwnerView`)**
   - **What it does:** Allows owners to create, update, and delete menu categories, set sort-order ranks, and specify Amharic translations.
   - **How it works:** Implements a state modal calling `addCategory` / `updateCategory` in `AppContext`.
   - **Status:** Fully functional.
   - **Limitations:** Icon picker is hardcoded to a default icon placeholder (`'Utensils'`).
2. **Menu Item Builder (`BusinessOwnerView`)**
   - **What it does:** Supports full CRUD operations on menu dishes, including price, descriptions, allergen/dietary tags, kitchen station assignments, photo URLs, modifier options, and Amharic translation matrices.
   - **How it works:** Collects data via nested form states and supports base64 file parsing for direct image uploads.
   - **Status:** Fully functional.
   - **Limitations:** Large base64 files can consume storage boundaries of `localStorage` (limit ~5MB total).

### Category: Interactive Dining Floor
1. **Table QR Coaster Generator (`BusinessOwnerView`)**
   - **What it does:** Allows managers to add virtual dining tables and generates scannable vectors with encoded routing links mapping to the customer views.
   - **How it works:** Generates stylized interactive grids mimicking high-fidelity QR matrix codes linked to customer views.
   - **Status:** Fully functional.
   - **Limitations:** QR codes are simulated representations.
2. **Floor Waiter Board (`WaiterView`)**
   - **What it does:** Allows floor waiters to view physical table occupancy states (`vacant`, `eating`, `dirty`), take in-person orders, and track ready-to-deliver foods.
   - **How it works:** Reads the synchronized tables collection and provides a simplified fast-cart order screen.
   - **Status:** Fully functional.
   - **Limitations:** Relying on browser storage requires running waitstaff and customers on the same device/browser in simulator sandboxes.

### Category: Customer Portal & Ordering
1. **Dual-Language Client Portal (`CustomerView`)**
   - **What it does:** Provides the main customer interface to filter categories, search items, view dietary labels, choose modifiers, and place orders.
   - **How it works:** Supports an instant, toggleable locale translation switch (`English` and `Amharic`) in the view header.
   - **Status:** Fully functional.
   - **Limitations:** Translations are limited to category name and menu item name/description.
2. **Checkout Engine & Advanced Transfers (`CustomerView`)**
   - **What it does:** Offers Dine-in and Pickup selection. Dine-in prompts for the table number, while Pickup prompts for pickup times. Also handles advanced digital bank transfers (uploading receipts).
   - **How it works:** Generates bank transfer account details. Users upload receipt screenshots parsed via FileReader to Base64 strings. This sets the verification state to `pending`.
   - **Status:** Fully functional.

### Category: Food Preparation & Order Settlement
1. **Kitchen Display System (`KDSView`)**
   - **What it does:** Displays live kitchen tickets routed to assigned stations. Tracks item-level cooking states and highlights late tickets (>15 minutes).
   - **How it works:** Iterates over active orders, matching individual order items with the chef's active station ID.
   - **Status:** Fully functional. Include a "Stock Controller" allowing chefs to toggle "Out of Stock" (Sold Out) states for menu items instantly.
2. **Cashier Desk (`CashierView`)**
   - **What it does:** Handles payment settlements, applies discounts, split-bills, prints mock thermal receipts, and verifies advanced digital transfers.
   - **How it works:** Pulls unpaid active orders. Cashiers can click "Verify Transfer" to view uploaded screenshots and accept or reject the payment.
   - **Status:** Fully functional.

---

## 4. User Roles & Permissions

The platform uses a role-based access control (RBAC) model defined by the `UserRole` union:

| Role | Permissions | Accessible Views | Allowed Actions | Restricted Actions |
|---|---|---|---|---|
| **`super_admin`** | Platform-wide control | `SuperAdminView` | Approve/Reject registrations, block/unblock tenants, change subscription levels, edit global rate pricing plans, publish platform ads, inspect logs, and manage individual tenants. | Cannot place customer orders or directly cook dishes (unless managing a tenant). |
| **`owner`** | Master tenant administrator | `BusinessOwnerView`, `OnboardingView` | Edit settings, configure branch layouts, assign kitchen stations, design categories/items, invite team members, view analytics, and manage billing. | Cannot access global Super Admin views or telemetry logs of other tenants. |
| **`manager`** | Branch operator | `BusinessOwnerView` | Similar permissions to `owner` but scoped to their assigned `branchId`. | Cannot alter master subscription plans or change tenant wide bank details. |
| **`waiter`** | Dining floor operations | `WaiterView` | View table statuses, change table states (e.g. from `dirty` to `vacant`), take walk-in orders, and track delivered dishes. | Cannot modify menu catalogs, change pricing, or settle financial transactions. |
| **`kitchen`** | Cooking & preparation | `KDSView` | View station-specific tickets, update preparation statuses, and toggle item stock availability. | Cannot access billing panels, view tables, or modify prices. |
| **`cashier`** | Financial settlement | `CashierView` | Process bills, verify bank screenshot receipts, apply discounts, select payment methods, and settle orders. | Cannot edit menu items, change cooking states, or manage tenant structures. |
| **`customer`** | Public patron | `CustomerView` | Browse digital menus, filter categories, search items, customize modifiers, and place orders. | Restricted from all administrative, financial, operational, and staff modules. |

---

## 5. Database Schema

The system uses a highly structured relational state model. The schema interfaces are declared in `src/types.ts`:

### 1. `Tenant` (Business Profiles)
*Represents individual business accounts on the SaaS platform.*
- `id` (string): Unique identifier.
- `name` (string): Brand name.
- `slug` (string): URL-friendly unique identifier.
- `ownerEmail` (string): Account owner's email address.
- `subscriptionStatus` (`'pending_approval' | 'active' | 'suspended' | 'rejected'`): Operational status of the workspace.
- `subscriptionPlan` (`'free' | 'growth' | 'enterprise'`): Tier determining active features.
- `logoUrl` (string, optional): Brand logo link.
- `description` (string, optional): Company tagline or details.
- `currency` (string): Selected base currency code (e.g., `'ETB'`, `'USD'`).
- `currencySymbol` (string): Character symbol for UI layout (e.g., `'Br'`, `'$'`).
- `bankAccount` (string, optional): Bank account for digital transfer transfers.
- `createdAt` (string): ISO timestamp.

### 2. `Branch` (Store Outlets)
*Represents physical restaurant branches under a single Tenant.*
- `id` (string): Unique identifier.
- `tenantId` (string): Foreign key referencing `Tenant`.
- `name` (string): Branch name (e.g., "Bole Branch").
- `address` (string): Physical address.
- `phone` (string): Contact phone number.
- `createdAt` (string): ISO timestamp.

### 3. `PreparationStation` (Kitchen Sections)
*Defines physical or virtual processing areas inside a branch's kitchen.*
- `id` (string): Unique identifier.
- `branchId` (string): Foreign key referencing `Branch`.
- `name` (string): Station name (e.g., "Grill Station", "Bar", "Coffee Shop").
- `createdAt` (string): ISO timestamp.

### 4. `Category` (Menu Categories)
*Determines the structure of the menu catalog.*
- `id` (string): Unique identifier.
- `tenantId` (string): Foreign key referencing `Tenant`.
- `name` (string): Category name (e.g., "Traditional Stews").
- `orderNum` (number): Sort-order weight.
- `icon` (string): Icon identifier string.
- `translations` (object, optional): Supports translations (e.g., `{ am?: string }` for Amharic).
- `createdAt` (string): ISO timestamp.

### 5. `MenuItem` (Catalog Products)
*Detailed records representing food, beverages, or physical products.*
- `id` (string): Unique identifier.
- `tenantId` (string): Foreign key referencing `Tenant`.
- `categoryId` (string): Foreign key referencing `Category`.
- `preparationStationId` (string): Target cooking station (`PreparationStation`).
- `name` (string): Default name in English.
- `description` (string): Default descriptive text.
- `price` (number): Base price tag.
- `photoUrl` (string, optional): Product visual image source.
- `allergenTags` (string[]): Visual tags for user allergies (e.g., `["Gluten", "Nuts"]`).
- `dietaryTags` (string[]): Lifestyle tags (e.g., `["Vegan", "Keto"]`).
- `isAvailable` (boolean): Flag indicating if item is in stock.
- `modifiers` (`ModifierGroup[]`): Customization groups.
- `translations` (object, optional): Amharic translation translation matrix (`{ am?: { name: string, description: string } }`).
- `createdAt` (string): ISO timestamp.

### 6. `Table` (Floor Layouts)
*Physical dining space units assigned to specific branches.*
- `id` (string): Unique identifier.
- `branchId` (string): Foreign key referencing `Branch`.
- `number` (string): Display label (e.g., "Table 1", "Terrace Row 2").
- `section` (string): Layout zone classification.
- `status` (`'vacant' | 'eating' | 'dirty'`): Live status state.
- `createdAt` (string): ISO timestamp.

### 7. `Order` (Transaction Registers)
*The master transactional record for placed customer bills.*
- `id` (string): Unique identifier.
- `tenantId` (string): Foreign key referencing `Tenant`.
- `branchId` (string): Foreign key referencing `Branch`.
- `tableId` (string, optional): Dynamic reference to dining `Table`.
- `orderNum` (string): Structured billing number.
- `type` (`'dine_in' | 'pickup'`): Operational routing.
- `customerName` (string, optional): Customer's name.
- `customerPhone` (string, optional): Customer's phone number.
- `items` (`OrderItem[]`): Structured array of ordered dishes.
- `subtotal` (number): Item-only cost.
- `tax` (number): Computed sales tax.
- `discount` (number): Discount amount.
- `total` (number): Final payment sum.
- `status` (`'placed' | 'confirmed' | 'cooking' | 'ready' | 'completed' | 'cancelled'`): Master workflow state.
- `paymentStatus` (`'unpaid' | 'paid'`): Ledger state.
- `paymentMethod` (`'cash' | 'card' | 'mobile_money'`): Settlement route.
- `paymentVerificationStatus` (`'none' | 'pending' | 'verified' | 'rejected'`): Transfer validation.
- `paymentReceiptUrl` (string, optional): Receipt image (base64 or URL).
- `pickupTime` (string, optional): Requested pickup timestamp.
- `feedbackRating` (number, optional): Rating score.
- `feedbackText` (string, optional): Review text.
- `createdAt` (string): ISO timestamp.

### 8. `Staff` (Roster Logins)
*Internal system users mapped to specialized workspaces.*
- `id` (string): Unique identifier.
- `tenantId` (string): Foreign key referencing `Tenant`.
- `branchId` (string): Foreign key referencing `Branch`.
- `name` (string): Staff member's name.
- `email` (string): Login credential.
- `role` (`UserRole`): RBAC role.
- `stationId` (string, optional): Map coordinates to a `PreparationStation` (KDS).
- `active` (boolean): Active status flag.
- `createdAt` (string): ISO timestamp.

### 9. `SystemLog` (Audit & Telemetry)
*Audits platform changes and actions.*
- `id` (string): Unique identifier.
- `tenantId` (string, optional): Reference ID.
- `userEmail` (string): Acting user.
- `role` (string): Acting role.
- `action` (string): Event type.
- `details` (string): Description.
- `timestamp` (string): ISO timestamp.

### 10. `CampaignAd` (Promotions)
*SaaS ad assets managed by administrators.*
- `id` (string): Unique identifier.
- `title` (string): Banner heading.
- `subtitle` (string): Summary.
- `imageUrl` (string): Banner asset source.
- `tenantId` (string, optional): Target business mapping.
- `active` (boolean): Visibility state.
- `createdAt` (string): ISO timestamp.

---

## 6. Authentication & Authorization

### Login Simulation
Authentication runs on a simulated email-based protocol managed in `AppContext.tsx`:
- **Super Admin Credentials:** Entering `admin@menuflow.com` or `naolnigatu2025@gmail.com` automatically logs the user in as `Super Administrator`.
- **Operational Staff Credentials:** If the email matches a record in the `Staff` roster list, they log in scoped to their assigned `branchId`, `tenantId`, and optional KDS `stationId`.
- **Business Owners:** If the email matches a tenant owner's email address, they log in as the workspace `'owner'`.
- **Public Customers:** Default state when no active session is loaded in the browser.

### Authorization
Authorization checks are implemented during component rendering in `App.tsx` and views:
- Dynamic views switch based on `currentUser.role`.
- Actions within view screens verify contextual ownership (e.g., only Cashiers can settle payments, only Chefs can transition KDS states).
- Workspace blocks: If a tenant has a `'suspended'` or `'rejected'` status, non-Super Admin users are blocked with warning screens.

---

## 7. Order Workflow

```text
 [Customer] Places Order (Dine-in / Pickup)
                     │
                     ▼
         Status: 'placed' (Unpaid)
                     │
                     ▼
 [KDS Station] Chef sees prep-ticket ─────────► Updates item state to 'cooking'
                     │                                         │
                     ▼                                         ▼
 [Waiter] Floor notified when ready             Updates item state to 'ready'
                     │                                         │
                     ▼                                         ▼
 [Cashier] processes settlement ◄───────── Updates overall order status to 'ready'
                     │
                     ▼
  Status: 'completed' & 'paid'
```

1. **Order Placement:**
   - Patrons or floor waiters build order lists in `CustomerView` or `WaiterView`.
   - Modifiers are added, and subtotals, tax, and totals are computed.
   - Bank transfers upload screenshot receipts, setting payment verification states to `pending`.
2. **Kitchen Routing:**
   - The KDS tracks active order elements. Items are routed to their assigned stations (e.g., drinks to Bar, steaks to Grill).
   - Chefs transition states from `'pending'` to `'cooking'`, and finally to `'ready'`.
3. **Delivery:**
   - Once items are completed, the overall order status updates to `'ready'`.
   - Waiters view active notifications and deliver orders, changing item states to `'delivered'`.
4. **Billing Settlement:**
   - Cashiers process settlements in `CashierView`.
   - Cashiers can split bills, apply discounts, verify receipt screenshots, and print simulated thermal receipts.
   - Settle operations set `paymentStatus` to `'paid'` and overall order status to `'completed'`.

---

## 8. Menu & Translation Workflow

```text
 [Owner/Manager] Configures Menu Category with English & Amharic Title
                                   │
                                   ▼
 [Catalog Item Builder] Maps Categories, pricing, modifier templates & bilingual texts
                                   │
                                   ▼
 [Customer Switcher] Sets locale context: English (Default) OR Amharic (Locale switch)
                                   │
                                   ▼
 [Client Layout] Renders translated catalog texts dynamically via getTranslatedText()
```

- **Translating Elements:** Categories and items include structured string configurations in English, alongside optional properties for Amharic translations (`translations: { am: "..." }`).
- **Translation Hooks:** When customers toggle the language switcher to `am`, the UI invokes translation hooks (`getTranslatedText` / `getTranslatedCategory`) to dynamically swap fields with their Amharic counterparts.
- **Stock Availability:** Chefs and owners can toggle availability flags. Off-line items are greyed out and blocked from customer carts.

---

## 9. Dashboard Analytics & KPIs

The platform provides operational analytics in `BusinessOwnerView` and `SuperAdminView` using widgets and charts:

### Platform Super Admin KPIs
- **Global Tenants Count:** Total registered businesses.
- **Pending Approvals Count:** Real-time indicator showing active signup requests awaiting verification.
- **Active Campaign Ads:** Tracked platform banners.
- **System Health:** Monitored platform uptime (99.98% healthy).

### Restaurant Tenant KPIs
- **Sales Volume:** Dynamic indicator computing sum of paid customer orders within selected timeframes.
- **Average Ticket Value:** Average customer order size.
- **Total Orders Volume:** Tracked transaction count.
- **Active Table Occupancy:** Live percentage representing occupied tables.

---

## 10. Tenant Architecture

MenuFlow is designed on a **multi-tenant database isolation** architecture simulated on the client side:

- **Restaurant Isolation:** All records—branches, categories, menu items, staff, and orders—contain a `tenantId` property. State filters isolate queries so that users only see data mapped to their tenant space.
- **Tenant Identification:** Customer endpoints extract the active tenant ID from local storage states or active URLs to load the correct menu catalog and brand assets.
- **Shared Resources:** Platform pricing plans and campaign ads are managed centrally by Super Admins. Ads can be targeted globally or scoped to specific restaurant tenants.

---

## 11. Security Model

- **Simulated Auth Boundaries:** The application implements simulated login constraints for user accounts.
- **Client Validation:** Inputs (pricing formats, file types, required fields) undergo validation before being processed.
- **Local Isolation:** Tenant contexts prevent data exposure across workspaces by filtering state queries.

---

## 12. Integrations

The current version of the application implements high-fidelity simulations for external integrations:
1. **QR Engines:** Generates simulated vector matrix maps linked to customer menu endpoints.
2. **Payment Integrations:** Displays local payment structures (Commercial Bank of Ethiopia transfer ledgers) and accepts mock receipt screenshots.
3. **Notification Channels:** Simulates kitchen bell indicators and order progress triggers.

---

## 13. Environment Variables

*These variables are defined in the project configuration templates (`.env.example`):*

- `PORT` (Default: `3000`): Server ingress port (managed by platform proxy).
- `DISABLE_HMR` (Default: `true`): Disables live hot module replacement to ensure UI consistency during development.

---

## 14. Current Limitations

- **State Persistence:** All operational states are saved in browser `localStorage`. Cleared browser caches will reset configurations back to seeded defaults.
- **Simulated Backends:** The codebase does not query a live cloud database.
- **Real-Time Synchronizations:** Operational updates (such as placing customer orders) require running client views on the same local browser to sync state.
- **File Upload Limitations:** Uploaded catalog images are parsed to Base64 and can exhaust local storage limits if large files are processed.

---

## 15. Overall Component & State Flow

```text
                 +-------------------+
                 |    main.tsx       |
                 +---------+---------+
                           |
                           ▼
                 +-------------------+
                 |    App.tsx        |
                 +---------+---------+
                           |
                           ▼
                 +-------------------+
                 |  AppContext.tsx   | <----+ (Syncs to LocalStorage)
                 +---------+---------+      |
                           |                |
         +-----------------+-----------------+
         |                 |                 |
         ▼                 ▼                 ▼
  [CustomerView]     [WaiterView]       [KDSView] (Etc.)
```

- **Component Hierarchy:** The app entry bootstrapper (`main.tsx`) wraps the layout shell (`App.tsx`) with a central context provider (`AppContext.tsx`).
- **Data Flows:** View changes or mutations call context actions, which update the React state. These changes trigger updates in dependent components and are synchronized with local storage.

---

## 16. Improvement Opportunities

1. **Durable Cloud Database:** Transition state management to Firebase Firestore for persistent, real-time data storage across multiple devices.
2. **JSON Web Token Auth:** Implement secure token-based user authentication (such as Firebase Authentication) to secure administrative views.
3. **Real-time Synchronization:** Integrate WebSocket or Firestore listeners to dynamically synchronize orders between customer carts, waiter views, and kitchen boards.
4. **Cloud Media Storage:** Store catalog images in a cloud media bucket (such as Firebase Storage) to avoid the storage limitations of Base64 strings.
5. **Real QR Integration:** Generate standard, scan-compliant QR codes using libraries like `qrcode.react` to allow customers to scan tables with their own devices.

---

*This document serves as an overview of the MenuFlow SaaS platform, outlining its current features, architecture, and path forward.*
