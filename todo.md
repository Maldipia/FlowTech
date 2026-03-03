# Flowtech SaaS POS — Project TODO

## Phase 1: Database Schema & Infrastructure
- [x] Define tenants table (name, subdomain, business_type, plan, BIR info)
- [x] Define profiles table (tenant_id, user_id, role: admin/manager/cashier)
- [x] Define menu_categories table (tenant_id, name, sort_order)
- [x] Define menu_items table (tenant_id, category_id, name, price, modifiers)
- [x] Define modifiers table (tenant_id, item_id, name, options, price_delta)
- [x] Define tables table (tenant_id, name, capacity, status, section)
- [x] Define orders table (tenant_id, table_id, status, type, cashier_id)
- [x] Define order_items table (tenant_id, order_id, item_id, qty, price, modifiers)
- [x] Define payments table (tenant_id, order_id, method, amount, stripe_ref, bir_receipt_no)
- [x] Define audit_logs table (tenant_id, user_id, action, entity, entity_id, meta)
- [x] Run db:push migrations

## Phase 2: Server-Side DB Helpers & tRPC Routers
- [x] DB helpers for tenants, profiles, menu, orders, payments, logs
- [x] tRPC router: tenant (onboard, get, update)
- [x] tRPC router: auth (me, logout, profile)
- [x] tRPC router: menu (categories CRUD, items CRUD, modifiers CRUD)
- [x] tRPC router: tables (list, create, update status)
- [x] tRPC router: orders (create, addItem, removeItem, updateStatus, getActive)
- [x] tRPC router: payments (process, getByOrder, daily summary)
- [x] tRPC router: reports (zReport, salesSummary, auditLog)
- [x] tRPC router: staff (list, updateRole, deactivate)

## Phase 3: Landing Page & Onboarding
- [x] Public landing page for flowtech.ph (hero, features, pricing, CTA)
- [x] Login / signup flow with role-based redirect
- [x] Tenant onboarding wizard (business info, BIR details, first admin setup)

## Phase 4: POS Interface
- [x] POS layout with sidebar navigation (role-aware)
- [x] Table management view (floor plan grid, status colors)
- [x] Order taking interface (menu grid, item selection, modifier dialog)
- [x] Active order panel (items list, quantities, subtotal)
- [x] Payment modal (cash, card via Stripe, GCash, Maya)
- [x] Quick-service mode (no table, counter orders)

## Phase 5: Menu Management
- [x] Menu categories management page
- [x] Menu items management page
- [x] Modifiers/add-ons management
- [x] Item availability toggle (in-stock / out-of-stock)

## Phase 6: Analytics Dashboard
- [x] Sales overview cards (today revenue, transactions, cash, VAT)
- [x] Top-selling items chart (7-day)
- [x] Payment breakdown bar chart
- [x] Daily summary with VAT breakdown

## Phase 7: BIR Compliance
- [x] BIR-compliant receipt template (all required fields: TIN, PTU, Accreditation No.)
- [x] Receipt number sequence (per tenant, immutable, TENANTID-YYYYMMDD-SEQUENCE)
- [x] Z-Report generation (end-of-day summary, irreversible)
- [x] Z-Report history table
- [x] BIR settings in tenant settings page
- [x] Print receipt functionality (72mm thermal printer format)

## Phase 8: Stripe Integration
- [x] Stripe environment variables configured (STRIPE_SECRET_KEY, VITE_STRIPE_PUBLISHABLE_KEY)
- [x] stripePaymentIntentId field in payments table
- [x] Stripe sandbox claim URL provided
- [ ] Stripe Elements card payment UI (future)
- [ ] Webhook handler for payment confirmation (future)

## Phase 9: Audit Logging
- [x] Automatic logging for all critical actions (orders, payments, Z-reports, staff, menu)
- [x] Audit log viewer (admin only) with pagination
- [x] Action color-coding by type

## Phase 10: Testing & Deployment
- [x] Vitest unit tests — 18 tests passing (BIR, VAT, Z-Report, RBAC, tenant isolation)
- [x] End-to-end flow validation
- [x] Push to GitHub (Maldipia/FlowTech)
- [x] Save checkpoint and deploy to Vercel
- [x] DNS records provided for Hostinger staff

## Future Roadmap
- [ ] Stripe Elements card payment UI
- [ ] Delivery order management
- [ ] Kitchen display system (KDS)
- [ ] Inventory management
- [ ] Multi-location support
- [ ] Customer loyalty program
- [ ] BIR EIS integration (required by Dec 31, 2026)
- [ ] Offline mode / PWA support
- [ ] Mobile app (React Native)
