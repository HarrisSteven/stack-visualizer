import React from 'react';
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Highlight from 'react-highlighter';
import Stepper from './Stepper.js';
import Timer from './Timer.js';
import Slider from './Slider.js';
import RunOptions from './RunOptions.js';
import './../../App.css';

class Parser extends React.Component {
    constructor(props) {
        super();
        this.state = {
            code: "",
            line: 0,
            status: 0,
            step: false,
            visualize: false,
            speed: 0,
            lines: [],
            debugCode: "",
            nextInstruction: "",
            error: false,
            errorInfo: null
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    startStep = ()  => {
        this.setState({
            step: true
        })
        if(this.state.code === "") {
            this.handleReset();
        }
        this.pointCurInstruction();
    }

    handleStep = () => {
        this.parse(true);
        this.pointCurInstruction();
    }

    handleRun = () => {
        this.parse(false);
    }

    handleVisualize = () => {
        this.pointCurInstruction();
        this.parse(true);
    }

    startVisualize = () => {
        this.setState({
            visualize: true
        })
        if(this.state.code === "") {
            this.handleReset();
        }
        this.pointCurInstruction();
    }

    toggleVisualize = () => {
        this.setState({
            visualDisplay: (!this.state.visualDisplay)
        })
    }

    handleReset = () => {
        console.log("RESETTING");
        this.setState({
            line: 0,
            status: 0,
            step: false,
            lines: [],
            error: false,
            errorInfo: null,
            visualize: false,
            visualDisplay: false,
            nextInstruction: ""
        })
        this.props.clear();
    }

    changeSpeed = (newSpeed) => {
        this.setState({
            speed: newSpeed
        })
    }

    pointCurInstruction = () => {
        let debugCode = "";
        let nextInstruction = "";
        let addStart = false;
        let branch = false;
        let lines = this.getLines();
        let instructionData = this.getInstructions(lines);

        let branchData = [{label: null, instruction: null, arg1: null}];

        for(const instruction of instructionData.instructions) {
            if(instruction.line === this.state.line) {
                if(instruction.instruction !== null) {
                    branchData[0].instruction = instruction.instruction;
                }
                if(instruction.arg1 !== null) {
                    branchData[0].arg1 = instruction.arg1;
                }
            }
        }

        // If the instruction is a branch, we must highlight where it will branch to
        let instruction = branchData[0].instruction;
        if(instruction === "B" || (instruction === "BNE" && this.state.status !== 0) || (instruction === "BEQ" && this.state.status === 0) || (instruction === "BGT" && this.state.status === 1) || (instruction === "BLT" && this.state.status === -1) || (instruction === "BGE" && this.state.status !== -1) || (instruction === "BLE" && this.state.status !== 1) || instruction === "BL" || instruction === "BX") {
            branch = true;
            let line;
            if(instruction === "BX") {
                line = this.bx(branchData[0].arg1) - 1;
                
            }
            else {
                line = this.branch(branchData, instructionData.labels);

            }
            console.log(line);
            for(let i = 0; i < lines.length; i++) {
                let curLine = lines[i];
                if(i === line) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                }
                else {
                    debugCode += (i+1) + " " + curLine + "\n";
                }
            }
        }

        
        
        if(!(this.state.line === lines.length - 1) && !branch) {
            for(let i = 0; i < lines.length; i++) {
                let curLine = lines[i];
                if(this.state.nextInstruction === "" && i === 0) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                    addStart = true;
                }
                else if(i === this.state.line + 1 && !addStart) {
                    nextInstruction = (i+1) + ". " + curLine + "\n";
                    debugCode += (i+1) + ". " + curLine + "\n";
                }
                else {
                    debugCode += (i+1) + " " + curLine + "\n";
                }
            }
        }

        console.log(nextInstruction);
        
        this.setState({
            debugCode: debugCode,
            nextInstruction: nextInstruction
        })

    }

    getRegister = (reg) => {
        switch(reg) {
            case "R0": {return(this.props.register.R0); break;}
            case "R1": {return(this.props.register.R1); break;}
            case "R2": {return(this.props.register.R2); break;}
            case "R3": {return(this.props.register.R3); break;}
            case "R4": {return(this.props.register.R4); break;}
            case "R5": {return(this.props.register.R5); break;}
            case "R6": {return(this.props.register.R6); break;}
            case "R7": {return(this.props.register.R7); break;}
            case "R8": {return(this.props.register.R8); break;}
            case "R9": {return(this.props.register.R9); break;}
            case "R10": {return(this.props.register.R10); break;}
            case "fp": {return(this.props.register.fp); break;}
            case "R12": {return(this.props.register.R12); break;}
            case "sp": {return(this.props.register.sp); break;}
            case "lr": {return(this.props.register.lr); break;}
            case "pc": {return(this.props.register.pc); break;}
        }
    }

    parse = (step) => {
        let lines = this.getLines();
        let instructionData = this.getInstructions(lines);
        this.executeInstructions(instructionData.instructions, instructionData.instructionLines, instructionData.labels, step);
    }

    getLines = () => {
        let lines = [];
        let code = this.state.code;
        console.log(this.state.code);
        let begin = 0;



        for(let i = 0; i < code.length; i++) {
            if(code.substring(i, i+1) === '\n') {
                lines.push(code.substring(begin, i)+" ");
                begin = i+1;
            }
        }

        lines.push(code.substring(begin, code.length)+" ");
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if(line === " ") {
                lines.splice(i, 1);
                i--;
            }
        }

        console.log(lines);
        let newLines = this.state.lines;
        newLines = lines;
        this.setState({
            lines: newLines
        })

        return(lines);
    }

    getInstructions = (lines) => {
        let instructions = [];
        let instructionCount = 0;
        let begin = 0;
        for(let i = 0; i < lines.length; i++) {
            begin = 0;
            instructionCount = 0;
            let line = lines[i];
            for(let j = 0; j < line.length; j++) {
                if(line.substring(j, j+1) === ' ') {
                    switch(instructionCount) {
                        case 0: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, instruction: line.substring(begin, j-1).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(j-1, j) === ":") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, instruction: null, label: line.substring(begin, j-1).replace(/\s/g, "")});
                                begin = j+1;
                                break;
                            }
                            else {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, instruction: line.substring(begin, j).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                        }
                        case 1: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: line.substring(begin, j-1).replace(/\s/g, ""), arg2: null, arg3: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                instructions.push({line: i, arg1: line.substring(begin, j).replace(/\s/g, ""), arg2: null, arg3: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                        }
                        case 2: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j-1).replace(/\s/g, ""), arg3: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j).replace(/\s/g, ""), arg3: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                        }
                        case 3: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j-1).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                        }
                    }
                }
            }
        }

        let curLine = 0;
        let instructionLines = [0];
        let labels = [];
        for(let i = 0; i < instructions.length; i++) {
            let elem = instructions[i];
            if(elem.line !== curLine) {
                instructionLines.push(i);
                curLine++;
            }
            if(elem.label !== null) {
                labels.push(elem);
            }
        }

        console.log(labels);
        console.log(instructionLines);
        console.log(instructions);

        let returnData = {instructions: instructions, instructionLines: instructionLines, labels: labels};
        return(returnData);
    }

    executeInstructions = (instructions, instructionLines, labels, step) => {
        let line = 0;
        let begin = 0;
        let type = "";
        let status = 0;
        let newInstructions = [];
        console.log("Step State: " + step);

        if(step) {
            let curLine = this.state.line;
            console.log("line: " + curLine);
            for(let i = 0; i < instructions.length; i++) {
                let elem = instructions[i];
                if(elem.line === curLine) {
                    newInstructions.push(elem);
                }
            }
            instructions = newInstructions;
            line = curLine;
        }
        console.log(instructions);

        for(let i = 0; i < instructions.length; i++) {
            let elem = instructions[i];
            console.log(elem);

            if((elem.line !== line) || (i === instructions.length - 1)) {
                if(i === instructions.length - 1) {
                    i++;
                    console.log("Incrementing i");
                }
                switch(type) {
                    case "ADD": {
                        this.add(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "SUB": {
                        this.sub(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "MUL": {
                        this.mul(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "MOV": {
                        this.mov(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "LDR": {
                        this.ldr(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "STR": {
                        this.str(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "B": {
                        console.log("Branch");
                        line = this.branch(instructions.slice(begin, i), labels);
                        i = instructionLines[line];
                        begin = i;
                        this.props.setPc(line+3);
                        console.log(line);
                        console.log(i);
                        break;
                    }
                    case "CMP": {
                        this.props.setPc(line+3);
                        status = this.cmp(instructions.slice(begin, i));
                        this.setState({
                            status: status
                        })
                        console.log("Status: " + status);
                        begin = i;
                        line++;
                        break;
                    }
                    case "BGT": {
                        if(step) {
                            status = this.state.status
                        }
                        console.log("status: " + status);
                        if(status === 1) {
                            console.log("BGT Branching");
                            line = this.branch(instructions.slice(begin, i), labels);
                            i = instructionLines[line];
                            console.log(line);
                            console.log(i);
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BLT": {
                        if(step) {
                            status = this.state.status
                        }
                        if(status === -1) {
                            line = this.branch(instructions.slice(begin, i), labels);
                            i = instructionLines[line];
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BEQ": {
                        if(step) {
                            status = this.state.status
                        }
                        if(status === 0) {
                            line = this.branch(instructions.slice(begin, i), labels);                      
                            i = instructionLines[line];
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BNE": {
                        if(step) {
                            status = this.state.status
                        }
                        if(!(status === 0)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            i = instructionLines[line];
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BGE": {
                        if(step) {
                            status = this.state.status
                        }
                        if(!(status === -1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                     
                            i = instructionLines[line];
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BLE": {
                        if(step) {
                            status = this.state.status
                        }
                        if(!(status === 1)) {
                            line = this.branch(instructions.slice(begin, i), labels);                   
                            i = instructionLines[line];
                            begin = i;
                            this.props.setPc(line+3);
                        }
                        else {
                            this.props.setPc(line+3);
                            begin = i;
                            line++;
                        }
                        break;
                    }
                    case "BL": {
                        this.bl(line+2);
                        line = this.branch(instructions.slice(begin, i), labels);                 
                        this.props.setPc(line+3);
                        i = instructionLines[line];
                        begin = i;
                        break;
                    }
                    case "BX": {
                        line = this.bx(instructions.slice(begin, i)[1].arg1) - 1;
                        this.props.setPc(line+3);
                        i = instructionLines[line];
                        begin = i;
                        break;
                    }
                    case "push": {
                        this.push(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "pop": {
                        this.pop(instructions.slice(begin, i))
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                }
            }

            this.setState({
                line: line
            })

            if(i <= instructions.length - 1) {
                elem = instructions[i];
            }

            if(elem.instruction !== null) {
                type = elem.instruction;
                if(!(this.state.step) && type !== "MOV" && type !== "ADD" && type !== "SUB" && type !== "MUL" && type !== "LDR" && type !== "STR" && type !== "push" && type !== "pop" && type !== "B" && type !== "BNE" && type !== "BEQ" && type !== "BGT" && type !== "BLT" && type !== "BGE" && type !== "BLE" && type !== "CMP" && type !== "BX" && type !== "BL") {
                    this.setState({
                        error: true,
                        errorInfo: {instruction: type, line: line+1}
                    })
                }
            }
        }
        
        if(line === this.state.lines.length) {
            this.handleReset();
        }
        if(!(this.state.step) && !(this.state.visualize)) {
            this.handleReset();
        }

    }

    mov = (data) => {
        console.log("move");
        let arg1 = "";
        let arg2 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }
        if(arg2.substring(0, 1) === "#") {
            arg2 = parseInt(arg2.substring(1, arg2.length));
        }

        let movData = {arg1: arg1, arg2: arg2, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            movData = {arg1: arg1, arg2: arg2, handleSp: true};
        }
        console.log(movData);
        this.props.mov(movData);
    }

    add = (data) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg3.substring(0, 1) === "#") {
            arg3 = parseInt(arg3.substring(1, arg3.length));
        }

        let addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }
        console.log("ADD: " + "arg1: " + arg1 + " arg2 : " + arg2 + " arg3: " + arg3);
        this.props.add(addData);
    }

    sub = (data) => {
        console.log("sub");
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg3.substring(0, 1) === "#") {
            arg3 = parseInt(arg3.substring(1, arg3.length));
        }

        let subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }        
        console.log(subData);
        this.props.sub(subData);

    }

    mul = (data) => {
        console.log("mul");
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }    
        if(arg3.substring(0, 1) === "#") {
            arg3 = parseInt(arg3.substring(1, arg3.length));
        }
        let multData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            multData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }     
        this.props.mult(multData);
    }

    cmp = (data) => {
        let arg1 = "";
        let arg2 = "";

        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
        }    
        if(arg2.substring(0, 1) === "#") {
            arg2 = parseInt(arg2.substring(1, arg2.length));
        }
        else {
            arg2 = this.getRegister(arg2);
        }

        arg1 = this.getRegister(arg1);

        console.log("CMP: arg1: " + arg1 + " arg2: " + arg2);
        
        let newStatus = 0;
        if(arg1 > arg2) {
            newStatus = 1;
        }
        else if(arg1 === arg2) {
            newStatus = 0;
        }
        else {
            newStatus = -1;
        }
        
        return(newStatus);
    }

    branch = (data, labels) => {
        let name;
        let line;

        for(let j = 0; j < data.length; j++) {
            let instruction = data[j];
            if(instruction.arg1 !== null) {
                name = data[j].arg1;
            }
        }

        if(isNaN(name)) {
            for(const label of labels) {
                if(name === label.label) {
                    line = label.line;
                }
            }
        }
        else {
            // if there is a label that is this number, use the label instead of the line number
            let existsLabel = false;
            for(const label of labels) {
                if(name === label.label) {
                    line = label.line;
                    existsLabel = true;
                }
            }
            if(!existsLabel) {
                line = (parseInt(name)) - 1;
            }
        }
        return(line);
    }

    bl = (line) => {
        this.props.bl(line);
    }
    
    bx = (reg) => {
        return(this.getRegister(reg));
    }

    push = (data) => {
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        console.log(data);
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                arg3 = elem.arg3;
            }
        }
        arg1 = arg1.substring(1, arg1.length-1);
        let pushData = {arg1: arg1};
        this.props.push(pushData);
    }

    pop = (data) => {
        let arg1 = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
        }
        arg1 = arg1.substring(1, arg1.length-1);
        let popData = {arg1: arg1};
        this.props.pop(popData);
    }

    ldr = (data) => {
        console.log("load");
        let arg1 = "";
        let arg2 = "";
        let offset = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                offset = elem.arg3;
            }
        }    
        if(arg2.substring(0, 1) === "[") {
            arg2 = arg2.substring(1, arg2.length);
        }
        if(arg2.substring(arg2.length - 1, arg2.length) === "]") {
            arg2 = arg2.substring(0, arg2.length - 1);
        }
        if(offset.substring(offset.length - 1, offset.length) === "]") {
            offset = offset.substring(0, offset.length - 1);
        }
        if(offset.substring(0, 1) === "#") {
            offset = parseInt(offset.substring(1, offset.length));
        }
        let ldrData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.ldr(ldrData);    
    }

    str = (data) => {
        let arg1 = "";
        let arg2 = "";
        let offset = "";
        for(const elem of data) {
            if(elem.arg1 !== null) {
                arg1 = elem.arg1;
            }
            if(elem.arg2 !== null) {
                arg2 = elem.arg2;
            }
            if(elem.arg3 !== null) {
                offset = elem.arg3;
            }
        }    
        if(arg2.substring(0, 1) === "[") {
            arg2 = arg2.substring(1, arg2.length);
        }
        if(arg2.substring(arg2.length - 1, arg2.length) === "]") {
            arg2 = arg2.substring(0, arg2.length - 1);
        }
        if(offset.substring(offset.length - 1, offset.length) === "]") {
            offset = offset.substring(0, offset.length - 1);
        }
        if(offset.substring(0, 1) === "#") {
            offset = parseInt(offset.substring(1, offset.length));
        }
        let strData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.str(strData);        
    }

    render() {
        return (
            <Grid container spacing={5} className="Debug">

                    {/* <Grid item>
                        {this.state.step === true  ? 
                        <Stepper lines={this.state.lines} line={this.state.line} step={this.handleStep} type={"Step"}/>
                        // : 
                        // this.state.visualize === true ? 
                        // <Stepper lines={this.state.lines} line={this.state.line} step={this.handleStep} type={""}/>
                        : null}
                    </Grid> */}

                <Grid item>

                <form noValidate autoComplete = "off" onChange = {this.handleChange}>
                    <div className="ArmText">
                        {this.state.visualize || this.state.step ? 
                        <h3>
                        <pre>
                            <Highlight search={this.state.nextInstruction}>{this.state.debugCode}</Highlight>
                        </pre></h3>
                        :
                        <TextField InputProps={{
                            startAdornment: <InputAdornment position="start"><pre>1     <br></br>2<br></br>3<br></br>4<br></br>5<br></br>6<br></br>7<br></br>8<br></br>9<br></br>10<br></br>11<br></br>12<br></br>13<br></br>14<br></br>15<br></br>16<br></br>17<br></br>18<br></br>19<br></br>20<br></br>21<br></br>22<br></br>23<br></br>24<br></br>25<br></br>26<br></br>27<br></br>28<br></br>29<br></br>30<br></br>31<br></br>32<br></br>33<br></br>34<br></br>35<br></br>36<br></br>37<br></br>38<br></br>39<br></br>40<br></br>41<br></br>42<br></br>43<br></br>44<br></br>45<br></br>46<br></br>47<br></br>48<br></br>49<br></br>50</pre></InputAdornment>,  
                        }} defaultValue={this.state.code} fullWidth="true" id="code" label="Insert ARM Assembly Code" variant="outlined" multiline rows={52} rowsMax={52}></TextField>}
                    </div>



                    
                    {/* {this.state.step || this.state.visualize || this.state.visualDisplay ? null : 
                    <Button variant="outlined" color="primary" onClick={this.handleRun}>Run</Button>}
                    {this.state.step || this.state.visualize ? null :
                    <Button variant="outlined" color="primary" onClick={this.toggleVisualize}>Visualize</Button>}
                    

                    {this.state.step ? 
                    <Button variant="outlined" color="primary" onClick={this.handleStep}>Step</Button>
                    :
                    this.state.visualize || this.state.visualDisplay ? null 
                    :
                    <Button variant="outlined" color="primary" onClick={this.startStep}>Step</Button>} */}


                    {this.state.error ?
                        <h3>Compile Error: Instruction: {this.state.errorInfo.instruction}, line: {this.state.errorInfo.line}</h3> : null
                    }
                </form>
                </Grid>

                <RunOptions handleRun={this.handleRun} visualize={this.state.visualize} startVisualize={this.startVisualize} handleReset={this.handleReset} handleVisualize={this.handleVisualize} speed={this.state.speed} changeSpeed={this.changeSpeed} handleStep={this.handleStep} startStep={this.startStep} step={this.state.step}/>


                {/* {this.state.visualDisplay && (!this.state.visualize) ? <Button variant="contained" color="primary" onClick={this.startVisualize}>Start</Button>: null}
                {this.state.visualize || this.state.step ? <Button variant="contained" color="primary" onClick={this.handleReset}>Terminate</Button>: null}

                <Grid item>
                    {this.state.visualize ? <Timer startTimeInSeconds="0" step={this.handleVisualize} speed={this.state.speed} run={this.state.visualize}/> : null}
                </Grid>

                <Grid item>
                    {this.state.visualDisplay && (!this.state.visualize) ? <Slider changeSpeed={this.changeSpeed}/> : null}
                </Grid> */}

            </Grid>
    
        )
    }
}

export default Parser;