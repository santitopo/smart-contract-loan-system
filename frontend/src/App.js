import { default as React } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Metamask from './pages/Metamask'
import NFTData from './pages/NFTData'
import NFTOwner from './pages/NFTOwner'

function App() {
    return (
        <BrowserRouter>
            <>
                <Navbar />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/metamask' element={<Metamask />} />
                    <Route path='/nft_data' element={<NFTData />} />
                    <Route path='/nft_owner' element={<NFTOwner />} />
                </Routes>
            </>
        </BrowserRouter>
    )
}

export default App
