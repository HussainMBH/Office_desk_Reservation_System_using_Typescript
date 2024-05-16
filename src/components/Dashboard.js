import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import NavBar from './NavBar';

import styled from 'styled-components';
const ElementStyle = styled.div`
  {
    position: relative;
  }

  .h2, h2 {
    font-size: 1.5rem;
  }

  .ref-wrapper{
    margin-top: 2em;
    font-size: 15px;
    span {
      font-style: italic;
      
    }
  }
`;

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [selSeat, setSelSeat] = useState(null);

  function setSelSeatHandler(id){
    setSelSeat(id); 
  }

  return(
    <ElementStyle>
      <NavBar/>
      <div className='ref-wrapper'>powered by <span>Smart Desk</span></div>
    </ElementStyle>
  )
}
