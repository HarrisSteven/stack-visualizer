import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import PushReg from './PushReg';
import PushVar from './PushVar';
import PushOutParam from './PushOutParam';
import PushInParam from './PushInParam';
import PushFunc from './PushFunc';
import './../../App.css';

export default function Push(props) {
  const [openRegister, setRegister] = React.useState(false);
  const [openVariable, setVariable] = React.useState(false);
  const [openOutParameter, setOutParameter] = React.useState(false);
  const [openInParameter, setInParameter] = React.useState(false);
  const [openFunction, setFunction] = React.useState(false);

  const handleClose = () => {
    setRegister(false);
    setVariable(false);
    setOutParameter(false);
    setInParameter(false);
    setFunction(false);
    //setAnchorEl(null);
  }

  const handleRegister = () => {
    setRegister(true);
  }

  const handleFunction = () => {
    setFunction(true);
  }

  return (
    <div>
  
      <Grid item>
        <Grid container className="Row" spacing={3}>
          
          <Grid item>
            <Button style = {{fontSize: "1.3vh", width: "16vh", height: "5vh"}} onClick={handleRegister} size="large" variant="outlined" color="primary" >Push Register</Button>
          </Grid>
              
          <Grid item>
            <Button style = {{fontSize: "1.3vh", width: "16vh", height: "5vh"}} onClick={handleFunction} size="large" variant="outlined" color="primary" >Push Function</Button>
          </Grid>

        </Grid>
      </Grid>




      <Dialog
        fullWidth={true}
        open={openRegister}
        onClose={handleClose}
        aria-labelledby="upload-dialog-title"
      >
        <DialogTitle id="upload-dialog-title">Push Register</DialogTitle>
        <DialogContent className="Center">
          <PushReg close={handleClose} pushReg={props.pushReg}/>
        </DialogContent>
        <DialogActions>
        </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={true}
          open={openVariable}
          onClose={handleClose}
          aria-labelledby="upload-dialog-title"
        >
            <DialogTitle id="upload-dialog-title">Push Variable</DialogTitle>
            <DialogContent>
              <PushVar close={handleClose} pushVar={props.pushFunc}/>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={true}
          open={openOutParameter}
          onClose={handleClose}
          aria-labelledby="upload-dialog-title"
        >
            <DialogTitle id="upload-dialog-title">Push Parameter</DialogTitle>
            <DialogContent>
              <PushOutParam close={handleClose} pushOutParam={props.pushFunc}/>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={true}
          open={openInParameter}
          onClose={handleClose}
          aria-labelledby="upload-dialog-title"
        >
            <DialogTitle id="upload-dialog-title">Push Parameter</DialogTitle>
            <DialogContent>
              <PushInParam close={handleClose} pushInParam={props.pushFunc}/>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={true}
          open={openFunction}
          onClose={handleClose}
          aria-labelledby="upload-dialog-title"
        >
            <DialogTitle id="upload-dialog-title">Push Function</DialogTitle>
            <DialogContent>
              <PushFunc close={handleClose} pushFunc={props.pushFunc}/>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    </div>
  );
}