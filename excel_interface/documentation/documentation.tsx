/* eslint-disable class-methods-use-this */
import documentationObject from '../functions/functions_meta.json';

const { ReactDOM, React, FluentUIReact, Fuse } = window as any; // eslint-disable-line

const functionsObj = documentationObject;

class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      functions: [],
      results: {},
    };
    this.fuzzySearch = this.fuzzySearch.bind(this);
  }

  componentDidMount() {
    this.setState({
      functions: functionsObj.functions,
    });

    this.fuzzy = new globalThis.Fuse(this.state.functions, {
      keys: ['name'],
    });
  }

  UNSAFE_componentWillMount() {
    window._fuzzySearch = new window.Fuse(functionsObj.functions, {
      keys: ['name', 'description'],
    });
  }

  fuzzySearch(input) {
    if (input === '') {
      this.setState({
        functions: functionsObj.functions,
      });
    } else {
      const search = window._fuzzySearch.search(input);
      this.setState({
        functions: search.map((e) => e.item),
      });
    }
  }

  render() {
    const iterParams = (p, idx) => (
        <ul key={idx} className="function_parameters">
          <li>Name: <b>{p.name}</b></li>
          <li>Description: <i>{p.description}</i></li>
          <li>Type: {p.type}</li>
        </ul>
    );
    const listItems = this.state.functions.map((f, idx) => (
        <div key={idx} className="function_card">
          <FluentUIReact.Text variant="large" block>satf.{f.name}</FluentUIReact.Text>
          <FluentUIReact.Text variant="medium">{f.description}</FluentUIReact.Text>
          <FluentUIReact.Text variant="medium" block className="text_with_margin">Parameters:</FluentUIReact.Text>
          {f.parameters.length > 0 && f.parameters.map(iterParams)}
          <FluentUIReact.Text variant="medium" block className="text_with_margin">Returns:</FluentUIReact.Text>
          <ul className="function_parameters">
            <li><b>{f.result.type}</b></li>
          </ul>
        </div>
    ));
    return (
      <div id="root_functions">
        <div className="documentation_intro_text">
          <FluentUIReact.Icon iconName="TextDocument"/>
          <FluentUIReact.Text variant="xLarge" block>Search the documentation</FluentUIReact.Text>
        </div>
        <FluentUIReact.SearchBox className="function_search" placeholder="Search" onChanged={(newValue) => this.fuzzySearch(newValue)} />
        {listItems}
      </div>);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Documentation />
  </React.StrictMode>,
  document.getElementById('root'),
);
