import documentationObject from '../functions/functions_meta.json';

const { ReactDOM, React, FluentUIReact } = window as any; // eslint-disable-line

const theme = FluentUIReact.getTheme();

const functionsObj = documentationObject;

class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      functions: [],
    };
  }

  componentDidMount() {
    this.setState({
      functions: functionsObj.functions,
    });
  }

  render() {
    const iterParams = (p, idx) => (
        <ul key={idx}>
          <li>{p.description}</li>
          <li>{p.name}</li>
          <li>{p.type}</li>
          <li>{p.optional && 'True'}</li>
        </ul>
    );
    const listItems = this.state.functions.map((f, idx) => (
        <div
          key={idx}
          style={{ boxShadow: theme.effects.elevation8, background: 'red' }}
        >
          <p>{f.description}</p>
          <p>{f.id}</p>
          <p>{f.name}</p>
          {f.parameters.length > 0 && f.parameters.map(iterParams)}
          <p>{f.result.type}</p>
        </div>
    ));
    return <div>{listItems}</div>;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Documentation />
  </React.StrictMode>,
  document.getElementById('root'),
);
