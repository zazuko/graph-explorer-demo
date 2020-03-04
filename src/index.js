var React = require('react');
var ReactDOM = require('react-dom');

import { DefaultTemplate } from  './templates/defaulttemplate'
import { TestTemplate } from  './templates/testtemplate'

var Ontodia = require('ontodia')

import '../css/explorer.css'

const TestTypeStyleBundle = types => {
    if (types.indexOf('http://www.w3.org/2002/07/owl#Class') !== -1 ||
        types.indexOf('http://www.w3.org/2000/01/rdf-schema#Class') !== -1
    ) {
        return {color: '#eaac77', icon: null};
    } else if (types.indexOf('http://www.w3.org/2002/07/owl#ObjectProperty') !== -1) {
        return {color: '#34c7f3', icon: null};
    } else if (types.indexOf('http://www.w3.org/2002/07/owl#DatatypeProperty') !== -1) {
        return {color: '#34c7f3', icon: null};
    } else if (
        types.indexOf('http://xmlns.com/foaf/0.1/Person') !== -1 ||
        types.indexOf('http://www.wikidata.org/entity/Q5') !== -1
    ) {
        return {color: '#eb7777', icon: null};
    } else if (types.indexOf('http://www.wikidata.org/entity/Q6256') !== -1) {
        return {color: '#77ca98', icon: null};
    } else if (
        types.indexOf('http://schema.org/Organization') !== -1 ||
        types.indexOf('http://dbpedia.org/ontology/Organisation') !== -1 ||
        types.indexOf('http://xmlns.com/foaf/0.1/Organization') !== -1 ||
        types.indexOf('http://www.wikidata.org/entity/Q43229') !== -1
    ) {
        return {color: '#77ca98', icon: null};
    } else if (
        types.indexOf('http://www.wikidata.org/entity/Q618123') !== -1 ||
        types.indexOf('http://www.w3.org/2003/01/geo/wgs84_pos#Point') !== -1
    ) {
        return {color: '#bebc71', icon: null};
    } else if (
        types.indexOf('http://www.wikidata.org/entity/Q1190554') !== -1 
    )
    {
        return {color: '#b4b1fb', icon: null};
    } else if (types.indexOf('http://www.wikidata.org/entity/Q488383') !== -1) {
        return {color: '#53ccb2', icon: null};
   
    } else {
        return undefined;
    }
};

function onWorkspaceMounted(workspace) {
    if (!workspace) { return; }

    const model = workspace.getModel();
    let SparqlDialect = Ontodia.OWLRDFSSettings
    SparqlDialect.fullTextSearch = {
            prefix: '',
            queryPattern: `
            ?inst rdfs:label ?searchLabel.
            (?searchLabel ?score) <tag:stardog:api:property:textMatch> "\${text}".
        `}
    SparqlDialect.filterTypePattern = '?inst a ?class'
  
    model.importLayout({
        dataProvider: new Ontodia.SparqlDataProvider({
            endpointUrl: 'https://trifid-lindas.cluster.ldbar.ch/query',
            queryMethod: Ontodia.SparqlQueryMethod.GET
        }, SparqlDialect),
    });
    
    
    let url = new URL(window.location.href);
    let resource = url.searchParams.get("resource");
    if(resource != null)
    {
    	let elm = workspace.getModel().dataProvider.elementInfo({elementIds: [resource]});
        elm.then(function(arg){
            workspace.getModel().createElement(arg[resource])
            workspace.forceLayout();
        });
    }
}

const props = {
    ref: onWorkspaceMounted,
    typeStyleResolver: TestTypeStyleBundle,
    elementTemplateResolver: templateResolver,
    languages: [
        {code: 'en', label: 'English'},
    ],
    language: 'en'
};

 document.addEventListener('DOMContentLoaded', () => {
        ReactDOM.render(React.createElement(Ontodia.Workspace, props), document.getElementById('onto-container'))
    });
 
 class CustomElementTemplate extends React.Component {
	    render() {
	    	return React.createElement('div', null, `Hello World`);
	    }
	}
 
 function templateResolver(types) {
        if (types.indexOf('http://www.opengis.net/ont/geosparql#Geometry') !== -1) {
	        return TestTemplate;
	    } else {
	        return DefaultTemplate
	    }
	}
 
 
