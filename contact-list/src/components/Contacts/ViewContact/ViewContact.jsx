import React, { useEffect, useState } from 'react';
import { Link , useParams} from 'react-router-dom';
import { ContactService } from '../../../services/ContactService';
import Spinner from '../../Spinner/Spinner';
import '../../../App.css'; // shared UI tweaks

let ViewContact = () => {

    // id comes from route param
    let {contactId} = useParams(); 

    let [state, setState] = useState({
        loading : false,
        contact : {},
        errorMessage : '',
        group : {}
    });

    // destructure immediately so variables are initialized before any effect/run-time use
    let {loading, contact, errorMessage, group} = state;

    // load contact and group on mount / when id changes
    useEffect(() => {
        let isMounted = true;

        const fetchContacts = async () => {
            setState(s => ({ ...s, loading: true }));
            try {
                const response = await ContactService.getContact(contactId);

                // normalize contact object (handles API wrapping)
                const contactObj = response?.data?.contact ?? response?.data ?? response;

                // fetch the group only when we have a valid id
                let groupObj = {};
                try {
                    const groupId = contactObj?.group || contactObj?.groupId || contactObj?.group?.id;
                    if (groupId) {
                        const groupResp = await ContactService.getGroup(groupId);
                        groupObj = groupResp?.data ?? {};
                    }
                } catch (gErr) {
                    // don't block rendering contact if group fails
                    console.warn('getGroup failed:', gErr);
                }

                if (!isMounted) return;
                setState(s => ({
                    ...s,
                    loading: false,
                    contact: contactObj,
                    group: groupObj
                }));
            } catch (error) {
                if (!isMounted) return;
                setState(s => ({
                    ...s,
                    loading: false,
                    errorMessage: error.message || 'Failed to load contact'
                }));
            }
        };

        fetchContacts();
        return () => { isMounted = false; };
    }, [contactId]);

    return (
        <React.Fragment>
            <section className='view-contact-intro p-4 bg-soft'>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2 className="h4 text-warning fw-bold">View Contact</h2>
                            <p className='text-muted small mb-0'>Details for the selected contact.</p>
                        </div>
                    </div>
                </div>
            </section>
            {
                loading ? <Spinner/> : <React.Fragment>
                    {
                        Object.keys(contact).length > 0 &&
                        <section className='view-contact mt-4'>
                            <div className="container">
                                <div className="card profile-card shadow-sm">
                                    <div className="card-body">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-3 text-center">
                                                <img src={contact.photo} alt={contact.name} className='contact-img-lg mb-2' />
                                                <h5 className='mb-0'>{contact.name}</h5>
                                                <small className='text-muted'>{contact.title}</small>
                                            </div>
                                            <div className="col-md-6">
                                                <ul className='list-unstyled mb-0'>
                                                    <li className='py-1'><i className='fa fa-phone me-2 text-secondary'></i>{contact.mobile}</li>
                                                    <li className='py-1'><i className='fa fa-envelope me-2 text-secondary'></i>{contact.email}</li>
                                                    <li className='py-1'><i className='fa fa-building me-2 text-secondary'></i>{contact.company}</li>
                                                    <li className='py-1'>Group: <span className='badge bg-primary ms-2'>{group?.name ?? '—'}</span></li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3 text-end">
                                                <Link to={'/contacts/list'} className='btn btn-outline-warning'>Back</Link>
                                                <Link to={`/contacts/edit/${contact.id}`} className='btn btn-primary ms-2'>Edit</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }
                </React.Fragment>
            }
        </React.Fragment>
    )
};

export default ViewContact;
