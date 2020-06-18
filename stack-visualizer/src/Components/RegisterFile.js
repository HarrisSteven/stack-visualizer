import React from 'react'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tab from './Tab.js';
import Stack from './Stack';
import RegisterFileConfig from './RegisterFileConfig.js';
import Parser from './Compile Components/Parser.js';
import Stepper from './Compile Components/Stepper.js';
import './../App.css';

class RegisterFile extends React.Component {
    constructor() {
        super();
        this.state = {
            register: {
                R0: 0,
                R1: 1,
                R2: 2,
                R3: 3,
                R4: 4,
                R5: 5,
                R6: 6,
                R7: 7,
                R8: 8,
                R9: 9,
                R10: 10,
                fp: 4096,
                R12: 12,
                sp: 4096,
                lr: 1,
                pc: 0
            },
            operation: "",
            destination: "",
            src1: "",
            src2: "",
            immediate: 0,
        }
        this.incSp = this.incSp.bind(this);
        this.decSp = this.decSp.bind(this);
        this.setReg = this.setReg.bind(this);
        this.push = this.push.bind(this);
        this.pop = this.pop.bind(this);
        //this.getRegister = this.getRegister.bind(this);

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    incSp = () => {
        let newReg = this.state.register;
        newReg.sp += 4;
        this.setState({
            register: newReg
        })
    }

    decSp = () => {
        let newReg = this.state.register;
        newReg.sp -= 4;
        this.setState({
            register: newReg
        })
    }

    getRegister = (reg) => {
        switch(reg) {
            case "R0": {return(this.state.register.R0); break;}
            case "R1": {return(this.state.register.R1); break;}
            case "R2": {return(this.state.register.R2); break;}
            case "R3": {return(this.state.register.R3); break;}
            case "R4": {return(this.state.register.R4); break;}
            case "R5": {return(this.state.register.R5); break;}
            case "R6": {return(this.state.register.R6); break;}
            case "R7": {return(this.state.register.R7); break;}
            case "R8": {return(this.state.register.R8); break;}
            case "R9": {return(this.state.register.R9); break;}
            case "R10": {return(this.state.register.R10); break;}
            case "fp": {return(this.state.register.fp); break;}
            case "R12": {return(this.state.register.R12); break;}
            case "sp": {return(this.state.register.sp); break;}
            case "lr": {return(this.state.register.lr); break;}
            case "pc": {return(this.state.register.pc); break;}
        }
    }

    setRegister = (reg, data, newReg) => {
        switch(reg) {
            case "R0": {newReg.R0 = data; break;}
            case "R1": {newReg.R1 = data; break;}
            case "R2": {newReg.R2 = data; break;}
            case "R3": {newReg.R3 = data; break;}
            case "R4": {newReg.R4 = data; break;}
            case "R5": {newReg.R5 = data; break;}
            case "R6": {newReg.R6 = data; break;}
            case "R7": {newReg.R7 = data; break;}
            case "R8": {newReg.R8 = data; break;}
            case "R9": {newReg.R9 = data; break;}
            case "R10": {newReg.R10 = data; break;}
            case "fp": {newReg.fp = data; break;}
            case "R12": {newReg.R12 = data; break;}
            case "sp": {newReg.sp = data; break;}
            case "lr": {newReg.lr = data; break;}
            case "pc": {newReg.pc = data; break;}
        }
    }

    setPc = (line) => {
        let newPc = this.state.register;
        newPc.pc = line;
        this.setState({
            register: newPc
        })
    }

    mov = (data) => {
        let arg2 = data.arg2;
        if(typeof data.arg2 === 'string' || data.arg2 instanceof String) {
            arg2 = this.getRegister(data.arg2);
        }
        let newReg = this.state.register;
        this.setRegister(data.arg1, arg2, newReg);
       
        this.setState({register: newReg});

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }

        this.removeFramesChild();
        console.log(this.state.register);
    }

    add = (data) => {
        console.log(data);
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }      

        console.log(this.state.register);

        console.log(arg2);
        console.log(arg3);

        let sum = arg2+arg3;
        let newReg = this.state.register;
        this.setRegister(data.arg1, sum, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    sub = (data) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   

        let difference = arg2-arg3;
        let newReg = this.state.register;
        this.setRegister(data.arg1, difference, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    mult = (data) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   
        let product = arg2*arg3;
        let newReg = this.state.register;
        this.setRegister(data.arg1, product, newReg);

        if(data.handleSp) {
            this.handleSpChild(this.state.register.sp);
        }
        this.setState({register: newReg});

        this.removeFramesChild();
    }

    ldr = (data) => {
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            console.log("getting value");
            arg3 = this.getRegister(data.arg3);
        }   
        let address = arg2 + arg3;
        this.ldrChild({address: address, reg: data.arg1})
    }

    str = (data) => {
        let arg1 = this.getRegister(data.arg1);
        let arg2 = this.getRegister(data.arg2);
        let arg3 = data.arg3;
        if(typeof data.arg3 === 'string' || data.arg3 instanceof String) {
            arg3 = this.getRegister(data.arg3);
        }   
        let address = arg2 + arg3;
        this.strChild({address: address, value: arg1})
    }

    bl = (line) => {
        let newRegister = this.state.register;
        newRegister.lr = line;
        this.setRegister("lr", line, newRegister);
    }

    push = (data) => {
        if(typeof data === 'string' || data instanceof String) {
            this.pushChild(data);
        }
        else {
            this.pushChild(data.arg1);
        }
    }

    pushFunction = (data) => {
        this.functionChild(data);
    }

    clearStack = () => {
        this.clearChild();
    }
    
    pop = (data) => {
        if(typeof data.arg1 === 'string' || data.arg1 instanceof String) {
            this.popRegChild(data.arg1);
        }
        else {
            this.popChild();
        }
    }

    setReg = (data) => {
        let newReg = this.state.register;
        console.log(data);
        
        switch(data.reg) {
            case "R0": {newReg.R0 = data.value; break;}
            case "R1": {newReg.R1 = data.value; break;}
            case "R2": {newReg.R2 = data.value; break;}
            case "R3": {newReg.R3 = data.value; break;}
            case "R4": {newReg.R4 = data.value; break;}
            case "R5": {newReg.R5 = data.value; break;}
            case "R6": {newReg.R6 = data.value; break;}
            case "R7": {newReg.R7 = data.value; break;}
            case "R8": {newReg.R8 = data.value; break;}
            case "R9": {newReg.R9 = data.value; break;}
            case "R10": {newReg.R10 = data.value; break;}
            case "fp": {newReg.fp = data.value; break;}
            case "R12": {newReg.R12 = data.value; break;}
            case "sp": {newReg.sp = data.value; break;}
            case "lr": {newReg.lr = data.value; break;}
            case "pc": {newReg.pc = data.value; break;}

        }

        this.setState({
            register: newReg
        })
        console.log(this.state.register);
    }

    render() {
        return (
            <div>
                <Grid container className="AppComponents" spacing={10}>
                
                    <Grid item>
                        <Stack setPush={push => this.pushChild = push} setPop={pop => this.popChild = pop} setPopReg={pop => this.popRegChild = pop} setLdr={ldr => this.ldrChild = ldr} setStr={str => this.strChild = str} setSp={sp => this.handleSpChild = sp} setFunction={func => this.functionChild = func} setClear={clear => this.clearChild = clear} register={this.state.register} setRemoveFrames={frames => this.removeFramesChild = frames} incSp={this.incSp} decSp={this.decSp} setReg={this.setReg} setRegister={this.setRegister}/>
                    </Grid>


                    <Grid item>
                        <Grid container className="RegisterFile">

                            <Grid item className="Center">
                                <h1>
                                    Register File
                                </h1>
                            </Grid>

                            <Grid item>
                                <RegisterFileConfig register={this.state.register}/>
                            </Grid>

                        </Grid>
                    </Grid>

                    <Grid item>
                        <Tab register={this.state.register} mov={this.mov} add={this.add} sub={this.sub} mult={this.mult} push={this.push} pop={this.pop} ldr={this.ldr} str={this.str} bl={this.bl} setPc={this.setPc} push={this.push} pop={this.pop} pushFunction={this.pushFunction} clear={this.clearStack}/>
                    </Grid>

                </Grid>
            </div>

        )
    }
}

export default RegisterFile;