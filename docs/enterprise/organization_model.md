# Declutr Organization Model Specification

Organizations act as optional enterprise tenants above Vaults.

## Organization Properties

- **Identity**: ID, Name, Slug, Description, Logo URL.
- **Settings**: Primary Domains, Time Zone, Language, Custom Metadata.
- **Memberships**: `ACTIVE`, `INVITED`, `SUSPENDED`, `DEACTIVATED`.
- **Ownership**: Transferable organization ownership between active members.
- **SSO Framework Abstraction**: Provider configurations for SAML 2.0, OIDC, Azure AD, Google Workspace, and Okta.
