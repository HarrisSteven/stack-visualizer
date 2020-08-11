import React from 'react';
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import './../../App.css';

class RunTab extends React.Component {
    render() {
        return(
            <div className="RunTab">
                {this.props.step ? null : <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleRun}>Run</Button>}
                {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleStep}>Step <ArrowForwardIcon></ArrowForwardIcon></Button>: null} 
                {this.props.step ? <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleContinue}>Continue </Button>: null} 
            </div>
        )
    }
}

export default RunTab;
