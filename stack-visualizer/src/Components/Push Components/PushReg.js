import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import './../../App.css';

class PushReg extends Component {
  constructor(props) {
    super();
  }

  pushR0 = () => {
    this.props.pushReg("R0");
    this.props.close()
  }

  pushR1 = () => {
    this.props.pushReg("R1");
    this.props.close()
  }

  pushR2 = () => {
    this.props.pushReg("R2");
    this.props.close()
  }

  pushR3 = () => {
    this.props.pushReg("R3");
    this.props.close()
  }

  pushR4 = () => {
    this.props.pushReg("R4");
    this.props.close()
  }

  pushR5 = () => {
    this.props.pushReg("R5");
    this.props.close()
  }

  pushR6 = () => {
    this.props.pushReg("R6");
    this.props.close()
  }

  pushR7 = () => {
    this.props.pushReg("R7");
    this.props.close()
  }

  pushR8 = () => {
    this.props.pushReg("R8");
    this.props.close()
  }

  pushR9 = () => {
    this.props.pushReg("R9");
    this.props.close()
  }

  pushR10 = () => {
    this.props.pushReg("R10");
    this.props.close()
  }

  pushFp = () => {
    this.props.pushReg("fp");
    this.props.close()
  }

  pushR12 = () => {
    this.props.pushReg("R12");
    this.props.close()
  }

  pushSp = () => {
    this.props.pushReg("sp");
    this.props.close()
  }

  pushLr = () => {
    this.props.pushReg("lr");
    this.props.close()
  }

  pushPc = () => {
    this.props.pushReg("pc");
    this.props.close()
  }

  render() {
    return (
        <div>
            <Grid container className="Column">

                <Grid item>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button onClick={this.pushR0} size="large">R0</Button>
                        <Button onClick={this.pushR1} size="large">R1</Button>
                        <Button onClick={this.pushR2} size="large">R2</Button>
                        <Button onClick={this.pushR3} size="large">R3</Button>
                    </ButtonGroup>
                </Grid>

                <Grid item>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button onClick={this.pushR4} size="large">R4</Button>
                        <Button onClick={this.pushR5} size="large">R5</Button>
                        <Button onClick={this.pushR6} size="large">R6</Button>
                        <Button onClick={this.pushR7} size="large">R7</Button>
                    </ButtonGroup>
                </Grid>

                <Grid item>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">                        
                        <Button onClick={this.pushR8} size="large">R8</Button>
                        <Button onClick={this.pushR9} size="large">R9</Button>
                        <Button onClick={this.pushR10} size="large">R10</Button>
                        <Button onClick={this.pushFp} size="large">fp</Button>
                    </ButtonGroup>
                </Grid> 

                <Grid item>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">                        
                        <Button onClick={this.pushR12} size="large">R12</Button>
                        <Button onClick={this.pushSp} size="large">sp</Button>
                        <Button onClick={this.pushLr} size="large">lr</Button>
                        <Button onClick={this.pushPc} size="large">pc</Button>
                    </ButtonGroup>
                </Grid>

            </Grid>
        </div>
      
    );
  }
}

export default PushReg;