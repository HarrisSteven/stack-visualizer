import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Parser from './Compile Components/Parser.js'
import StackOperations from './StackOperations.js';
import './../App.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "40vh",
  },
}));

export default function SelectTab(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="ARM Text Editor" {...a11yProps(0)} />
          <Tab label="Stack Visualizer" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Grid container className="Row">

            {/* <Grid item>
              <ArmInfo/>
            </Grid> */}
          
            <Grid item>
                <Parser register={props.register} mov={props.mov} add={props.add} sub={props.sub} mult={props.mult} push={props.push} pop={props.pop} bitwise={props.bitwise} ldr={props.ldr} str={props.str} bl={props.bl} setPc={props.setPc} clear={props.clear}/>
            </Grid>
            
            {/* <Grid item>
                <Commands/>
            </Grid> */}
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <StackOperations pushReg={props.push} pushVar={props.pushFunction} pushOutParam={props.pushFunction} pushFunc={props.pushFunction} pushInParam={props.pushFunction} pop={props.pop} clear={props.clear}/>
      </TabPanel>

    </div>
  );
}