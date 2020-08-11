import React from 'react'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Frame from './Frame.js'
import './../App.css'

class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            frames: [{
                address: 4096, 
                data: {
                    type: "top",
                }
            }],
            register: {
                R0: props.register.R0,
                R1: props.register.R1,
                R2: props.register.R2,
                R3: props.register.R3,
                R4: props.register.R4,
                R5: props.register.R5,
                R6: props.register.R6,
                R7: props.register.R7,
                R8: props.register.R8,
                R9: props.register.R9,
                R10: props.register.R10,
                fp: props.register.fp,
                R12: props.register.R12,
                sp: props.register.sp,
                lr: props.register.lr,
                pc: props.register.pc
            },
        }
        this.pushByReg = this.pushByReg.bind(this);
        this.pushByVar = this.pushByVar.bind(this);
        this.pushByOutParam = this.pushByOutParam.bind(this);
        this.pushByInParam = this.pushByInParam.bind(this);
        this.pushFunc = this.pushFunc.bind(this);
        this.push = this.push.bind(this);
    }

    componentDidMount() {
        this.props.setPush(this.pushByReg);
        this.props.setPopReg(this.popRegister);
        this.props.setPop(this.pop);
        this.props.setLdr(this.loadByAddress);
        this.props.setStr(this.storeByAddress);
        this.props.setSp(this.setFrames);
        this.props.setFunction(this.handleFuction);
        this.props.setClear(this.clear);
        this.props.setRemoveFrames(this.removeFrames);
        //this.scrollToBottom();
     }

    // scrollToBottom = () => {
    //     this.messagesEnd.scrollIntoView({ behavior: "auto" });
    // }
      
    // componentDidUpdate() {
    //     this.scrollToBottom();
    // }

    decimalToHex = (decimalNumber) => {
        let hexNum = [];
    
        while(decimalNumber!==0) {
            let temp  = 0; 
            temp = decimalNumber % 16; 
           
            if(temp < 10) {
                hexNum.push(String.fromCharCode(temp + 48)); 
            } 
            else {
                hexNum.push(String.fromCharCode(temp + 55)); 
            } 
            decimalNumber = decimalNumber/16; 
        } 

        let reverse = []
        let j = 2;
        for(let i = 3; i >= 0; i--) {
            reverse[j] = hexNum[i];
            j++;
        }
        reverse[0] = '0';
        reverse[1] = 'x';
        return(reverse);
    }

    setFrames = (sp) => {
        // If the sp is moved down, fill space with empty frames
        let lowAddress = this.state.frames[this.state.frames.length - 1].address;
        console.log("low address: " + lowAddress);
        while(sp < lowAddress) {
            lowAddress -= 4;
            this.pushEmpty(lowAddress);
        }
    }

    loadByAddress = (data) => {
        let newFrames = this.state.frames;
        for(const frame of newFrames) {
            if(frame.address === data.address) {
                console.log(frame);
                console.log(frame.data.value);
                this.props.setReg({reg: data.reg, value: frame.data.value});
            }
        }
    }

    storeByAddress = (data) => {
        let newFrames = this.state.frames;
        for(const frame of newFrames) {
            if(frame.address === data.address) {
                frame.data.value = data.value;
            }
        }
        this.setState({
            frames: newFrames
        })
    }

    handleFuction = (data) => {
        if(data.type === "function") {
            this.pushFunc(data);
        }
        if(data.type === "inParam") {
            this.pushByInParam(data);
        }
        if(data.type === "outParam") {
            this.pushByOutParam(data);
        }
        if(data.type === "variable") {
            this.pushByVar(data);
        }
        
    }

    pushFunc = (data) => {
        for(const inParam of data.inParams) {
            this.pushByInParam(inParam);
        }
        for(const reg of data.registers) {
            this.pushByReg(reg);
        }
        for(const variable of data.vars) {
            this.pushByVar(variable);
        }
        for(const outParam of data.outParams) {
            this.pushByOutParam(outParam);
        }

        let newFp = this.state.register;
        newFp.fp = this.state.register.sp - 4;

        for(let i = 0; i < data.outParams.length; i++) {
            newFp.fp += 4;
        }
        for(let i = 0; i < data.registers.length; i++) {
            newFp.fp += 4;
        }
        for(let i = 0; i < data.vars.length; i++) {
            newFp.fp += 4;
        }
        this.setState({
            register: newFp
        })
        this.props.setReg({reg: "fp", value: this.state.register.fp});
    }

    pushByReg = (reg) => {
        console.log(reg);
        let newSp = this.state.register;
        newSp.sp -= 4;

        this.setState({
            register: newSp
        })

        switch(reg) {
            case "R0": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R0", value: this.props.register.R0, arg: null}}); break;}
            case "R1": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R1", value: this.props.register.R1, arg: null}}); break;}
            case "R2": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R2", value: this.props.register.R2, arg: null}}); break;}
            case "R3": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R3", value: this.props.register.R2, arg: null}}); break;}
            case "R4": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R4", value: this.props.register.R4, arg: null}}); break;}
            case "R5": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R5", value: this.props.register.R5, arg: null}}); break;}
            case "R6": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R6", value: this.props.register.R6, arg: null}}); break;}
            case "R7": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R7", value: this.props.register.R7, arg: null}}); break;}
            case "R8": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R8", value: this.props.register.R8, arg: null}}); break;}
            case "R9": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R9", value: this.props.register.R9, arg: null}}); break;}
            case "R10": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R10", value: this.props.register.R10, arg: null}}); break;}
            case "fp": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "fp", value: this.props.register.fp, arg: null}}); break;}
            case "R12": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "R12", value: this.props.register.R12, arg: null}}); break;}
            case "sp": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "sp", value: this.props.register.sp, arg: null}}); break;}
            case "lr": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "lr", value: this.props.register.lr, arg: null}}); break;}
            case "pc": {this.push({address: this.state.register.sp, data: {type: "reg", reg: "pc", value: this.props.register.pc, arg: null}}); break;}
            default: {}
        }
    }

    pushByVar = (variable) => {
        let newSp = this.state.register;
        newSp.sp -= 4;

        this.setState({
            register: newSp
        })

        this.push({address: this.state.register.sp, data: {type: "var", value: variable, arg: null}});
    }

    pushEmpty = (address) => {
        let newSp = this.state.register;
        newSp.sp -= 4;

        this.setState({
            register: newSp
        })

        let newFrames = this.state.frames;
        newFrames.push({address: address, data: {type: "empty", value: 0, arg: null}});

        this.setState({
            frames: newFrames,
        }) 
    }

    pushByOutParam = (parameter) => {
        let newSp = this.state.register;
        newSp.sp -= 4;

        this.setState({
            register: newSp
        })

        this.push({address: this.state.register.sp, data: {type: "outParam", value: parameter.value, arg: parameter.arg}});
    }

    pushByInParam = (parameter) => {
        let newSp = this.state.register;
        newSp.sp -= 4;

        this.setState({
            register: newSp
        })

        this.push({address: this.state.register.sp, data: {type: "inParam", value: parameter.value, arg: parameter.arg}});
    }

    push = (data) => {
        let newFrames = this.state.frames;
        newFrames.push(data);

        this.setState({
            frames: newFrames,
        }) 
        this.props.decSp();
        console.log(this.state.frames);
    }

    pop = () => {
        if(this.state.frames.length < 2) {
            alert("Cannot pop an empty stack");
            return;
        }

        let newSp = this.state.register;
        newSp.sp += 4;

        let curFrames = this.state.frames;
        let frame = curFrames.pop();
        if(frame.data.type === "reg") {
            switch(frame.data.reg) {
                case "R0": {let newReg = this.state.register; newReg.R0 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R0", value: newReg.R0}); break;}
                case "R1": {let newReg = this.state.register; newReg.R1 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R1", value: newReg.R1}); break;}
                case "R2": {let newReg = this.state.register; newReg.R3 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R3", value: newReg.R3}); break;}
                case "R4": {let newReg = this.state.register; newReg.R4 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R4", value: newReg.R4}); break;}
                case "R5": {let newReg = this.state.register; newReg.R5 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R5", value: newReg.R5}); break;}
                case "R6": {let newReg = this.state.register; newReg.R6 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R6", value: newReg.R6}); break;}
                case "R7": {let newReg = this.state.register; newReg.R7 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R7", value: newReg.R7}); break;}
                case "R8": {let newReg = this.state.register; newReg.R8 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R8", value: newReg.R8}); break;}
                case "R9": {let newReg = this.state.register; newReg.R9 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R9", value: newReg.R9}); break;}
                case "R10": {let newReg = this.state.register; newReg.R10 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R10", value: newReg.R10}); break;}
                case "fp": {let newReg = this.state.register; newReg.fp = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "fp", value: newReg.fp}); break;}
                case "R12": {let newReg = this.state.register; newReg.R12 = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "R12", value: newReg.R12}); break;}
                case "sp": {let newReg = this.state.register; newReg.sp = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "sp", value: newReg.sp}); break;}
                case "lr": {let newReg = this.state.register; newReg.lr = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "lr", value: newReg.lr}); break;}
                case "pc": {let newReg = this.state.register; newReg.pc = frame.data.value; this.setState({register: newReg}); this.props.setReg({reg: "pc", value: newReg.pc}); break;}
                default: {}
            }
        }

        this.setState({
            frames: curFrames,
            register: newSp,
        })
        if(frame.data.reg !== "sp") {
            this.props.incSp();
        }
    }

    popRegister = (reg) => {
        let newSp = this.state.register;
        newSp.sp += 4;

        console.log("reg: " + reg);

        let curFrames = this.state.frames;
        let frame = curFrames.pop();

        console.log("DATA: " + frame.data.value);

        switch(reg) {
            case "R0": {this.props.setReg({reg: "R0", value: frame.data.value}); break;}
            case "R1": {this.props.setReg({reg: "R1", value: frame.data.value}); break;}
            case "R2": {this.props.setReg({reg: "R3", value: frame.data.value}); break;}
            case "R4": {this.props.setReg({reg: "R4", value: frame.data.value}); break;}
            case "R5": {this.props.setReg({reg: "R5", value: frame.data.value}); break;}
            case "R6": {this.props.setReg({reg: "R6", value: frame.data.value}); break;}
            case "R7": {this.props.setReg({reg: "R7", value: frame.data.value}); break;}
            case "R8": {this.props.setReg({reg: "R8", value: frame.data.value}); break;}
            case "R9": {this.props.setReg({reg: "R9", value: frame.data.value}); break;}
            case "R10": {this.props.setReg({reg: "R10", value: frame.data.value}); break;}
            case "fp": {this.props.setReg({reg: "fp", value: frame.data.value}); break;}
            case "R12": {this.props.setReg({reg: "R12", value: frame.data.value}); break;}
            case "sp": {this.props.setReg({reg: "sp", value: frame.data.value}); break;}
            case "lr": {this.props.setReg({reg: "lr", value: frame.data.value}); break;}
            case "pc": {this.props.setReg({reg: "pc", value: frame.data.value}); break;}
            default: {}
        }

        this.setState({
            frames: curFrames,
            register: newSp,
        })
        this.props.incSp();
    }

    removeFrames = () => {
        let newFrames = this.state.frames;
        let newRegister = this.state.register;
        for(let i = newFrames.length - 1; i >= 0; i--) {
            let frame = newFrames[i];
            if(frame.address < this.props.register.sp) {
                newFrames.pop();
                newRegister.sp += 4;
            }
        }
        this.setState({
            frames: newFrames,
            register: newRegister
        })
    }

    clear = () => {
        let clearFrames = [{address: 4096, data: {type: "top"}}];
        let clearRegister = this.state.register;
        clearRegister.fp = 4096;
        clearRegister.sp = 4096;
        this.setState({
            frames: clearFrames,
            register: clearRegister
        })
        this.props.setReg({reg: "fp", value: 4096});
        this.props.setReg({reg: "sp", value: 4096});
    }

    render() {
        return(
            <div className="Stack">

                <Grid container className="StackHeader">

                    <Grid item>
                        {this.state.frames.length === 1 ? <h2>Stack ({this.state.frames.length} frame)</h2> :<h2>Stack ({this.state.frames.length} frames)</h2>} 
                    </Grid>

                    <Grid item>
                        <pre>     </pre>
                    </Grid>

                    <Grid item>
                        <Button style = {{fontSize: "1.7vh", width: "8vh", height: "4vh"}} variant="outlined" color="secondary" onClick={this.clear}>Clear</Button>
                    </Grid>

                </Grid>

                <br></br>

                {
                    this.state.frames.map(frame =>
                        <div>
                            <Grid container className="Container"> 
                                {(this.props.register.sp === frame.address && this.props.register.fp === frame.address) ? 
                                    <div>
                                        <Grid item>
                                            {this.decimalToHex(frame.address).map(char => char)}
                                        </Grid>
                                        <Grid item>
                                            fp <ArrowRightAltIcon style = {{fontSize: "2vh"}}></ArrowRightAltIcon>
                                        </Grid>
                                        <Grid item>
                                            sp <ArrowRightAltIcon style = {{fontSize: "2vh"}}></ArrowRightAltIcon>
                                        </Grid>
                                    </div>
                                :    
                                this.props.register.sp === frame.address ?
                                    <div>
                                        <Grid item>
                                            {this.decimalToHex(frame.address).map(char => char)}
                                        </Grid>
                                        <Grid item>
                                            sp <ArrowRightAltIcon style = {{fontSize: "2vh"}}></ArrowRightAltIcon>
                                        </Grid>
                                    </div>
                                :      
                                this.props.register.fp === frame.address ?
                                <div>
                                    <Grid item>
                                        {this.decimalToHex(frame.address).map(char => char)}
                                    </Grid>
                                    <Grid item>
                                        fp <ArrowRightAltIcon style = {{fontSize: "2vh"}}></ArrowRightAltIcon>
                                    </Grid>
                                </div>
                                : 
                                <Grid>
                                    {this.decimalToHex(frame.address).map(char => char)}
                                </Grid>}
                                
                                <Frame params={frame} register={this.props.register}></Frame>

                            </Grid>

                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>

                        </div>
                    )   
                }
            </div>
        )
    }
}

export default Stack;