import React from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

class StepTab extends React.Component {
    render() {
        return(
            <div className="RunTab">
                {this.props.step ? null: <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.startStep}>Start</Button>}
                {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleStep}>Step <ArrowForwardIcon></ArrowForwardIcon></Button>: null} 
                {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="contained" color="primary" onClick={this.props.handleReset}>Terminate</Button>: null}
            </div>
        )
    }
}

export default StepTab;