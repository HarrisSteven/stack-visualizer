import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

class Frame extends React.Component {
    constructor() {
        super();
        this.state = {
            address: 1000,
        }
    }

    render() {
        return(
            <div>
                <Container>
                    <Typography>
                        Frame at address {this.state.address}
                    </Typography>
                </Container>
            </div>
        )
    }
}

export default Frame;