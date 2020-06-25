import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';

export default function ArmInfo() {
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button onClick={handleClickOpen()}><InfoIcon></InfoIcon></Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        //fullWidth={true}
        maxWidth={true}
      >
        <DialogTitle id="scroll-dialog-title">ARM Comiler Info</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
              <h1>
              <pre>
            {
            'Syntax \n \n' + 
            'Registers should be specified as they appear in the register file \'R0\', \'R1\', ..., \'fp\', \'sp\', \'lr\', \'pc\' \n' + 
            'Immediates should be specified with a \'#\' prefix, e.g. #15 or #0xF \n \n \n' + 
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
            'To add a label use \'<LabelName>: <Instruction>\' \n \n \n' +
            'Sample Code \n \n' + 
            'FACTORIAL \n' +
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


              }
                          </pre></h1>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Quit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}