import React, { useState, useEffect } from 'react'
 
const CreateQuizzQuestion = (props) => {

    const [answerComponents, setAnswerComponents] = useState([])
    const [numberOfAnswers, setNumberOfAnswers] = useState(0)

    useEffect(() => {
        answers()
    },[numberOfAnswers])

    const answers = () => {

        let elements = []

        for( let i = 0; i < numberOfAnswers; i++ ){
 
            elements.push(     
                <div className="" style={styles.answer} key={i}>      
                    <div className="field answer " style={{paddingLeft:"20px", marginTop:10}} >
                        <div className='columns'>
                            <div className='column is-two-thirds'>
                                <label className="label">Q{props.questionKey + 1} Answer {i + 1}</label>
                                <div className="control">
                                    <input className="input is-rounded" onChange={ (el) => { props.onAnswerChange(el, props.questionKey, i) } } type="text" placeholder="Text input" /> 
                                </div> 
                            </div>
                            <div className='column is-one-third'>
                                <label className="label">Is true:</label>
                                <div className="select">
                                    
                                    <select onChange={ (el) => { props.onIsTrueChange(el.target.value, props.questionKey, i) } }>
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )

        }

        setAnswerComponents(elements)

        if(numberOfAnswers > 0){
            props.onNumberOfAnswersChange(numberOfAnswers, props.questionKey)
        }

    }
 
    return( 
        <div key={props.questionKey} className="question field " style={styles.questionField}>
            
            
            <div className="control">
                  
                <div className='columns'>
                    
                    <div className="column is-two-quarters">
                        <label className="label">Question {props.questionKey + 1}</label>
                        <input className="input" onChange={ (el) => { props.onChange(el) } } type="text" placeholder="Text input" /> 
                    </div>
                    <div className="column is-one-quarter">
                    <label className="label"># answers</label>
                            <div className="select">
                                
                                <select defaultValue={0} onChange={ (el) => { setNumberOfAnswers(el.target.value) } }>
                                    <option disabled selected>0</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>

                    </div>
                    <div className="column is-two-quarter">
                    <label className="label">Type</label>
                            <div className="select">
                                
                                <select defaultValue={0} onChange={ (el) => { props.onTypeChange(el.target.value, props.questionKey) } }>
                                    <option value="singleChoice">Single Choice</option>
                                    <option value="multipleChoice">Multiple Choice</option>
                                </select>
                            </div>

                    </div>

                </div>
                

                        { answerComponents.map((element) => {

                            return element

                        }) }

                    
                    
                
            </div>
            

        </div>
    )
}

const styles = {
    deleteBtn: {
        position: 'absolute',
        right: '-26px',
        top: '42px',
        backgroundColor: '#ff9494'
    },
    questionField:{
        position:'relative',
        paddingLeft:"20px", 
        minHeight:85 
    },
    answer:{
        minWidth: 200
    }
}

export default CreateQuizzQuestion 