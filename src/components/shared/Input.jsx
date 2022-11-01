import React, { useEffect, useState } from 'react'

const Input = (props) => {
  const [inputState, setInputState] = useState("");


  const changeValue = (e) => {
    setInputState(e.target.value)
  }


  useEffect(() => {
    props.onInput(props.id, inputState)
  }, [inputState])

  return (
    <div className='input-field-container'>
      <input
        className='input-field'
        placeholder={props.placeholder}
        type={props.type}
        value={inputState}
        onChange={changeValue}
      />
    </div>
  )
}

export default Input