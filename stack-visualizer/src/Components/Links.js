import React from 'react'
import GhLogo from './../Images/GitHub-Mark/PNG/GitHub-Mark-64px.png';
// import YtLogo from './../Images/youtube_full_color_light_logo/digital_and_tv/yt_logo_rgb_light.png';
// import LiLogo from './../Images/LinkedIn-Logos/LI-In-Bug.png';
import Grid from '@material-ui/core/Grid';

class Links extends React.Component {
    render() {
        return (
            <div>

                <Grid container className="Links">
                    <Grid item style={{padding: "1vw"}}>
                        <a href= "https://github.com/HarrisSteven/stack-visualizer">
                            <img style={{height: "2vw", width: "2vw"}} alt="Github" src={GhLogo}/>
                        </a>
                    </Grid>

                    {/* <Grid item style={{padding: "1vw"}}>
                        <a href= "https://www.linkedin.com/in/steven-harris-37b2511a0/">
                            <img style={{height: "2vw", width: "2vw"}} alt="Linkedin" src={LiLogo}/>
                        </a>
                    </Grid> */}

                    {/* <Grid item style={{paddingTop: "1vw", paddingBottom: "1vw"}}>
                        <a href= "https://youtu.be/vrj8FusFwwI">
                            <img style={{height: "2vw", width: "9vw"}} alt="YouTube" src={YtLogo}/>
                        </a>
                    </Grid> */}
                </Grid>

            </div>

        )
    }
}

export default Links;