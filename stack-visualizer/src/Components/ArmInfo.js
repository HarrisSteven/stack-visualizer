import React from 'react';
import './../App.css';

class ArmInfo extends React.Component {
  render() {
    return (
      <div className="ArmInfo">
        <div>
          <h1><pre>{
          'Supported Instructions \n \n' +
          'AND <Register>, <Register>, <Register/Immediate> \n' + 
          'ORR <Register>, <Register>, <Register/Immediate> \n' + 
          'EOR <Register>, <Register>, <Register/Immediate> \n' + 
          'ASR <Register>, <Register>, <Register/Immediate> \n' + 
          'LSR <Register>, <Register>, <Register/Immediate> \n' + 
          'LSL <Register>, <Register>, <Register/Immediate> \n' + 
          'MOV <Register>, <Register/Immediate> \n' + 
          'ADD <Register>, <Register>, <Register/Immediate> \n' + 
          'SUB <Register>, <Register>, <Register/Immediate> \n' + 
          'MUL <Register>, <Register>, <Register/Immediate> \n' + 
          'push {<Register>, <Register>}  (from 1-6 registers) \n' + 
          'pop {<Register>, <Register>}  (from 1-6 registers) \n' + 
          'LDR <Register>, [<Register>, <ImmediateOffset>] OR LDR <Register>, [<Address>] \n' + 
          'STR <Register>, [<Register>, <ImmediateOffset>] OR STR <Register>, [<Address>] \n' + 
          'CMP <Register>, <Register/Immediate> \n' + 
          'B <LabelName> \n' + 
          'BEQ <LabelName> \n' + 
          'BNE <LabelName> \n' + 
          'BGT <LabelName> \n' + 
          'BLT <LabelName> \n' + 
          'BGE <LabelName> \n' + 
          'BLE <LabelName> \n' + 
          'BL <Register> \n' + 
          'To add a label use \'<LabelName>: <Instruction>\' \n \n \n'
          }</pre></h1>
        </div>

        <div>
          <pre><h1>{
          'Sample Factorial Code \n \n' + 
          'MOV R0, #5 \n' +
          'BL fact \n' +
          'B finish \n' +
          'fact: push {R4, fp, lr} \n' +
          'CMP R0, #1 \n' +
          'BLE ret_one \n' +
          'MOV R4, R0 \n' +
          'SUB R0, R0, #1 \n' +
          'BL fact \n' +
          'MUL R0, R0, R4 \n' +
          'B end \n' +
          'ret_one: MOV R0, #1 \n' +
          'end: pop {R4, fp, lr} \n' +
          'BX lr \n' +
          'MOV R0, #3 \n' +
          'BL fact \n' +
          'MOV R2, R0	\n' +				
          'finish: \n' 
          }</h1></pre>
        </div> 

      </div>
    );
  }
}

export default ArmInfo;