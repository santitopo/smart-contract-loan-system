import { default as React, useState } from 'react'

function NFTOwner() {
    const [tokenId, setTokenId] = useState('')

    return (
        <div>
            <h1>
            Get NFT Owner
            </h1>
            <h3>
                Cumple con el requerimiento:
            </h3>
            <span>Obtener el propietario de un NFT en particular</span>
            <br/>
            <br/>
            <label className="label">Token ID</label>
            <br/>
            <input type="text" className="inputElement" onChange={(event) => setTokenId(event.target.value)} />
        </div>
    )
}

export default NFTOwner