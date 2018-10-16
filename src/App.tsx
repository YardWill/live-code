import * as monaco from 'monaco-editor';
import * as React from 'react';
import { Component, createRef } from 'react';
import './App.css';

export interface IProps {
  model: monaco.editor.ITextModel;
  fontSize: number;
  // undo$: Subject<string>;
}

interface IState {
  output: string[];
}

class App extends Component <IProps, IState> {
  public containerRef = createRef<HTMLDivElement>();
  public editor: monaco.editor.IStandaloneCodeEditor | null = null;
  // public output: string[];
  constructor(props: IProps) {
    super(props);
    this.state = {
      output: []
    };
  }

  public componentDidMount() {
    if (this.containerRef.current) {
      this.editor = monaco.editor.create(this.containerRef.current, {
        fontSize: 12,
        model: this.props.model,
        theme: 'vs-dark',
      });
    }
    this.patchConsole();
  }
  public patchConsole() {
    const original = Symbol('original');
    const consoleMethods = ['dir', 'log', 'info', 'error', 'warn', 'assert', 'debug', 'timeEnd', 'trace'];
    consoleMethods.forEach(method => {
      const originMethod = console[method];
      const patchedMethod = (...args: any) => {
        originMethod(...args);
        this.setState({output: [...this.state.output, args.join(' ')]})
      }
      patchedMethod[original] = originMethod;
      console[method] = patchedMethod;
    });
  }
  public exec = () => {
    if (this.editor) {
      try {
        eval(this.editor.getValue())
      } catch (error) {
        this.setState({output: [...this.state.output, new Error(error).toString()]})
      }
    }
  }

  public render() {
    return (
      <div className="App">
        <div onClick={this.exec}>运行</div>
        <div className="sandbox">
          <div ref={this.containerRef} className="editor" />
          <div className="output">
            {this.state.output.map((e, i) => {
              return <div key={i} className="outline">{e}</div>
            })}
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
