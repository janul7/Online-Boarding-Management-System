import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetOrderMutation } from "../slices/orderApiSlice";
import { toast } from "react-toastify";
import Sidebar from '../components/sideBar';
import dashboardStyles from '../styles/dashboardStyles.module.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { Breadcrumbs, Typography, Fade, Card, CardContent, Link, Button, TextField, CircularProgress } from '@mui/material';
import { NavigateNext, Search, GridViewRounded } from '@mui/icons-material';
import { DateRange } from 'react-date-range';
import occupantFeedbackStyles from '../styles/occupantFeedbackStyles.module.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { sort } from 'lodash';
import { BrowserUpdated as BrowserUpdatedIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "@emotion/react";
import OrderForm from "../components/orderForm";
import OrderHistory from "../components/orderHistory";
import MyOrders from "../components/myOrders";


const OrderList = () => {

    const theme = useTheme();

    const [product, setOrder] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('Place Order');
    const [searchQuery, setSearchQuery] = useState('');



    const openDeleteModal = (order) => {
        setSelectedOrder(order);
        setShowDeleteModal(true);
    };
    const closeDeleteModal = () => {
        setSelectedOrder(null);
        setShowDeleteModal(false);
    };
    const handleDeleteSuccess = () => {
        // Reload the order data or update the UI as needed
        loadOrderData();
        closeDeleteModal();
    };
    const { userInfo } = useSelector((state) => state.auth);

    const getStatusValue = (status) => {
        switch (status) {
            case 'Pending':
                return 1;
            case 'Ready':
                return 2;
            case 'Completed':
                return 3;
            default:
                return 4;
        }
    };

    // Sort the filteredOrders array by status



    const navigate = useNavigate();

    const [getOrder, { isLoading }] = useGetOrderMutation();
    const userID = userInfo._id
    const loadOrderData = async () => {
        try {
            const res = await getOrder({ occupantId: userID }).unwrap();

            setOrder(res.order);
        } catch (error) {

            toast.error('Failed to fetch orders. Please try again later.');
        }
    };



    useEffect(() => {
        // Dispatch the action to fetch feedback data
        loadOrderData();
    }, []); // Empty dependency array to trigger the effect on component mount

    

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

                                <Typography key="3" color="text.primary">My Orders</Typography>
                            </Breadcrumbs>
                        </Col>
                    </Row>
                    <p></p>
                    <Tabs defaultActiveKey="Place Order" onSelect={(k) => setActiveTab(k)}>
                        <Tab eventKey="Place Order" title="Place Order">
                            {activeTab == "Place Order" ?
                                <OrderForm />
                            : ''}
                        </Tab>
                        <Tab eventKey="My Orders" title="My Orders">
                            {activeTab == "My Orders" ?
                                <MyOrders />
                            : ''}
                        </Tab>
                        <Tab eventKey="Order History" title="Order History">
                            {activeTab == "Order History" ?
                                <OrderHistory />
                            : ''}
                        </Tab>
                    </Tabs>




                </Container>
            </div>
        </>

    )
}
export default OrderList;