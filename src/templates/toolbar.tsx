import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { WorkspaceLanguage } from 'graph-explorer';

export interface ToolbarProps {
  canSaveDiagram?: boolean;
  onSaveDiagram?: () => string;
  canPersistChanges?: boolean;
  onPersistChanges?: () => void;
  onForceLayout?: () => void;
  onClearAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomToFit?: () => void;
  onExportSVG?: (fileName?: string) => void;
  onExportPNG?: (fileName?: string) => void;
  onPrint?: () => void;
  languages?: ReadonlyArray<WorkspaceLanguage>;
  selectedLanguage?: string;
  onChangeLanguage?: (language: string) => void;
  hidePanels?: boolean;
}

const CLASS_NAME = 'graph-explorer-toolbar';

export class DefaultToolbar extends React.Component<
  ToolbarProps,
  { savedDiagram: string; copied: boolean; shortenTooBig: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { savedDiagram: '', copied: false, shortenTooBig: false };
  }

  private onChangeLanguage = (
    event: React.SyntheticEvent<HTMLSelectElement>
  ) => {
    const value = event.currentTarget.value;
    this.props.onChangeLanguage(value);
  };

  private onExportSVG = () => {
    this.props.onExportSVG();
  };

  private onExportPNG = () => {
    this.props.onExportPNG();
  };

  private renderSaveDiagramButton() {
    if (!this.props.onSaveDiagram) {
      return null;
    }
    const onClick = async () => {
      const serializedDiagram = this.props.onSaveDiagram();
      const baseUrl = window.location.href.split('#')[0];
      const restoreUrl = encodeURIComponent(`${baseUrl}#${serializedDiagram}`);

      try {
        const shortURL = await fetch(
          `https://s.zazuko.com/api/v1/shorten?url=${restoreUrl}`
        ).then((resp) => resp.text());
        this.setState({
          savedDiagram: shortURL,
        });
      } catch (err) {
        this.setState({
          shortenTooBig: true,
        });
        setTimeout(() => {
          this.setState({ shortenTooBig: false });
        }, 5000);
      }
    };
    return this.state.savedDiagram || this.state.shortenTooBig ? (
      <CopyToClipboard
        text={this.state.savedDiagram}
        disabled={this.state.shortenTooBig}
        onCopy={() => {
          this.setState({ copied: true });
          setTimeout(() => {
            this.setState({ copied: false, savedDiagram: '' });
          }, 3000);
        }}
      >
        <span className="graph-explorer-btn graph-explorer-btn-default">
          <label className="graph-explorer-label">
            {this.state.shortenTooBig ? (
              <span>This diagram is too big to save.</span>
            ) : (
              <span>
                <a
                  href={this.state.savedDiagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.state.savedDiagram}
                </a>
              </span>
            )}
          </label>
          <br />
          {this.state.copied ? (
            <strong>Copied!</strong>
          ) : (
            <button type="button">Copy URL Clipboard</button>
          )}
        </span>
      </CopyToClipboard>
    ) : (
      <button
        type="button"
        className="saveDiagramButton graph-explorer-btn graph-explorer-btn-primary"
        disabled={this.props.canSaveDiagram === false}
        onClick={onClick}
      >
        <span className="fa fa-floppy-o" aria-hidden="true" /> Save diagram
      </button>
    );
  }

  private renderPersistAuthoredChangesButton() {
    if (!this.props.onPersistChanges) {
      return null;
    }
    return (
      <button
        type="button"
        className="saveDiagramButton graph-explorer-btn graph-explorer-btn-success"
        disabled={this.props.canPersistChanges === false}
        onClick={this.props.onPersistChanges}
      >
        <span className="fa fa-floppy-o" aria-hidden="true" /> Save data
      </button>
    );
  }

  private renderLanguages() {
    const { selectedLanguage, languages } = this.props;
    if (languages.length <= 1) {
      return null;
    }

    return (
      <span
        className={`graph-explorer-btn-group ${CLASS_NAME}__language-selector`}
      >
        <label className="graph-explorer-label">
          <span>Data Language - </span>
        </label>
        <select value={selectedLanguage} onChange={this.onChangeLanguage}>
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </span>
    );
  }

  render() {
    return (
      <div className={CLASS_NAME}>
        <div className="graph-explorer-btn-group graph-explorer-btn-group-sm">
          {this.renderSaveDiagramButton()}
          {this.renderPersistAuthoredChangesButton()}
          {this.props.onClearAll ? (
            <button
              type="button"
              className="graph-explorer-btn graph-explorer-btn-default"
              title="Clear All"
              onClick={this.props.onClearAll}
            >
              <span className="fa fa-trash" aria-hidden="true" />
              &nbsp;Clear All
            </button>
          ) : null}
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Force layout"
            onClick={this.props.onForceLayout}
          >
            <span className="fa fa-sitemap" aria-hidden="true" /> Layout
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Zoom In"
            onClick={this.props.onZoomIn}
          >
            <span className="fa fa-search-plus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Zoom Out"
            onClick={this.props.onZoomOut}
          >
            <span className="fa fa-search-minus" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Fit to Screen"
            onClick={this.props.onZoomToFit}
          >
            <span className="fa fa-arrows-alt" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Export diagram as PNG"
            onClick={this.onExportPNG}
          >
            <span className="fa fa-picture-o" aria-hidden="true" /> PNG
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Export diagram as SVG"
            onClick={this.onExportSVG}
          >
            <span className="fa fa-picture-o" aria-hidden="true" /> SVG
          </button>
          <button
            type="button"
            className="graph-explorer-btn graph-explorer-btn-default"
            title="Print diagram"
            onClick={this.props.onPrint}
          >
            <span className="fa fa-print" aria-hidden="true" />
          </button>
          {this.renderLanguages()}
        </div>
      </div>
    );
  }
}
