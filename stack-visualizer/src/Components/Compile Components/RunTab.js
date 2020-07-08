import React from 'react';
import Button from '@material-ui/core/Button';
import './../../App.css';

class RunTab extends React.Component {
    render() {
        return(
            <div className="RunTab">
                <Button style = {{fontSize: "1.5vh"}} variant="outlined" color="primary" onClick={this.props.handleRun}>Run</Button>
            </div>
        )
    }
}

export default RunTab;
