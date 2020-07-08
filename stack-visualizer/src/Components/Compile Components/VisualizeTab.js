import React from 'react';
import Button from '@material-ui/core/Button';
import Timer from './Timer.js';
import Slider from './Slider.js';
import './../../App.css';

class VisualizeTab extends React.Component {
    render() {
        return(
            <div className="RowTable">

                <div className="ColumnTable">
                    {this.props.visualize ? null: <Button style = {{fontSize: "1.5vh"}} variant="contained" color="primary" onClick={this.props.startVisualize}>Start</Button>}
                    {this.props.visualize ? <Button style = {{fontSize: "1.5vh"}} variant="contained" color="primary" onClick={this.props.handleReset}>Terminate</Button>: null}
                </div>

                <div className="ColumnTable">       
                    <h3><pre>{this.props.visualize ? <Timer style = {{fontSize: "1.5vh"}} startTimeInSeconds="0" step={this.props.handleVisualize} speed={this.props.speed} run={this.props.visualize}/>: null}</pre></h3>
                    {this.props.visualize ? null: <Slider style = {{fontSize: "1.5vh"}} changeSpeed={this.props.changeSpeed} speed={this.props.speed}/>}
                </div>

            </div>
        )
    }
}

export default VisualizeTab;