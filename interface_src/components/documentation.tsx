import React, { useState } from 'react';
import {
  Text, Icon, SearchBox, initializeIcons,
} from '@fluentui/react';
import Fuse from 'fuse.js-ie11';
import documentationObject from './custom_functions_meta.json';

interface FunctionParameters {
  name: string;
  description: string;
  type: string;
  result: {
    type: string,
  };
  parameters: any[]
}

const fuzzyIndex = new Fuse(documentationObject.functions, {
  keys: ['name', 'description'],
});

function fuzzySearch(str: string): any {
  if (str === '') { return documentationObject.functions; }
  return fuzzyIndex.search(str).map((e) => e.item);
}

function iterParams(p:FunctionParameters, idx:number) {
  return (
    <ul key={idx} className="function_parameters">
      <li>Name: <b>{p.name}</b></li>
      <li>Description: <i>{p.description}</i></li>
      <li>Type: {p.type}</li>
    </ul>
  );
}

function SearchElements(props: any) {
  return props.documentationFunctions.map((f:FunctionParameters, idx:number) => (
    <div key={idx} className="function_card">
      <Text variant="large" block>{f.name}</Text>
      <Text variant="medium">{f.description}</Text>
      <Text variant="medium" block className="text_with_margin">Parameters:</Text>
      {f.parameters.length > 0 && f.parameters.map(iterParams)}
      <Text variant="medium" block className="text_with_margin">Returns:</Text>
      <ul className="function_parameters">
        <li><b>{f.result.type}</b></li>
      </ul>
    </div>
  ));
}

export default function Documentation(): any {
  document.title = 'Documentation';

  const [results, setResults] = useState(documentationObject.functions);

  return (
    <div id="documentation_body">
      <div className="container">
        <div className="header">
          <div className="greet_text">
            <Icon iconName="TextDocument"/>
            <Text variant="xLarge">Search the documentation</Text>
          </div>
          <SearchBox className="function_search" placeholder="Search" onChanged={(newValue) => { setResults(fuzzySearch(newValue)); }} />
        </div>
      </div>
      <div className="card_holder">
        <SearchElements documentationFunctions={results} />
      </div>
    </div>);
}

initializeIcons();
