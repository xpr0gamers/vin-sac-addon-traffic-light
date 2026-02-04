## SAC Add-on: Traffic Light für Plotarea

Dieses Projekt ist ein SAP Analytics Cloud (SAC) Custom Widget Add-on, das Traffic-Light-Indikatoren in Diagrammen darstellt. Die Hauptlogik liegt in `src/tl-viz-plotarea-general.ts`, die Typdefinitionen in `src/types.ts`.

### Inhalte
- [Überblick](#überblick)
- [Voraussetzungen](#voraussetzungen)
- [Setup](#setup)
- [Build für SAC](#build-für-sac)
- [Projektstruktur](#projektstruktur)
- [Entwicklung](#entwicklung)
- [Lizenz](#lizenz)

### Überblick
Das Add-on erweitert SAC um eine Plotarea-Komponente mit Ampellogik (Traffic Light). Die Komponente wird als Web Component registriert und über die SAC-Extension-API mit Daten versorgt.

### Voraussetzungen
- Node.js (LTS empfohlen)
- npm oder yarn

### Setup
1. Abhängigkeiten installieren:
	- `npm install` oder `yarn`

### Build für SAC
Für den Upload in SAC muss das Add-on gebündelt und als ZIP bereitgestellt werden:
- `npm run build-for-sac` oder `yarn build-for-sac`

Das Build-Skript erzeugt die gebündelten Dateien im Ordner `build/` und erstellt `custom-widget.zip` für den SAC-Upload.

Optionales Clean:
- `npm run clean` oder `yarn clean`

### Projektstruktur
- `src/tl-viz-plotarea-general.ts`: Web Component mit Traffic-Light-Logik
- `src/types.ts`: Typdefinitionen für Daten und Settings
- `sac-config.json`: SAC-Integration und konfigurierbare Eigenschaften
- `tools/vite-build-all-for-sac.ts`: Vite-Build- und Packaging-Logik
- `build/`: Build-Ausgaben für SAC
- `test/fixtures/`: Beispiel-Extension-Daten

### Entwicklung
- TypScript ist im Strict-Mode konfiguriert (siehe `tsconfig.json`).
- Bei Erweiterungen bitte die bestehenden Typen in `src/types.ts` nutzen und neue Settings in `sac-config.json` ergänzen.
- Neue Web Components sollten analog zu `tl-viz-plotarea-general` aufgebaut werden.

### Lizenz
Internes Projekt. Lizenzinformationen bei Bedarf ergänzen.
