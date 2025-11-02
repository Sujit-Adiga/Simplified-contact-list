import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

let NavBar = () => {
    return (
        <React.Fragment>
            <nav className='navbar navbar-expand-sm navbar-gradient'>
                <div className='container'>
                    <Link to={'/'} className="navbar-brand">
                        <i className='fa fa-address-book text-light me-2'/>Contact <span className='text-light fw-semibold'>Manager</span>
                    </Link>
                </div>
            </nav>
        </React.Fragment>
    )
};

export default NavBar;
