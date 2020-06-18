import React from 'react';
import Grid from '@material-ui/core/Grid';

class RegisterFileConfig extends React.Component {
    constructor(props) {
        super();
        // this.state = {
        //     register: {
        //         r0: props.register.r0,
        //         r1: props.register.r1,
        //         r2: props.register.r2,
        //         r3: props.register.r3,
        //         r4: props.register.r4,
        //         r5: props.register.r5,
        //         r6: props.register.r6,
        //         r7: props.register.r7,
        //         r8: props.register.r8,
        //         r9: props.register.r9,
        //         r10: props.register.r10,
        //         fp: props.register.fp,
        //         r12: props.register.r12,
        //         sp: props.register.sp,
        //         lr: props.register.lr,
        //         pc: props.register.pc
        //     }
        // }
    }

    render() {
        return (
            <Grid item>

                <Grid container spacing={10} className="Row">

                    <Grid item>
                        <Grid container className="Column">
                            <Grid item>
                                <h2>R0: {this.props.register.R0}</h2> 
                            </Grid><Grid item>
                                <h2>R1: {this.props.register.R1}</h2> 
                            </Grid><Grid item>
                                <h2>R2: {this.props.register.R2}</h2> 
                            </Grid><Grid item>
                                <h2>R3: {this.props.register.R3}</h2> 
                            </Grid><Grid item>
                                <h2>R4: {this.props.register.R4}</h2> 
                            </Grid><Grid item>
                                <h2>R5: {this.props.register.R5}</h2> 
                            </Grid><Grid item>
                                <h2>R6: {this.props.register.R6}</h2> 
                            </Grid><Grid item>
                                <h2>R7: {this.props.register.R7}</h2> 
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    <Grid item>
                        <Grid container className="Column">
                            <Grid item>
                                <h2>R8: {this.props.register.R8}</h2> 
                            </Grid><Grid item>
                                <h2>R9: {this.props.register.R9}</h2> 
                            </Grid><Grid item>
                                <h2>R10: {this.props.register.R10}</h2> 
                            </Grid><Grid item>
                                <h2>fp: {this.props.register.fp}</h2> 
                            </Grid><Grid item>
                                <h2>R12: {this.props.register.R12}</h2> 
                            </Grid><Grid item>
                                <h2>sp: {this.props.register.sp}</h2> 
                            </Grid><Grid item>
                                <h2>lr: {this.props.register.lr}</h2> 
                            </Grid><Grid item>
                                <h2>pc: {this.props.register.pc}</h2> 
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        )
    }
}

export default RegisterFileConfig;