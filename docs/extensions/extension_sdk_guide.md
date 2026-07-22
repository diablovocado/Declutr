# Declutr Extension SDK Guide

The Declutr Extension SDK (`@declutr/extension-sdk`) allows developers to build custom capability extensions that integrate seamlessly into Declutr.

## Supported Extension Types (20 Types)

- `UI_PANEL`, `DASHBOARD_WIDGET`, `SETTINGS_PAGE`, `COMMAND`, `SEARCH_PROVIDER`, `METADATA_EXTRACTOR`, `AI_PROVIDER`, `EMBEDDING_PROVIDER`, `WORKFLOW_ACTION`, `WORKFLOW_TRIGGER`, `NOTIFICATION_PROVIDER`, `IMPORTER`, `EXPORTER`, `STORAGE_PROVIDER`, `AUTH_PROVIDER`, `CONNECTOR_PROVIDER`, `FILE_PREVIEWER`, `THEME`, `LANGUAGE_PACK`, `CLI_EXTENSION`.

## Manifest Definition

`extension.json`:

```json
{
  "id": "ext-pdf-ocr",
  "name": "PDF OCR Extractor",
  "version": "1.0.0",
  "author": "Acme Tools",
  "category": "AI",
  "type": "METADATA_EXTRACTOR",
  "permissions": ["vault.read", "vault.write"],
  "min_declutr_version": "1.0.0"
}
```
