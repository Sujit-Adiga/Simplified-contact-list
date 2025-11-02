import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { ContactService } from '../../../services/ContactService';
import Spinner from '../../Spinner/Spinner';
import '../../../App.css'; // shared UI tweaks

let ContactList = () => {

    // search input state
    let [query, setQuery] = useState({
        text : '',
    });

    // main component state
    let [state, setState] = useState({
        loading : false,
        contacts : [],
        filteredContacts : [], // specially for search
        errorMessage : ''
    });

    // load contacts once on mount
    useEffect(() => {
        let isMounted = true;

        const fetchContacts = async () => {
            setState(s => ({ ...s, loading: true }));
            try {
                const response = await ContactService.getALLContacts();
                if (!isMounted) return;
                setState(s => ({ 
                    ...s, 
                    loading: false, 
                    contacts: response.data,
                    filteredContacts: response.data })); // initialize filteredContacts
            } catch (error) {
                if (!isMounted) return;
                setState(s => ({ ...s, loading: false, errorMessage: error.message }));
            }
        };

        fetchContacts();

        return () => { isMounted = false; };
    }, []);

    // delete a contact — confirm, call API, and update lists
    let clickDelete = async (contactId) => {
        try {
            if (!window.confirm('Are you sure you want to delete this contact?')) return;

            // show loader while deleting
            setState(s => ({ ...s, loading: true }));

            const response = await ContactService.deleteContact(contactId);

            if (response && response.status >= 200 && response.status < 300) {
                setState(s => ({
                    ...s,
                    loading: false,
                    contacts: s.contacts.filter(contact => contact.id !== contactId),
                    filteredContacts: (s.filteredContacts || []).filter(contact => contact.id !== contactId)
                }));
            } else {
                setState(s => ({ ...s, loading: false, errorMessage: `Delete failed: ${response?.status}` }));
            }
        } catch (error) {
            setState(s => ({ ...s, loading: false, errorMessage: error.message || 'Delete failed' }));
        }
    }

    // update search text and filtered list
    let searchContacts = (event) => {
        setQuery({
            ...query,
            [event.target.name] : event.target.value
        });
        let theContacts = state.contacts.filter(contact => {
            return contact.name.toLowerCase().includes(event.target.value.toLowerCase())
        });
        setState({
            ...state,
            filteredContacts : theContacts
        });
    };

    let { loading, contacts, filteredContacts, errorMessage } = state;


    return (
        <React.Fragment>
            <section className='contact-search p-4 bg-soft'>
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-md-8'>
                            <h1 className="h3 fw-bold text-primary">Contact Manager</h1>
                            <p className='text-muted small mb-0'>Keep your contacts organised. Select a contact to view, edit or remove.</p>
                        </div>
                        <div className='col-md-4 text-end'>
                            <Link to={'/contacts/add'} className='btn btn-gradient'>
                                <i className='fa fa-plus-circle me-2'/> New Contact
                            </Link>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className="col-md-6">
                            <form className='row g-2' onSubmit={e => e.preventDefault()}>
                                <div className="col-9">
                                    <div className='input-group'>
                                        <span className='input-group-text bg-white'><i className='fa fa-search text-muted'></i></span>
                                        <input 
                                            name = "text"
                                            value = {query.text}
                                            onChange = {searchContacts}
                                            type="text" className='form-control shadow-none' placeholder='Search names'/>
                                    </div>
                                </div>
                                <div className="col-3 d-grid">
                                    <button className='btn btn-outline-primary'>Search</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {
                loading ? <Spinner/> : <React.Fragment>
                    <section className='contact-list py-4'>
                        <div className="container">
                            <div className="row g-3">
                                {
                                    filteredContacts.length > 0 ? filteredContacts.map(contact => {
                                        return (
                                            <div className="col-md-6" key={contact.id}>
                                                <div className="card contact-card shadow-sm">
                                                    <div className="card-body">
                                                        <div className="row align-items-center">
                                                            <div className="col-auto">
                                                                <img src={contact.photo} alt={contact.name} className='contact-img' />
                                                            </div>
                                                            <div className="col">
                                                                <h5 className='mb-1'>{contact.name}</h5>
                                                                <p className='mb-1 text-muted small'>{contact.company} — {contact.title}</p>
                                                                <p className='mb-1'><i className='fa fa-phone me-2 text-secondary'></i>{contact.mobile}</p>
                                                                <p className='mb-0'><i className='fa fa-envelope me-2 text-secondary'></i>{contact.email}</p>
                                                            </div>
                                                            <div className="col-auto text-end">
                                                                <Link to={`/contacts/view/${contact.id}`} className='btn btn-sm btn-outline-warning mb-2 me-0'>
                                                                    <i className='fa fa-eye'/>
                                                                </Link>
                                                                <Link to={`/contacts/edit/${contact.id}`} className='btn btn-sm btn-outline-primary mb-2 ms-1'>
                                                                    <i className='fa fa-pen'/>
                                                                </Link>
                                                                <button className='btn btn-sm btn-outline-danger ms-1' onClick={() => clickDelete(contact.id)}>
                                                                    <i className='fa fa-trash'/>
                                                                </button>
                                                            </div>     
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="col-12">
                                            <div className="alert alert-info mb-0">No contacts found. Try adding a new contact.</div>
                                        </div>
                                    )
                                }
                                
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            }

            
        </React.Fragment>
    )
};

export default ContactList;