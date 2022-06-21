import { default as React, useState } from 'react'

function NFTData() {
    const [tokenId, setTokenId] = useState('')

    return (
        <div>
            <h1>
            Get NFT Data
            </h1>
            <h3>
                Cumple con el requerimiento:
            </h3>
            <span>Obtener todos los datos de un NFT identificándolo por la cuenta conectada y el identificador del NFT</span>
            <br/>
            <br/>
            <label className="label">Token ID</label>
            <br/>
            <input type="text" className="inputElement" onChange={(event) => setTokenId(event.target.value)} />
        </div>
    )
}

export default NFTData