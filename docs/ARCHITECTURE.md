# Architecture

To understand the architecture of the project, please take a look this document.

## General

There are two main part of the project - **Data Center** and **Data Dash**.

### Data Center

Internal admin portal that allows us to manage assets and resources also users.

- Indexes
- Scrape Management
- Extensions
- Historical Data
- Hierarchies
- Units
- Currencies
- Nations
- Index Providers
- Users
- Permission Groups
- API Keys

### Data Dash

Customer portal where public users can do their managements and trading.

- Index Library
- Index Alerts
- Trading Center
- Portfolio Summary
- Derivatives Trading
- Hedging Home

## Folder Structure

- [Core](../src/app/core)

Models, Services, Guards and Interceptors and also different core constants and utility functions should be defined here.

- [Layout](../src/app/layout)

Layout components including sidebar, menu, navbar and so on should be defined here.

- [UI Kit](../src/app/ui-kit)

Very general and standalone components, directives and pipes should be defined here. Only reusable and minimum functional components here, project specific combined components should be defined in the [Shared](../src/app/shared).

- [Shared](../src/app/shared)

Reusable but not standalone components. Like combination of different other components, such as complex & reusable components can be defined here.

- [Standalone Modals](../src/app/standalone-modals)

Project has standalone modals. These modals can be opened from any places, because they have their own routes and will be opened before the main layout. 

Route example:

```text
/data-center/indexes(standalone-modal:standalone-modal/index-details/687e7bc6-a0c9-3d78-a6d5-7a3d135d3e62/modal)
```

- [Data Center Pages](../src/app/pages/data-center)

All pages for data-center portal like Hierarchy, Users, Permission and so on.

- [Data Dash Pages](../src/app/pages/data-dash)

All pages for data-dash portal like Alert Triggers, Hedging Home and so on.

- [Auth Pages](../src/app/pages/auth)

Authentication pages, like Login, Register, Reset Password and so on.

- [User Pages](../src/app/pages/user)

User profile pages like Account page, Notification page, and so on. These pages are belongs to only current user and not to specific section, neither data-center nor data-dash.

