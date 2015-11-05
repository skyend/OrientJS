import React from "react";
import './PageCUForm.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var PageCUForm = React.createClass({
    mixins: [require('../reactMixin/EventDistributor.js')],

    getInitialState(){
        return {
            message: '생성할 페이지의 기본 속성을 정해주세요.',
            savedTitle: ''
        }
    },

    create(){
        var title = this.refs['title'].getValue();

        if (title === '') {
            this.setState({message: "Title을 입력해 주세요."});
            return;
        }

        this.emit("CreateNewPage", {
            title: title
        });
    },

    onThrowCatcherChangedValue(){
    },

    cancel(){
        this.emit("Close");
    },

    successPageCreate(){
        this.emit("Close");
    },

    failPageCreate(){
        alert("Fail create page");
    },

    onChange(){

    },

    render(){
        var classes = ['PageCUForm'];

        return (
            <div className={classes.join(' ')}>

                <div className='fields'>
                    <HorizonField fieldName='title' title='Page Title' theme="dark" enterable={true} type='input'
                                  onChange={ this.onChange }
                                  defaultValue={this.state.savedTitle} height={40} ref='title'
                                  nameWidth={150}/>

                </div>

                <div className='message'>
                    {this.state.message}
                </div>

                <div className='buttons'>
                    <GridBox placements={[
            [
              <OutlineButton color='white' title='Cancel' onClick={this.cancel}/>,
              <OutlineButton color='white' title='Create' onClick={this.create}/>,
            ]
          ]} width={150} height={50}/>

                </div>
            </div>
        )
    }
});

export default PageCUForm;
