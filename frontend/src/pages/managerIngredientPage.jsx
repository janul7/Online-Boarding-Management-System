import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, Container, Row, Col, Table, Button, Tabs, Tab,Modal } from 'react-bootstrap';
import { Breadcrumbs, Typography, Fade, Card, CardContent, Link, Pagination, CircularProgress, Box, FormControl,  InputLabel, MenuItem, Select,Autocomplete,TextField  } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { NavigateNext,} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useGetManagerBoardingMutation} from '../slices/ingredientsApiSlice';
import { toast } from 'react-toastify';
 
 
//import SwipeableViews from 'react-swipeable-views';
import LoadingButton from '@mui/lab/LoadingButton';

import Sidebar from '../components/sideBar';
import ownerStyles from '../styles/ownerStyles.module.css';
import dashboardStyles from '../styles/dashboardStyles.module.css';
import ingredientStyles from '../styles/ingredientStyles.module.css'; 
import ownerAllTicketsStyles from '../styles/ownerAllTicketsStyles.module.css';
import orderStyles from '../styles/orderStyles.module.css'; 

import AllIngredients from "../components/allIngredientsComponent";
import ReduceinventoryPage from "../components/reduceinventoryComponent";
import CentralinventoryPage from "../components/centralinventoryComponent";
import IngredientReport from "../components/ingredientReportComponent";

import defaultImage from '/images/defaultImage.png'

//const AutoPlaySwipeableViews = SwipeableViews;

const managerIngredientPage = () => {

    const { userInfo } = useSelector((state) => state.auth); 
    const [boardingId, setBoardingId] = useState('');
    const [boardingNames, setBoardingNames] = useState([]);
    const [activeTab, setActiveTab] = useState("Ingredients");
     
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [getManagerBoarding, { isLoading }] = useGetManagerBoardingMutation();
     
    // Function to fetch boarding names from the API
    const loadData = async () => {
        try {
             
            const managerId = userInfo._id;

            const res = await getManagerBoarding(managerId).unwrap();  
            setBoardingNames(res.boardings);  
            
            if (res.boardings.length > 0 && res.boardings[0].inventoryManager) {
                // Set the default selected boarding ID to the first one in the list
                setBoardingId(res.boardings[0]._id);
            }

        } catch (error) {
            console.error('Error fetching boarding names:', error);
             
        }
    };

     
    useEffect(() => {
        loadData();  
    }, []);

    const handleBoardingSelect = (event) => {
        setBoardingId(event.target.value);    
    };

    
    return (
        <>
            <Sidebar />
            <div className={dashboardStyles.mainDiv}>
                <Container className={dashboardStyles.container}>
                    <Row>
                        <Col>
                            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className="py-2 ps-3 mt-4 bg-primary-subtle">
                                <Link underline="hover" key="1" color="inherit" href="/">Home</Link>,
                                <Link underline="hover" key="2" color="inherit" href="/profile">{userInfo.userType == 'owner' ? 'Owner' : (userInfo.userType == 'occupant' ? 'Occupant' : userInfo.userType == 'admin' ? 'Admin' : userInfo.userType == 'kitchen' ? 'Kitchen' : <></>)}</Link>,
                                <Typography key="3" color="text.primary">Ingredients</Typography>
                            </Breadcrumbs>
                        </Col>
                    </Row>
                    
                     
                        <Row className='mt-3'>
                            <Col className="mb-3" xs={12} md={12}>
                                
                                    <Row>
                                        <Col>
                                            <Card variant="outlined" style={{padding: '0px',borderRadius:'6px'}}className={orderStyles.card}>
                                                <CardContent style={{ padding: '3px', important: 'true'}}>
                                                    <h1 style={{ fontSize: '40px', color: 'white', textAlign: 'center'}}>
                                                        Inventory
                                                    </h1>
                                                </CardContent>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                        </Col>
                                        <Col>
                                        </Col>
                                        <Col className="ml-5">
                                            <Box sx={{ minWidth: 120}}>
                                                <FormControl fullWidth size='small'>
                                                    <InputLabel id="demo-simple-select-label">Boarding Name</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={boardingId}
                                                        label="Boarding Name" 
                                                        //onChange={handleBoardingSelect}
                                                        inputProps={{
                                                            readOnly: true, 
                                                        }}
                                                    >
                                                        {boardingNames.map((boarding) => (
                                                            <MenuItem key={boarding._id} value={boarding._id}>
                                                                {boarding.boardingName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Col> 
                                   </Row>
                                
                                <Row>
                                   <Col> 
                                        <Tabs defaultActiveKey="Ingredients"  id="uncontrolled-tab-example" className="mb-3" onSelect={(k) => setActiveTab(k)}>

                                            <Tab eventKey="Ingredients" title="Ingredients">
                                                {activeTab=="Ingredients" && boardingId ? (
                                                    <AllIngredients boardingId={boardingId} />
                                                ) : (
                                                    <div
                                                    style={{
                                                        height: '68vh',
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'dimgrey',
                                                    }}
                                                    >
                                                    {boardingId ? (
                                                        <h2>You don't have any Ingredients!</h2>
                                                    ) : (
                                                        <>
                                                        {userInfo.userType === 'owner' ? (
                                                            <h2>Please Select a boarding!</h2>
                                                        ) : (
                                                            <h2>You do not assign to any boarding!</h2>
                                                        )}
                                                        </>
                                                    )}
                                                    </div>
                                                )}
                                            </Tab>
                                            <Tab eventKey="Central Inventory" title="Central Inventory">
                                                {activeTab=="Central Inventory" && boardingId ? (
                                                    <CentralinventoryPage boardingId={boardingId} />
                                                ) : (
                                                    <div
                                                    style={{
                                                        height: '68vh',
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'dimgrey',
                                                    }}
                                                    >
                                                    {boardingId ? (
                                                        <h2>You don't have any Ingredients!</h2>
                                                    ) : (
                                                        <>
                                                        {userInfo.userType === 'owner' ? (
                                                            <h2>Please Select a boarding!</h2>
                                                        ) : (
                                                            <h2>You do not assign to any boarding!</h2>
                                                        )}
                                                        </>
                                                    )}
                                                    </div>
                                                )}
                                            </Tab>
                                            <Tab eventKey="Reduce Inventory" title="Reduce Inventory">
                                                {activeTab=="Reduce Inventory" && boardingId ? (
                                                    <ReduceinventoryPage boardingId={boardingId} />
                                                ) : (
                                                    <div
                                                    style={{
                                                        height: '68vh',
                                                        width: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'dimgrey',
                                                    }}
                                                    >
                                                    {boardingId ? (
                                                        <h2>You don't have any Ingredients!</h2>
                                                    ) : (
                                                        <>
                                                        {userInfo.userType === 'owner' ? (
                                                            <h2>Please Select a boarding!</h2>
                                                        ) : (
                                                            <h2>You do not assign to any boarding!</h2>
                                                        )}
                                                        </>
                                                    )}
                                                    </div>
                                                )}
                                            </Tab> 
                                        </Tabs>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                     
                </Container>
            </div>
     
        </> 
    )
};

export default managerIngredientPage;