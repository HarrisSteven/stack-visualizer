import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './../App.css';
import './../styles/Frames.css';

class Frame extends React.Component {
    constructor(props) {
        super();
        this.state = {
            address: props.params.address,
            data: {
                type: props.params.data.type,
                reg: props.params.data.reg,
                value: props.params.data.value,
                arg: props.params.data.arg,
                pos: props.params.data.pos,
            },
        }
    }

    render() {
        return(
            <div>
                {(this.props.params.data.type === "reg") ?
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "RegisterOutline" : "Register"}>
                                <h2>Register <br></br> {this.props.params.data.reg} = {this.props.params.data.value} </h2>
                            </Typography>
                        </Container>
                    </Grid>
                :
                this.props.params.data.type === "var" ?
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "VariableOutline" : "Variable"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                <h2> Local Variable  (fp + {this.props.params.address - this.props.register.fp}) <br></br> {this.props.params.data.value} </h2> 
                                : 
                                <h2> Local Variable  (fp - {Math.abs(this.props.params.address - this.props.register.fp)}) <br></br> {this.props.params.data.value} </h2>}
                            </Typography>
                        </Container>
                    </Grid>
                :
                this.props.params.data.type === "outParam" ?
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "OutParameterOutline" : "OutParameter"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2> Outgoing Parameter (arg {this.props.params.data.arg})  fp + {this.props.params.address - this.props.register.fp} <br></br> {this.props.params.data.value} </h2> 
                                    : 
                                    <h2> Outgoing Parameter (arg {this.props.params.data.arg})  fp - {Math.abs(this.props.params.address - this.props.register.fp)} <br></br> {this.props.params.data.value} </h2>}
                            </Typography>
                        </Container>
                    </Grid>
                : 
                this.props.params.data.type === "empty" ?
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "EmptyOutline" : "Empty"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2> fp + {this.props.params.address - this.props.register.fp} <br></br> {this.props.params.data.value} </h2> 
                                    : 
                                    <h2> fp - {Math.abs(this.props.params.address - this.props.register.fp)} <br></br> {this.props.params.data.value} </h2>}
                            </Typography>
                        </Container>
                    </Grid>
                :
                this.props.params.data.type === "inParam" ?
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "InParameterOutline" : "InParameter"}>
                                {this.props.params.address - this.props.register.fp > 0 ? 
                                    <h2> Incoming Parameter (arg {this.props.params.data.arg})  fp + {this.props.params.address - this.props.register.fp} <br></br> {this.props.params.data.value} </h2> 
                                    : 
                                    <h2> Incoming Parameter (arg {this.props.params.data.arg})  fp - {Math.abs(this.props.params.address - this.props.register.fp)} <br></br> {this.props.params.data.value} </h2>}
                            </Typography>
                        </Container>
                    </Grid>
                :
                    <Grid item className="StackItem">
                        <Container>
                            <Typography className={this.props.params.address <= this.props.register.fp ? "TopOutline" : "Top"}>
                                    <h2>Bottom of Stack</h2> 
                            </Typography>
                        </Container>
                    </Grid>
                }
            </div>
        )
    }
}

export default Frame;