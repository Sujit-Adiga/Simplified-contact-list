import React, {useEffect, useState} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { ContactService } from '../../../services/ContactService';
import Spinner from '../../Spinner/Spinner';
import '../../../App.css';

let AddContact = () => {

    let navigate = useNavigate();

    let [state, setState] = useState({
        loading : false,
        contact : {
            name : '',
            photo : '',
            mobile : '',
            email : '',
            company : '',
            title : '',
            group : ''
        },
        groups : [],
        errorMessage : ''
    });

    // controlled input updates
    let updateInput = (event) => {
        setState({
            ...state,
            contact : {
                ...state.contact,
                [event.target.name] : event.target.value
            }
        });
    };

    // load groups for the select dropdown
    useEffect(() => {
            let isMounted = true;
    
            const fetchContacts = async () => {
                setState(s => ({ ...s, loading: true }));
                try {
                    const response = await ContactService.getGroups();
                    if (!isMounted) return;
                    setState(s => ({ ...s, loading: false, groups: response.data }));
                } catch (error) {
                    if (!isMounted) return;
                    setState(s => ({ ...s, loading: false, errorMessage: error.message }));
                }
            };
    
            fetchContacts();
    
            return () => { isMounted = false; };
    }, []);

    // create new contact and navigate back on success
    let submitForm = async (event) => {
        event.preventDefault();

        // set loading state
        setState(s => ({ ...s, loading: true }));

        try {
            let response = await ContactService.createContact(state.contact);
            if (response && response.status >= 200 && response.status < 300) {
                setState(s => ({ ...s, loading: false }));
                navigate('/contacts/list', { replace: true });
            } else {
                setState(s => ({ ...s, loading: false, errorMessage: `Unexpected response: ${response?.status}` }));
            }
        } catch (error) {
            setState(s => ({
                ...s,
                loading: false,
                errorMessage: error.message || 'Failed to create contact'
            }));
        }
    };

    let {loading, contact, groups, errorMessage} = state;

    return (
        <React.Fragment>
            {
                loading ? <Spinner/> : <React.Fragment>
                    <section className='add-contact p-4'>
                        <div className="container">
                            <div className="row mb-3">
                                <div className="col">
                                    <h3 className="h5 text-success fw-bold">Create Contact</h3>
                                    <p className='text-muted small mb-0'>Fill in details to add a new contact.</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="card shadow-sm">
                                        <div className="card-body">
                                            <form onSubmit={submitForm}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='name'
                                                                value = {contact.name}
                                                                onChange={updateInput}
                                                                type='text' className='form-control' placeholder='Name'/>
                                                        </div>
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='mobile'
                                                                value = {contact.mobile}
                                                                onChange={updateInput}
                                                                type='tel' className='form-control' placeholder='Mobile'/>
                                                        </div>
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='email'
                                                                value = {contact.email}
                                                                onChange={updateInput}
                                                                type='email' className='form-control' placeholder='Email'/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='photo'
                                                                value = {contact.photo}
                                                                onChange={updateInput}
                                                                type='text' className='form-control' placeholder='Photo URL'/>
                                                        </div>
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='company'
                                                                value = {contact.company}
                                                                onChange={updateInput}
                                                                type='text' className='form-control' placeholder='Company'/>
                                                        </div>
                                                        <div className="mb-2">
                                                            <input 
                                                                required={true}
                                                                name='title'
                                                                value = {contact.title}
                                                                onChange={updateInput}
                                                                type='text' className='form-control' placeholder='Title'/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <select 
                                                        required={true}
                                                        name='group'
                                                        value = {contact.group}
                                                        onChange={updateInput}
                                                        className='form-control'>
                                                        <option value="">Select a Group</option>
                                                        {
                                                            groups.length > 0 &&
                                                                groups.map(group => {
                                                                    return (
                                                                        <option key={group.id} value={group.id}>{group.name}</option>
                                                                    )
                                                                })
                                                        }
                                                    </select>
                                                </div>

                                                <div className="mb-2">
                                                    <button type='submit' className='btn btn-success btn-gradient'>Create</button>
                                                    <Link to={'/contacts/list'} className='btn btn-outline-dark ms-2'>Cancel</Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 offset-md-1 text-center">
                                    <img src={contact.photo || '/placeholder.png'} alt={contact.name || 'photo'} className='contact-img-lg'/>
                                </div>
                            </div>
                        </div>
                    </section>
                </React.Fragment>
            }
            
        </React.Fragment>
    )
};

export default AddContact;
