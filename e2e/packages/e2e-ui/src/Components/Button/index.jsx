import React from 'react'
import styled from 'styled-components'

const ButtonWrapper = styled.button`
  appearance: none;
  border: none;
  background: white;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
`

export function Button({ text, onClick }) {
  return <ButtonWrapper onClick={onClick}>{text}</ButtonWrapper>
}