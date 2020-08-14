import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Push from './Push Components/Push.js';
import './../App.css';

class StackOperations extends React.Component {
    render() {
        return(
            <div>

                <Grid container className="PushFunctions">
                    <Grid item>
                        <Push pushReg={this.props.pushReg} pushFunc = {this.props.pushFunc}/>
                    </Grid>


                    <Grid item>
                        <Grid container className="Row">
                            <Grid item>
                                <Button style = {{fontSize: "0.7vw", boxShadow: "0 0 0 0", borderRadius: "1vh", minWidth: "8vw", minHeight: "6vh", width: "8vw", height: "6vh"}} size="large" variant="contained" color="secondary" onClick={this.props.pop}>Pop</Button>
                            </Grid>

                            <Grid item>
                                <pre>      </pre>
                            </Grid>

                            <Grid item>
                                <Button style = {{fontSize: "0.7vw", boxShadow: "0 0 0 0", borderRadius: "1vh", minWidth: "8vw", minHeight: "6vh", width: "8vw", height: "6vh"}} size="large" variant="contained" color="secondary" onClick={this.props.clear}>Clear</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default StackOperations;