import * as React from 'react';
import * as GraphExplorer from 'graph-explorer';
import * as LZString from 'lz-string';
import {
  WorkspaceProps,
  Workspace,
  CustomTypeStyle,
  DataProvider,
  Dictionary,
  ElementModel,
  SerializedDiagram,
  ElementIri,
  ElementTemplate,
} from 'graph-explorer';
import { ClassAttributes } from 'react';
// import { Toolbar } from './toolbarCustomization';
import { DefaultToolbar } from './templates/toolbar';
import { TestTemplate } from './templates/testtemplate';
import { DefaultTemplate } from './templates/defaulttemplate';

/**
 * This function returns a color and icon (null everywhere now) to canvas
 *  so that icons can be drawn in the list boxes
 */
const TestTypeStyleBundle = (types: string[]): CustomTypeStyle | undefined => {
  if (
    types.includes('http://www.w3.org/2002/07/owl#Class') ||
    types.includes('http://www.w3.org/2000/01/rdf-schema#Class')
  ) {
    return { color: '#eaac77', icon: null };
  }
  if (types.includes('http://www.w3.org/2002/07/owl#ObjectProperty')) {
    return { color: '#34c7f3', icon: null };
  }
  if (types.includes('http://www.w3.org/2002/07/owl#DatatypeProperty')) {
    return { color: '#34c7f3', icon: null };
  }
  if (
    types.includes('http://xmlns.com/foaf/0.1/Person') ||
    types.includes('http://www.wikidata.org/entity/Q5')
  ) {
    return { color: '#eb7777', icon: null };
  }
  if (types.includes('http://www.wikidata.org/entity/Q6256')) {
    return { color: '#77ca98', icon: null };
  }
  if (
    types.includes('http://schema.org/Organization') ||
    types.includes('http://dbpedia.org/ontology/Organisation') ||
    types.includes('http://xmlns.com/foaf/0.1/Organization') ||
    types.includes('http://www.wikidata.org/entity/Q43229')
  ) {
    return { color: '#77ca98', icon: null };
  }
  if (
    types.includes('http://www.wikidata.org/entity/Q618123') ||
    types.includes('http://www.w3.org/2003/01/geo/wgs84_pos#Point')
  ) {
    return { color: '#bebc71', icon: null };
  }
  if (types.includes('http://www.wikidata.org/entity/Q1190554')) {
    return { color: '#b4b1fb', icon: null };
  }
  if (types.includes('http://www.wikidata.org/entity/Q488383')) {
    return { color: '#53ccb2', icon: null };
  }
  return;
};

/**
 * graph-explorer function fired when the workspace is mounted, this is the point where the
 * data initialization takes place
 */
function onWorkspaceMounted(workspace: Workspace) {
  if (!workspace) {
    return;
  }

  /**
   * the internal model (not related to rdf-js)
   */
  const model = workspace.getModel();
  /**
   * see https://github.com/zazuko/graph-explorer/blob/master/src/graph-explorer/data/sparql/sparqlDataProviderSettings.ts
   *
   * we pickup the OWLRDFSSetting and replace some of the queries with stardog variants
   */
  const SparqlDialect = GraphExplorer.OWLRDFSSettings;
  /**
   * user Stardog defined functions, requires FT search to be enabled
   */
  SparqlDialect.fullTextSearch = {
    prefix: '',
    queryPattern: `
            ?inst rdfs:label ?searchLabel.
            (?searchLabel ?score) <tag:stardog:api:property:textMatch> "\${text}".
        `,
  };
  /**
   * replace filter type for performance improvements
   */
  SparqlDialect.filterTypePattern = '?inst a ?class';

  /**
   * Add public endpoint and refer to our modified dialect
   */
  const initialLayout: {
    dataProvider: DataProvider;
    preloadedElements?: Dictionary<ElementModel>;
    validateLinks?: boolean;
    diagram?: SerializedDiagram;
    hideUnusedLinkTypes?: boolean;
  } = {
    dataProvider: new GraphExplorer.SparqlDataProvider(
      {
        endpointUrl: 'https://ld.zazuko.com/query',
        queryMethod: GraphExplorer.SparqlQueryMethod.GET,
      },
      SparqlDialect
    ),
  };

  // load serialized data from URL if any
  const url = new URL(window.location.href);
  const serialized = (url.hash || '').substr(1);
  if (serialized.length) {
    initialLayout.diagram = JSON.parse(
      LZString.decompressFromBase64(serialized)
    ) as SerializedDiagram;
  }
  model.importLayout(initialLayout);

  /**
   * get the '?resource' search param and load that resource.
   */
  const resource = url.searchParams.get('resource') as ElementIri;
  if (resource) {
    const elm = workspace
      .getModel()
      .dataProvider.elementInfo({ elementIds: [resource] });
    elm.then((arg: { [x: string]: any }) => {
      workspace.getModel().createElement(arg[resource]);
      workspace.forceLayout();
    });
  }
}

/**
 * based on a type return a template to render the specific type
 */
function templateResolver(types: string[]): ElementTemplate | undefined {
  // if we have geos:Geometry then use the test template to draw a map, all other default
  if (types.includes('http://www.opengis.net/ont/geosparql#Geometry')) {
    // see templates/testtemplate.tsx
    return TestTemplate;
  }
  // see defaulttemplate.tsx
  return DefaultTemplate;
}

/**
 * properties for the ReactJS component creation
 */
export const workspaceProps: WorkspaceProps & ClassAttributes<Workspace> = {
  // function to call when workspace is mounted
  ref: onWorkspaceMounted,
  // Typestyleresolver ( see above )
  typeStyleResolver: TestTypeStyleBundle,
  // resolver for templates ( see below )
  elementTemplateResolver: templateResolver,
  languages: [{ code: 'en', label: 'English' }],
  language: 'en',
  onSaveDiagram: (workspace) => {
    console.log(LZString);
    const diagramToSave = workspace.getModel().exportLayout();
    const serializedDiagram = LZString.compressToBase64(
      JSON.stringify(diagramToSave)
    );
    return serializedDiagram;
  },
  toolbar: <DefaultToolbar />,
};
