import React from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Grid from '@material-ui/core/Grid';
import "../../App.css";

class StepTab extends React.Component {
    render() {
        return(
            <Grid container className="StepTab">
                <Grid container className="StepStartButton">
                    <Grid item>
                        {this.props.step ? null: <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "1vh", minWidth: "4vw", minHeight: "4vh", width: "4vw", height: "4vh"}} variant="contained" color="primary" onClick={this.props.startStep}>Start</Button>}
                    </Grid>
                </Grid>

                <Grid container className="StepButtons">
                    <Grid item>
                        {this.props.step ? <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "1vh", minWidth: "5vw", minHeight: "4vh", width: "5vw", height: "4vh"}} variant="contained" color="primary" onClick={this.props.handleStep}>Step <ArrowForwardIcon></ArrowForwardIcon></Button>: null}
                    </Grid>
                    <Grid item>
                        {this.props.step ? <Button style = {{fontSize: "0.9vw", boxShadow: "0 0 0 0", borderRadius: "1vh", minWidth: "6vw", minHeight: "4vh", width: "6vw", height: "4vh"}} variant="contained" color="primary" onClick={this.props.handleReset}>Terminate</Button>: null}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default StepTab;