import React from 'react';

const Dimensions =(Wrapper)=> {
return class Dimensions extends React.Component {

    state={
        width: window.innerWidth,
        height:window.innerHeight
    }

    componentWillMount(){
        window.addEventListener("resize",()=>{
            this.setState({
                width: window.innerWidth,
                height:window.innerHeight
            })
        })
    }
    render() {
        return (
          <Wrapper {...this.state}{...this.props}></Wrapper>
        );
    }
}
}
export default Dimensions
