import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Push from './Push Components/Push.js';
import './../App.css';

class StackOperations extends React.Component {
    render() {
        return(
            <div>
                <br></br>

                <Grid container className="ColumnCenter" spacing={6}>
                    <Grid item>
                        <Push pushReg={this.props.pushReg} pushFunc = {this.props.pushFunc}/>
                    </Grid>
                    <Grid item>
                    <Grid container spacing={6} className="Row">
                    <Grid item>
                        <Button size="large" variant="outlined" color="secondary" onClick={this.props.pop}>Pop</Button>
                    </Grid>
                    <Grid item>
                        <Button size="large" variant="outlined" color="secondary" onClick={this.props.clear}>Clear</Button>
                    </Grid>
                    </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default StackOperations;