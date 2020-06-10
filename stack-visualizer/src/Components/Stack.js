import React from 'react'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import './../App.css'

class Stack extends React.Component {
    constructor() {
        super();
        this.state = {
            frames: [4096],
            totalFrames: 1,
            fp: 4096,
        }
    }

    decimalToHex = (decimalNumber) => {
        // char array to store hexadecimal number 
        let hexNum = ["0x"];
       
        // counter for hexadecimal number array 
        let length = 0; 
        while(decimalNumber!=0) {
            // temporary variable to store remainder 
            let temp  = 0; 
           
            // storing remainder in temp variable. 
            temp = decimalNumber % 16; 
           
            // check if temp < 10 
            if(temp < 10) {
                hexNum.push(String.fromCharCode(temp + 48)); 
                length++; 
            } 
            else {
                hexNum.push(String.fromCharCode(temp + 55)); 
                length++; 
            } 
           
            decimalNumber = decimalNumber/16; 
        } 

        let reverse = []
        let j = 0;
        for(let i = 4; i >= 0; i--) {
            reverse[j] = hexNum[i];
            j++;
        }
        return(reverse);
    }

    push = () => {
        let newFp = this.state.fp;
        newFp -= 4;

        let newFrames = this.state.frames;
        newFrames.push(newFp);

        let newCount = this.state.totalFrames;
        newCount++;

        this.setState({
            frames: newFrames,
            totalFrames: newCount,
            fp: newFp
        }) 
    }

    pop = () => {
        if(this.state.totalFrames < 1) {
            alert("Cannot pop an empty stack");
            return;
        }

        let curFrames = this.state.frames;
        curFrames.pop();

        let newCount = this.state.totalFrames;
        newCount--;

        let newFp = this.state.fp;
        newFp += 4;

        this.setState({
            frames: curFrames,
            totalFrames: newCount,
            fp: newFp
        })
    }

    render() {
        return(
            <div className="Stack">
                <h2>
                    This is the Stack, Total frames: {this.state.totalFrames}
                </h2>
                
                <Button color="primary" onClick={this.push}>Push</Button>

                <Button color="secondary" onClick={this.pop}>Pop</Button>

                <br></br>
                <br></br>
                <br></br>
                <br></br>

                {
                    this.state.frames.map(frame =>
                        <div>
                            <Grid container className="Container">
                                {/* <Grid item className="StackItem" sm={6}> */}
                                <Container>
                                    <Typography className="Frame" style={{ height: '10vh', outlineStyle: 'solid', outlineColor: 'black'}}>
                                        {this.decimalToHex(frame).map(char =>
                                            char
                                            )}
                                    </Typography>
                                {/* </Grid> */}
                                </Container>
                            </Grid>
                        </div>
                    )   
                }
            </div>
        )
    }
}

export default Stack;