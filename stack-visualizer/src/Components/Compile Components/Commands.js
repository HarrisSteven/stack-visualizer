import React from 'react';
import Grid from '@material-ui/core/Grid';
import './../../App.css'

class Commands extends React.Component {
    render() {
        return(
            <div className="Center">
                
                <h3>Supported Commands</h3>
                
                <Grid container className="CommandContainer">
 
                    <Grid item>
                        <Grid container className = "Column">
                            <Grid item className="Command">
                                <h3>MOV</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>ADD</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>SUB</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>MULT</h3>
                            </Grid>
                        
                   
                            <Grid item className="Command">
                                <h3>push</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>pop</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>LDR</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>STR</h3>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item>
                        <Grid container className = "Column">

                            <Grid item className="Command">
                                <Grid container className="Center">
                                    <Grid item>
                                        <h3>CMP</h3>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item className="Command">
                                <Grid container className="Center">
                                    <Grid item>
                                        <h3>B</h3>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item className="Command">
                                <h3>BEQ</h3>
                            </Grid>

                            <Grid item className="Command">
                                <h3>BNE</h3>
                            </Grid>
                       

                            <Grid item className="Command">
                                <h3>BGT</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>BLT</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>BGE</h3>
                            </Grid>
                            <Grid item className="Command">
                                <h3>BLE</h3>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default Commands;