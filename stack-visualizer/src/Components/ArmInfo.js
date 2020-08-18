import React from 'react';
import Grid from '@material-ui/core/Grid';
import './../App.css';
import Instructions from './../Images/SupportedInstructions.png';
import StepTool from './../Images/StepTool.png';
import FunctionTool from './../Images/FunctionTool.png';
import Links from './Links.js';

class ArmInfo extends React.Component {
  render() {
    return (
        <Grid container className = "ArmInfo">
          
          <Grid item style={{height: "94vh"}}>
            <img style={{height: "92vh", width: "65vw"}} src={Instructions} alt="Logo" />
          </Grid>

          <Grid container className="AboutLinks">
            <Grid item style={{width: "24vw", position: "fixed"}}>
              <Links/>
            </Grid>
          </Grid>

          <Grid item style={{marginTop: "5vh", marginBottom: "5vh"}}>
            <img style={{height: "68vh", width: "75vw"}} src={FunctionTool} alt="Logo" />
          </Grid>

          <Grid item>
            <img style={{height: "68vh", width: "75vw"}} src={StepTool} alt="Logo" />
          </Grid>

          

        </Grid>
    );
  }
}

export default ArmInfo;