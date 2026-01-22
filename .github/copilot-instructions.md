# Copilot Instructions for sac-addon-traffic-light

## Projektüberblick

Dieses Projekt ist ein SAP Analytics Cloud (SAC) Custom Widget Add-on, das Traffic-Light-Indikatoren in Diagrammen darstellt. Die Hauptlogik befindet sich in `src/viz-plotarea-general.ts` und die Typdefinitionen in `src/types.ts`. Die Konfiguration für die SAC-Integration ist in `sac-config.json` hinterlegt.

## Architektur & Komponenten

- **src/viz-plotarea-general.ts**: Implementiert das Web Component `viz-plotarea-general`, das die Traffic-Light-Logik und das Rendering übernimmt.
- **src/types.ts**: Enthält alle Typen und Interfaces, die für die Kommunikation mit der SAC-Extension-API und die Datenstrukturierung benötigt werden.
- **sac-config.json**: Definiert die Extension-Points, Webkomponenten und die konfigurierbaren Eigenschaften für das Add-on.
- **tools/vite-build-all-for-sac.ts**: Build-Skript, das Vite verwendet, um die Komponenten zu bündeln, die Konfiguration zu kopieren und ein ZIP für den SAC-Upload zu erstellen.

## Build-Workflow

- **Build für SAC:**
  - Führe `yarn build-for-sac` oder `npm run build-for-sac` aus.
  - Das Skript erstellt die gebündelten JS-Dateien im `build/`-Verzeichnis, kopiert die Konfiguration und erzeugt ein ZIP (`custom-widget.zip`) für den Upload in SAC.
- **Clean:**
  - Mit `yarn clean` oder `npm run clean` wird das `dist`-Verzeichnis entfernt.

## Konventionen & Patterns

- **TypeScript als Hauptsprache** mit striktem Typing (`strict: true` in `tsconfig.json`).
- **Web Components** werden als Custom Elements registriert (`customElements.define`).
- **SAC-Kommunikation:** Die Methoden `setExtensionData`, `onBeforeUpdate`, `onAfterUpdate` sind für die Integration mit SAC vorgesehen und werden von der Plattform aufgerufen.
- **Eigenschaften/Settings:** Alle konfigurierbaren Eigenschaften sind in `sac-config.json` und `AddOnsReservedSettings` in `src/types.ts` dokumentiert.
- **Keine Tests vorhanden** – Test- und Debug-Workflows sind manuell.

## Integration & externe Abhängigkeiten

- **Vite** für das Bundling.
- **JSZip** zum Erstellen des Upload-ZIPs.
- **SAP Analytics Cloud** als Zielplattform.

## Wichtige Dateien

- `src/viz-plotarea-general.ts`: Beispiel für die Implementierung und Integration der Add-on-Komponente.
- `src/types.ts`: Typdefinitionen für die Extension-Daten und Settings.
- `tools/vite-build-all-for-sac.ts`: Build- und Packaging-Logik.
- `sac-config.json`: Konfiguration für die SAC-Integration.

## Beispiel: Erweiterung einer Komponente

```ts
class MyComponent extends HTMLElement implements IAddOnComponent {
  setExtensionData(data: ExtensionDataType) {
    /* ... */
  }
  onBeforeUpdate?(props: any) {
    /* ... */
  }
  onAfterUpdate?(props: any) {
    /* ... */
  }
}
```

## Hinweise für AI Agents

- Halte dich an die Typdefinitionen aus `src/types.ts`.
- Baue neue Komponenten analog zu `viz-plotarea-general`.
- Passe die Konfiguration in `sac-config.json` an, wenn neue Extension-Points oder Settings benötigt werden.
- Nutze das Build-Skript für die Paketierung.

---

Bitte gib Feedback, falls bestimmte Workflows, Konventionen oder Integrationspunkte unklar oder unvollständig sind.
