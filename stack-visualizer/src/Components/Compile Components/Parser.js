import React from 'react';
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Highlight from 'react-highlighter';
import RunOptions from './RunOptions.js';
import ArmInfo from './../ArmInfo.js';
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
            speed: 3,
            lines: [],
            debugCode: "",
            nextInstruction: "",
            compile: false,
            error: false,
            errorInfo: [],
            instructionCount: 0
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    hexToInt = (hex) => {
        console.log("HEXNUM: " + hex);
        while(hex.length < 8) {
            hex = "0" + hex;
        }
        var num = parseInt(hex, 16);
        var maxVal = Math.pow(2, hex.length / 2 * 8);
        if (num > maxVal / 2 - 1) {
            num = num - maxVal;
        }
        return num;
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

    handleCompile = () => {
        this.setState({
            compile: true
        })
        this.checkErrors();
    }

    handleReset = () => {
        console.log("RESETTING");
        let errorInfo;
        if(this.state.compile) {
            errorInfo = this.state.errorInfo;
        }
        else {
            errorInfo = [];
        }
        this.setState({
            line: 0,
            status: 0,
            step: false,
            speed: 3,
            lines: [],
            error: false,
            errorInfo: errorInfo,
            visualize: false,
            visualDisplay: false,
            nextInstruction: "",
            instructionCount: 0
        })
        this.props.clear();
    }

    changeSpeed = (newSpeed) => {
        this.setState({
            speed: newSpeed
        })
    }

    checkErrors = () => {
        let lines = this.getLines();
        let instructionData = this.getInstructions(lines).instructions;
        let newInfo = this.state.errorInfo;

        for(const instruction of instructionData) {
            if(instruction.instruction !== null) {
                let type = instruction.instruction;
                if(type !== "MOV" && type !== "ADD" && type !== "SUB" && type !== "MUL" && type !== "LDR" && type !== "STR" && type !== "push" && type !== "pop" && type !== "B" && type !== "BNE" && type !== "BEQ" && type !== "BGT" && type !== "BLT" && type !== "BGE" && type !== "BLE" && type !== "CMP" && type !== "BX" && type !== "BL") {
                    newInfo.push({instruction: type, line: instruction.line+1});
                }
            }
        }
        this.setState({
            error: true,
            errorInfo: newInfo
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
        console.log(branchData[0]);
        console.log(instructionData.labels);

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
                lines.push(code.substring(begin, i) + " ");
                begin = i+1;
            }
        }
        lines.push(code.substring(begin, code.length) + " ");
        
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if(!(/\S/.test(line))) {
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
                //console.log(line.substring(j, j+1));
                //if(line.substring(j, j+1) === ' ') {
                if(/\s/.test(line.substring(j, j+1))) {
                    //console.log(line.substring(begin, j));
                    //console.log("begin: " + begin + " end: " + j);
                    //console.log(line.substring(j-1, j));
                    switch(instructionCount) {
                        case 0: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, instruction: line.substring(begin, j-1).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(j-1, j) === ":") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: line.substring(begin, j-1).replace(/\s/g, "")});
                                begin = j+1;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: line.substring(begin, j).replace(/\s/g, ""), label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 1: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: line.substring(begin, j-1).replace(/\s/g, ""), arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: line.substring(begin, j).replace(/\s/g, ""), arg2: null, arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 2: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j-1).replace(/\s/g, ""), arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: line.substring(begin, j).replace(/\s/g, ""), arg3: null, arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 3: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j-1).replace(/\s/g, ""), arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: line.substring(begin, j).replace(/\s/g, ""), arg4: null, arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 4: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: line.substring(begin, j-1).replace(/\s/g, ""), arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: line.substring(begin, j).replace(/\s/g, ""), arg5: null, arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 5: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: line.substring(begin, j-1).replace(/\s/g, ""), arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: line.substring(begin, j).replace(/\s/g, ""), arg6: null, instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
                                break;
                            }
                        }
                        case 6: {
                            if(line.substring(j-1, j) === ",") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: line.substring(begin, j-1).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else if(line.substring(begin, j).replace(/\s/g, "") !== "") {
                                instructions.push({line: i, arg1: null, arg2: null, arg3: null, arg4: null, arg5: null, arg6: line.substring(begin, j).replace(/\s/g, ""), instruction: null, label: null});
                                begin = j+1;
                                instructionCount++;
                                break;
                            }
                            else {
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
        //console.log(instructionLines);
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
        
                // When stepping/visualizing, if there is a label on a line by itself, move to the next line
                if(type === "") {
                    line++;
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
                        this.push(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "pop": {
                        this.pop(instructions.slice(begin, i));
                        this.props.setPc(line+3);
                        begin = i;
                        line++;
                        break;
                    }
                    case "AND": {
                        this.bitwise(instructions.slice(begin, i), "AND");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "ORR": {
                        this.bitwise(instructions.slice(begin, i), "ORR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "EOR": {
                        this.bitwise(instructions.slice(begin, i), "EOR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "ASR": {
                        this.bitwise(instructions.slice(begin, i), "ASR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "LSR": {
                        this.bitwise(instructions.slice(begin, i), "LSR");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                    case "LSL": {
                        this.bitwise(instructions.slice(begin, i), "LSL");
                        this.props.setPc(line+3);
                        begin = i; 
                        line++;
                        break;
                    }
                }
            }

            this.setState({
                line: line,
                instructionCount: this.state.instructionCount++
            })
            console.log("TOTALINSTRUCTIONS: " + this.state.instructionCount)
            if(this.state.instructionCount > 50000) {
                this.handleReset();
                alert("Infinite loop or running took too long");
                break;
            }

            if(i <= instructions.length - 1) {
                elem = instructions[i];
            }

            // When running, if there is a label on a line by itself, meaning the next instruction is a label/instruction, move to the next line
            if(elem.label !== null && !(i === instructions.length) && !(this.state.step) && !(this.state.visualize) && i+1 < instructions.length && instructions[i+1].arg1 === null) {
                console.log("SETTING TYPE TO NULL");
                type = "";
            }

            if(elem.instruction !== null) {
                console.log("SETTING TYPE TO: " + elem.instruction);
                type = elem.instruction;
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
        if(this.state.compile) {
            return;
        }
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
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        console.log(arg2);

        let movData = {arg1: arg1, arg2: arg2, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            movData = {arg1: arg1, arg2: arg2, handleSp: true};
        }
        console.log(movData);
        this.props.mov(movData);
    }

    add = (data) => {
        if(this.state.compile) {
            return;
        }
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
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }

        let addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            addData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }
        console.log("ADD: " + "arg1: " + arg1 + " arg2 : " + arg2 + " arg3: " + arg3);
        this.props.add(addData);
    }

    sub = (data) => {
        if(this.state.compile) {
            return;
        }
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
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }
        console.log(arg3);

        let subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};

        if(arg1 === "sp" || arg1 === "SP" || arg1 === "Sp") {
            subData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: true};
        }        
        console.log(subData);
        this.props.sub(subData);

    }

    mul = (data) => {
        if(this.state.compile) {
            return;
        }
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
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
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
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
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
        console.log(name);
        console.log(labels);

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
        if(this.state.compile) {
            return;
        }
        this.props.bl(line);
    }
    
    bx = (reg) => {
        return(this.getRegister(reg));
    }

    push = (data) => {
        if(this.state.compile) {
            return;
        }
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        let arg4 = "";
        let arg5 = "";
        let arg6 = "";
        console.log(data);

        for(const elem of data) {
            if(typeof elem.arg1 === 'string' || data.arg1 instanceof String) {
                arg1 = elem.arg1;
                arg1 = arg1.replace("{", "");
                arg1 = arg1.replace("}", "");
            }
            if(typeof elem.arg2 === 'string' || data.arg1 instanceof String) {
                arg2 = elem.arg2;
                arg2 = arg2.replace("}", "");
            }
            if(typeof elem.arg3 === 'string' || data.arg1 instanceof String) {
                arg3 = elem.arg3;
                arg3 = arg3.replace("}", "");
            }
            if(typeof elem.arg4 === 'string' || data.arg1 instanceof String) {
                arg4 = elem.arg4;
                arg4 = arg4.replace("}", "");
            }
            if(typeof elem.arg5 === 'string' || data.arg1 instanceof String) {
                arg5 = elem.arg5;
                arg5 = arg5.replace("}", "");
            }
            if(typeof elem.arg6 === 'string' || data.arg1 instanceof String) {
                arg6 = elem.arg6;
                arg6 = arg6.replace("}", "");
            }
        }
        let pushData = {arg1: arg1, arg2: arg2, arg3: arg3, arg4: arg4, arg5: arg5, arg6: arg6};

        this.props.push(pushData);
    }

    pop = (data) => {
        if(this.state.compile) {
            return;
        }
        let arg1 = "";
        let arg2 = "";
        let arg3 = "";
        let arg4 = "";
        let arg5 = "";
        let arg6 = "";
        console.log(data);

        for(const elem of data) {
            if(typeof elem.arg1 === 'string' || data.arg1 instanceof String) {
                arg1 = elem.arg1;
                arg1 = arg1.replace("{", "");
                arg1 = arg1.replace("}", "");
            }
            if(typeof elem.arg2 === 'string' || data.arg1 instanceof String) {
                arg2 = elem.arg2;
                arg2 = arg2.replace("}", "");
            }
            if(typeof elem.arg3 === 'string' || data.arg1 instanceof String) {
                arg3 = elem.arg3;
                arg3 = arg3.replace("}", "");
            }
            if(typeof elem.arg4 === 'string' || data.arg1 instanceof String) {
                arg4 = elem.arg4;
                arg4 = arg4.replace("}", "");
            }
            if(typeof elem.arg5 === 'string' || data.arg1 instanceof String) {
                arg5 = elem.arg5;
                arg5 = arg5.replace("}", "");
            }
            if(typeof elem.arg6 === 'string' || data.arg1 instanceof String) {
                arg6 = elem.arg6;
                arg6 = arg6.replace("}", "");
            }
        }
        let popData = {arg1: arg1, arg2: arg2, arg3: arg3, arg4: arg4, arg5: arg5, arg6: arg6};
        
        this.props.pop(popData);
    }

    ldr = (data) => {
        if(this.state.compile) {
            return;
        }
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
            if (offset.substring(1, 3) === "0x") {
                offset = this.hexToInt(offset.substring(3, offset.length));
            }
            else { 
                offset = parseInt(offset.substring(1, offset.length));
            }
        }
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        if(offset === "") {
            offset = null;
        }
        let ldrData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.ldr(ldrData);    
    }

    str = (data) => {
        if(this.state.compile) {
            return;
        }
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
            if (offset.substring(1, 3) === "0x") {
                offset = this.hexToInt(offset.substring(3, offset.length));
            }
            else { 
                offset = parseInt(offset.substring(1, offset.length));
            }
        }
        if(arg2.substring(0, 1) === "#") {
            if (arg2.substring(1, 3) === "0x") {
                arg2 = this.hexToInt(arg2.substring(3, arg2.length));
            }
            else { 
                arg2 = parseInt(arg2.substring(1, arg2.length));
            }
        }
        if(offset === "") {
            offset = null;
        }
        let strData = {arg1: arg1, arg2: arg2, arg3: offset};
        this.props.str(strData);        
    }

    bitwise = (data, func) => {
        if(this.state.compile) {
            return;
        }
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
            if (arg3.substring(1, 3) === "0x") {
                arg3 = this.hexToInt(arg3.substring(3, arg3.length));
            }
            else { 
                arg3 = parseInt(arg3.substring(1, arg3.length));
            }
        }

        let bitData = {arg1: arg1, arg2: arg2, arg3: arg3, handleSp: false};
        this.props.bitwise(bitData, func);
    }

    render() {
        return (
            <Grid container spacing={2} className="Debug">

                <Grid item>
                    {this.state.step || this.state.visualize ? null: <ArmInfo/>}
                </Grid>

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
                                // startAdornment: <InputAdornment position="start"><pre>1     <br></br>2<br></br>3<br></br>4<br></br>5<br></br>6<br></br>7<br></br>8<br></br>9<br></br>10<br></br>11<br></br>12<br></br>13<br></br>14<br></br>15<br></br>16<br></br>17<br></br>18<br></br>19<br></br>20<br></br>21<br></br>22<br></br>23<br></br>24<br></br>25<br></br>26<br></br>27<br></br>28<br></br>29<br></br>30<br></br>31<br></br>32<br></br>33<br></br>34<br></br>35<br></br>36<br></br>37<br></br>38<br></br>39<br></br>40<br></br>41<br></br>42<br></br>43<br></br>44<br></br>45<br></br>46<br></br>47<br></br>48<br></br>49<br></br>50</pre></InputAdornment>,  
                            }} defaultValue={this.state.code} fullWidth="true" id="code" label="Insert ARM Assembly Code" variant="outlined" multiline rows={10} rowsMax={100}></TextField>}
                        </div>

                        {/* {this.state.error ? <h3>Compile Error: Instruction: {this.state.errorInfo.instruction}, line: {this.state.errorInfo.line}</h3> : null} */}
                    </form>

                </Grid>
                {/* <Button onClick={this.handleCompile}>Check for Errors</Button>
                {this.state.compile ? this.state.errorInfo.map(error =>
                    <h4>Do not recognize: '{error.instruction}' on line: {error.line}</h4>): null}
                {this.state.compile ? this.state.errorInfo.length === 0 ? <h4>No errors</h4>: null: null} */}

                <RunOptions handleRun={this.handleRun} visualize={this.state.visualize} startVisualize={this.startVisualize} handleReset={this.handleReset} handleVisualize={this.handleVisualize} speed={this.state.speed} changeSpeed={this.changeSpeed} handleStep={this.handleStep} startStep={this.startStep} step={this.state.step}/>

            </Grid>
    
        )
    }
}

export default Parser;