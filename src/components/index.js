import React, { Component } from 'react';
import axios from 'axios';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone'
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const options = {
    baseURL: '//c17a6d69.ngrok.io',
    url: '/emails',
    method: 'post',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      error: '',
      papaConfig: {
        header: true,
      },
    };
  }

  onDrop = (accepted, rejected) => {
    if (rejected.length > 0) {
      this.setState({
        error: 'Please upload only csv file',
      });
      return;
    }
    const file = accepted[0];
    const reader = new FileReader();
        reader.onload = () => {
            const fileAsBinaryString = reader.result;
            // do whatever you want with the file content
            const data = Papa.parse(fileAsBinaryString, this.state.papaConfig);
            this.setState({data});
        };
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');

        reader.readAsBinaryString(file);
  };

  handleSend = () => {
    const data = this.state.data.data;
    options['data'] = data;
    axios.request(options)
      .then(function (res) {
          console.log(res)
      })
      .catch(function (err) {
          // API call failed...
      });
  };

  getTableDom = () => {
    const header = this.state.data.meta.fields;
    const data = this.state.data.data;
    const computeHeaderColumns = header.map(((field, i) => <TableHeaderColumn key={i}>{field}</TableHeaderColumn>));
    const computeDataRows = data.map((cust, i) => {
    const columns = [];
    for (const column in cust) {
      columns.push(
        <TableRowColumn key={`${cust[column]}-${i}`}>{cust[column]}</TableRowColumn>
      );
    }
    return (
      <TableRow>
        {columns}
      </TableRow>
    );
    });
    return [
      <RaisedButton label="Send" primary={true} onClick={this.handleSend} />,
      <Table selectable={false} fixedHeader={true}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            {computeHeaderColumns}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true}>
          {computeDataRows}
        </TableBody>
      </Table>,
    ];
  };

  render() {
    return (
      <div className="holder">
        <div className="left-holder">
          <Dropzone
            onDrop={this.onDrop}
            accept=".csv, text/plain, application/vnd.ms-excel"
          >
            <p>Try dropping a file here, or click to select file to upload.</p>
              <p>Only *.csv file will be accepted</p>
          </Dropzone>
          {this.state.error && this.state.error}
        </div>
        {
          this.state.data && this.state.data.data.length > 0 ?
          this.getTableDom() : ''
        }
      </div>
    );
  }
}

const MaterialComp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

export default MaterialComp;
