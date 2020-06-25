import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.speed);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeSpeed(newValue);
  };

  return (
    <div className={classes.root}>
      
      <Grid container spacing={2}>
        <Grid item>
            <Typography id="continuous-slider" gutterBottom>
                Instructions / sec
            </Typography>
        </Grid>
        <Grid item xs>
          <Slider min={1} step={1} max={6} defaultValue={props.speed} valueLabelDisplay="on" value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          
        </Grid>
      </Grid>
    </div>
  );
}