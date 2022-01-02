
import { useState, useRef } from 'react';
import Basic from './components/Basic';

function App() {
    const textRef = useRef();

    const getIPMask = () => {
        let rows = textRef.current.value.split("\n");
        let columns = rows.map(row => row.split("\t"));
        return columns  
    }

    const handleClick = () => {
        const addresses = getIPMask();
        let data = "";

        addresses.map( item => data += 
            `interface ${item[0]}\nip address ${item[1]} ${item[2]}\nno shutdown\n`
        );
        navigator.clipboard.writeText(data);

       for (const address in addresses) {
        let ospf =  getNetworkID(addresses[address][1], addresses[address][2]);
        console.log(`network ${ospf.address.join(".")} ${getWildcard(ospf.mask.join("."))} area 0`)
       }
    }

    const getNetworkID = (ip, mask) => {
      const ipArr = ip.split(".");
      const maskArr = mask.split(".");

      const ipMask = {
       "address": ipArr,
       "mask": maskArr,
      }

      const networkID = {...ipMask};

      for (const value in ipMask.mask) {
        if (ipMask.mask[value] !== '255' && ipMask.mask[value] !== '0') {
          let size = getBlockSizeMask(ipMask.mask[value]);
          let netID = Math.floor(ipMask.address[value] / size) * size;
          networkID.address[value] = `${netID}`;
        }
      }
      
      return networkID
    }

    const getBlockSizeMask = mask => {
      const blockSize = {
        "128": 128,
        "192": 64,
        "224": 32,
        "240": 16,
        "248": 8,
        "252": 4,
        "255": 1, 
      }
      return blockSize[mask]
    }

    const getWildcard = mask => {
      const maskArr = mask.split(".");
      for(const maskValue in maskArr) {
        if( maskArr[maskValue] !== '255' ) {
          let wildcard = getBlockSizeMask(maskArr[maskValue]) - 1;
          maskArr[maskValue] = `${wildcard}`
        } else {
          maskArr[maskValue] = '0';
        }
      }
      return maskArr.join(".");
    }

    return (
        <div>
            <textarea
                ref={textRef}
                rows="30"
                cols="150"
                value={`G0/0\t172.16.65.1\t255.255.255.240\nG1/0\t172.16.65.17\t255.255.255.240\nG2/0\t172.16.65.34\t255.255.255.240\nG3/0\t172.16.65.98\t255.255.255.240`}
            />
            <Basic/>
            <button onClick={handleClick}>
              Copy Interfaces Configuration
            </button>
        </div>
    );
}

export default App;
