import React, { useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ContactService } from '../../../services/ContactService';
import '../../../App.css';

let EditContact = () => {

    let navigate = useNavigate();
    
    let {contactId} = useParams();

    let [state, setState] = React.useState({
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

    // fetch contact and available groups
    useEffect(() => {
        let isMounted = true;

        const fetchContact = async () => {
            setState(s => ({ ...s, loading: true }));
            try {
                const response = await ContactService.getContact(contactId);
                const groupResponse = await ContactService.getGroups();
                if (!isMounted) return;
                setState(s => ({ 
                    ...s, 
                    loading: false, 
                    contact: response.data,
                    groups: groupResponse.data })); // set contact
            } catch (error) {
                if (!isMounted) return;
                setState(s => ({ ...s, loading: false, errorMessage: error.message }));
            }
        };

        fetchContact();

        return () => { isMounted = false; };
    }, [contactId]);

    // controlled form updates
    let updateInput = (event) => {
        setState({
            ...state,
            contact : {
                ...state.contact,
                [event.target.name] : event.target.value
            }
        });
    }

    // submit updated contact
    let submitForm = async (event) => {
            event.preventDefault();
    
            // set loading state
            setState(s => ({ ...s, loading: true }));
    
            try {
                let response = await ContactService.updateContact(state.contact, contactId);
                if (response && response.status >= 200 && response.status < 300) {
                    // reset loading and navigate
                    setState(s => ({ ...s, loading: false }));
                    navigate('/contacts/list', { replace: true });
                } else {
                    // unexpected non-2xx response
                    setState(s => ({ ...s, loading: false, errorMessage: `Unexpected response: ${response?.status}` }));
                }
            } catch (error) {
                setState(s => ({
                    ...s,
                    loading: false,
                    errorMessage: error.message || 'Failed to update contact'
                }));
            }
        };

    let {loading, contact, groups, errorMessage} = state;

    return (
        <React.Fragment>
            <section className='edit-contact p-4'>
                <div className="container">
                    <div className="row mb-3">
                        <div className="col">
                            <h3 className="h5 text-primary fw-bold">Edit Contact</h3>
                            <p className='text-muted small mb-0'>Update contact information and select the group.</p>
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
                                            <button type='submit' className='btn btn-gradient'>Update</button>
                                            <Link to={'/contacts/list'} className='btn btn-outline-dark ms-2'>Cancel</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 offset-md-1 text-center">
                            <img src={contact.photo} alt={contact.name} className='contact-img-lg' />
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
};

export default EditContact;