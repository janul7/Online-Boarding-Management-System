import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Link as ReactLink} from "react-router-dom";
import { Container, Form, Button, Row, Col, FloatingLabel} from 'react-bootstrap';
import { Breadcrumbs, Typography, Fade, Card, CardContent, Link, InputLabel, Select, MenuItem, FormControl, TextField, Backdrop, CircularProgress} from '@mui/material';
import { Close, NavigateNext } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import { useCreateTicketMutation, useGetTicketByUniqueIdMutation, useUpdateTicketMutation } from '../slices/ticketsApiSlices';
import { useParams } from 'react-router';

import storage from '../utils/firebaseConfig';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

import CreateTicketStyles from '../styles/createTicketStyles.module.css';
import dashboardStyles from '../styles/dashboardStyles.module.css';
import { ticketsApiSlice } from '../slices/ticketsApiSlices';
import Sidebar from '../components/sideBar';



const UpdateMainTicketPage = () =>{

    const  { userInfo } = useSelector((state) => state.auth);

    const {ticketId} = useParams();
    const [viewUserInfo, setViewUserInfo] = useState();
    const[ticket, setTicket] = useState("");
    const [occupantId, setOccupantId] = useState(userInfo._id);
    const [occupantName, setOccupantName] = useState(userInfo.firstName +" "+ userInfo.lastName);
    const [occupantEmail, setOccupantEmail] = useState(userInfo.email);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState('');
    const [attachmentLink, setAttachmentLink] = useState('');
    const [backDropOpen, setBackDropOpen] = useState(false);

    const[createTicket, { isLoading2 }] =  useCreateTicketMutation();
    const[getTicketByUniqueId, { isLoading }] = useGetTicketByUniqueIdMutation();
    const[updateTicket] = useUpdateTicketMutation();
    
    const loadData = async () => {
        try{
            console.log(ticketId);
            const res = await getTicketByUniqueId( ticketId).unwrap();

            if (res.ticket.attachment) {
                try {
                    const Url = await getDownloadURL(ref(storage, res.ticket.attachment));
                    setAttachmentLink(Url); // Create a new object with the updated attachment
                } catch (error) {
                    console.log(error);
                }
            }

            setTicket(res.ticket);
            setSubject(res.ticket.subject);
            setCategory(res.ticket.category);
            setSubCategory(res.ticket.subCategory);
            setDescription(res.ticket.description);
            setAttachment(res.ticket.attachment);

            
            
        } catch(err){
            toast.error(err.data?.message || err.error);
        }
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        setViewUserInfo(true);
        loadData();
    },[]);

    const changeCategory = (e) => {
        setCategory(e.target.value);

        setSubCategory('');
    }


    const submitHandler = async (e) => {
        e.preventDefault();
        if(new Date(ticket.updatedAt) > new Date(new Date() - 15 * 60 * 1000)){
            try {
                    setBackDropOpen(true);
                    var uniqueName;
                    if(attachment != ''){
                        const timestamp = new Date().getTime();
                        const random = Math.floor(Math.random() * 1000) + 1;
                        uniqueName = `${timestamp}_${random}.${attachment.name.split('.').pop()}`;
                    
                        const storageRef = ref(storage, `${uniqueName}`);
                        const uploadTask = uploadBytesResumable(storageRef, attachment);
        
                        await uploadTask;
                    }
                    const res = await updateTicket({ ticketId:ticket._id, replyTktId:ticket._id, subject, category, subCategory ,description, attachment:uniqueName }).unwrap();

                    toast.success("ticket updated successfully");
                    navigate(`/occupant/ticket/${ticket._id}`);  //should navigate to mytickets    
                    setBackDropOpen(false);            
            } catch (err) {
                setBackDropOpen(false);
                toast.error(err?.data?.message || err.error);
            }
        }else{
            toast.error('Cannot Update ticket after 15 minutes!');
            navigate(`/occupant/ticket/${ticket._id}`);  //should navigate to mytickets    
        }
        
    };





    return(
        <>
            <Sidebar />
            
            <div className={dashboardStyles.mainDiv}>
                <Container className={dashboardStyles.container}>
                    <Row>
                        <Col>
                            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className="py-2 ps-3 mt-4 bg-primary-subtle">
                                <Link underline="hover" key="1" color="inherit" href="/">Home</Link>,
                                <Link underline="hover" key="2" color="inherit" href="/profile">{userInfo.userType == 'owner' ? 'Owner' : (userInfo.userType == 'occupant' ? 'Occupant' : userInfo.userType == 'admin' ? 'Admin' : userInfo.userType == 'kitchen' ? 'Kitchen' : <></>)}</Link>,
                                <Link underline="hover" key="3" color="inherit" href="/occupant/ticket">Tickets</Link>,
                                <Typography key="4" color="text.primary">Update Ticket</Typography>
                            </Breadcrumbs>
                        </Col>
                    </Row>
                    
                    <Fade in={viewUserInfo} >
                        <Form onSubmit={submitHandler}>
                            <Row>
                                <Col>
                                    <Card variant="outlined" className={CreateTicketStyles.card}>
                                        <CardContent style={{padding:'18px'}}>
                                            <h4 style={{margin:0}}>Update Ticket</h4>
                                        </CardContent>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card variant="outlined" className={CreateTicketStyles.card} style={{marginBottom:'22px'}}>
                                        <CardContent>
                                            <Row id={CreateTicketStyles.newTicket}>
                                            <p><b>Update Ticket</b></p> 
                                            </Row>
                                        
                                            <Row>
                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="name" className={CreateTicketStyles.lbl}>Name</label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'><TextField id="outlined-read-only-input" size='small' value={occupantName}  InputProps={{ readOnly: true,}}/></Col>    
                                                </Row>

                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="name" className={CreateTicketStyles.lbl}>Email</label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'><TextField id="outlined-read-only-input" size='small' value={occupantEmail}  InputProps={{ readOnly: true,}} /></Col>    
                                                </Row>

                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="subject" className={CreateTicketStyles.lbl}>Subject<span className={CreateTicketStyles.require}><b>*</b></span></label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'><input type="text" placeholder="Enter Subject" value={subject} id={CreateTicketStyles.subject} onChange={ (e) => setSubject(e.target.value.toUpperCase())} required/></Col>
                                                </Row>
                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="category" className={CreateTicketStyles.lbl}>Category<span className={CreateTicketStyles.require}><b>*</b></span></label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'>
                                                        <FormControl sx={{ m:0, minWidth: 120 }} size="small"> 
                                                            <Select value={category} onChange={changeCategory} required  >
                                                                <MenuItem value="boarding">Boarding Issue</MenuItem>
                                                                <MenuItem value="food">Food Issue</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        <br/>
                                                        {category=='boarding' ? 
                                                        <FormControl sx={{ mt:1, ml:3, minWidth: 120 }} size="small" id="boardingSub">
                                                            <Select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required  >
                                                                <MenuItem value="utilities">Utilities</MenuItem>
                                                                <MenuItem value="payments">Payment Issues</MenuItem>
                                                                <MenuItem value="facilities">Facilities</MenuItem>
                                                                <MenuItem value="other">Other</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        : category=='food' ?
                                                        <FormControl sx={{ mt:1, ml:3, minWidth: 120 }} size="small" id="foodSub">
                                                            <Select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required  >
                                                                <MenuItem value="payments">Payment Issues</MenuItem>
                                                                <MenuItem value="quality">Quality Control</MenuItem>
                                                                <MenuItem value="other">Other</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                        :''}
                                                    </Col>
                                                </Row>
                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="description" className={CreateTicketStyles.lbl}>Description<span className={CreateTicketStyles.require}><b>*</b></span></label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'>
                                                        <Form.Control as="textarea" placeholder="Add Description" style={{ height: '100px' }} value={description}  onChange={ (e) => setDescription(e.target.value)} required/>
                                                    </Col>
                                                </Row>
                                                <Row style={{alignItems:'flex-start', marginTop:'10px'}}>
                                                    <Col lg={3} xs={6}><label htmlFor="image" className={CreateTicketStyles.lbl}>Add Attachment</label></Col>
                                                    <Col lg={9} xs={6} className='mt-3'>
                                                        {attachment ? 
                                                                <>
                                                                    <ReactLink to={attachmentLink} target="_blank" download>Attachment</ReactLink>
                                                                    <Close onClick={() => {setAttachmentLink('');setAttachment('');}} style={{cursor:'pointer'}} /> 
                                                                </>
                                                            : 
                                                            <Form.Group controlId="formFileMultiple" className="mb-3" style={{maxWidth:'40%'}}>
                                                                <Form.Control type="file" onChange={(e) => {setAttachment(e.target.files[0]);setAttachmentLink(e.target.files[0])}} />
                                                            </Form.Group>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Row>
                                                <LoadingButton type="submit" loading={isLoading} className='mt-4 mb-4 me-4'  style={{float:'right'}} variant="contained">
                                                    Save&Submit
                                                </LoadingButton>
                                                <Backdrop
                                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                    open={backDropOpen}
                                                >
                                                    <CircularProgress color="inherit" />
                                                </Backdrop>
                                        </CardContent>
                                    </Card>
                                </Col>
                            </Row>


                            

                        </Form>
                    </Fade>
                </Container>
            </div>
        </>
    );
    
    
}



export default UpdateMainTicketPage;