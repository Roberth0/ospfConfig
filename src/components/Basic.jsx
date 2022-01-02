import { useState } from 'react';

const Basic = () => {

  const [routers, setRouters] = useState(0);
  const [hostname, setHostname] = useState("RR");
  
  
  const handleClick = () => {
    setRouters(routers + 1);

    let basicConfigs = `hostname ${hostname}_R${routers}\nbanner motd ~#Roberth Romero, SCM#~\nusername cisco password cisco\nservice password-encryption\nno ip domain-lookup\nip domain name cisco.com\ncrypto key generate rsa\n1024\nline vty 0 4\ntransport input ssh\nlogin local\n`;
    navigator.clipboard.writeText(basicConfigs);
  }

  const restartHandler = () => {
    setRouters(0);
  }
  
  return (
    <div>
      <form>
        <label htmlFor="hostname">Hostname</label>
        <input type="text" id="hostname" onChange={ e => setHostname(e.target.value) }/> 
      </form>

      <button onClick={handleClick}>Copy Basic Config</button>
      <button onClick={restartHandler}>Restart Router ID</button>
      <p>RouterID: <span style={{color: "green", fontWeight: "bolder"}}>{routers}</span></p>
    </div>
  )
}

export default Basic
