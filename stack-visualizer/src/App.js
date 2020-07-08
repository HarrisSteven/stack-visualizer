import React from 'react';
import RegisterFile from './Components/RegisterFile';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import './App.css';

function App() {
  return (
    <div>
      <div className="App">
        <h1>
          <AppBar>Stack Visualizer</AppBar>
        </h1>
      </div>

      <br></br>
      <br></br>
      <br></br>

      <Grid container className="AppContainer">
        <Grid item>
          <RegisterFile/>
        </Grid>

      </Grid>
    
    </div>
  );
}

export default App;
