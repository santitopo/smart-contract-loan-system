import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { GoThreeBars } from 'react-icons/go'
import { CgClose } from 'react-icons/cg'
import { FaEthereum } from 'react-icons/fa'
import { AiOutlineHome } from 'react-icons/ai'
import './Navbar.css'
import { IconContext } from 'react-icons'

function Navbar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <IconContext.Provider value={{color: '#fff'}}>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <GoThreeBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <CgClose />
                        </Link>
                    </li>
                    <li key="home" className="nav-text">
                        <Link to="/">
                            {AiOutlineHome}
                            <span>Home</span>
                        </Link>
                    </li>
                    <li key="metamask" className="nav-text">
                        <Link to="/metamask">
                            {FaEthereum}
                            <span>Connect to Metamask</span>
                        </Link>
                    </li>
                    <li key="nft_data" className="nav-text">
                        <Link to="/nft_data">
                            {FaEthereum}
                            <span>Get NFT Data</span>
                        </Link>
                    </li>
                    <li key="nft_owner" className="nav-text">
                        <Link to="/nft_owner">
                            {FaEthereum}
                            <span>Get NFT Owner</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </IconContext.Provider>
    )
}

export default Navbar