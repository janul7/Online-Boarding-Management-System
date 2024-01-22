import { useState, useEffect } from "react";
import { Row, Col, Image, Button,Form } from 'react-bootstrap';
import { Card, CardContent, Pagination, CircularProgress,IconButton } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import {useGetUtilitiesForOccupantMutation,useGetOccupantNameMutation } from "../slices/utilitiesApiSlice";
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import storage from "../utils/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import defaultImage from '/images/defaultImage.png';
import { Link as CustomLink } from "react-router-dom";
import ownerStyles from '../styles/billStyles.module.css';
import BillStyles from '../styles/billStyles.module.css';
import { AlignHorizontalCenter } from "@mui/icons-material";



const AllUtilitiesForOccupants = ({  utilityType }) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [utilities, setUtilities] = useState([]);
    const [OccupantName, setOccupant] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const dispatch = useDispatch();

    const [getUtilitiesForOccupants, { isLoading }] = useGetUtilitiesForOccupantMutation();

    const { userInfo } = useSelector((state) => state.auth);
    const [getOccupantName,{isLoadings3}] = useGetOccupantNameMutation();

    
    /*const fetchOccupantNameById = async (occupantID) => {
        try {
            if (!occupantID) {
                return 'N/A'; // Handle null or undefined occupantID
            }
            const response = await getOccupantName(occupantID).unwrap();
            setOccupant(response.occupantName);
        } catch (error) {
            console.error('Error fetching occupant:', error);
            return 'N/A'; // Handle errors gracefully
        }
    }*/
    

    const loadData = async (pageNo) => {
        try {
            if ( utilityType ) {
                const res = await getUtilitiesForOccupants({occupantID: userInfo._id,utilityType,pageNo,searchQuery }).unwrap();
                console.log(res);
                
                setUtilities(res.utility);
                setTotalPages(res.totalPages);
                
                   
                // Load utility images
                const updatedUtilities = await Promise.all(res.utility.map(async (utility) => {
                    const updatedImages = await Promise.all(utility.utilityImage.map(async (image, index) => {
                        try {
                            const imageUrl = await getDownloadURL(ref(storage, image));
                            return imageUrl;
                        } catch (error) {
                            console.error('Error retrieving image URL:', error);
                            return null;
                        }
                    }));
                    //const occupants=[utility.occupant];
                    //const occupantName = await fetchOccupantNameById(occupants);
                    //console.log('Occupant Name:', occupantName); // Add this line for debugging
        
                    return { ...utility, utilityImage: updatedImages };


                }));

                setUtilities(updatedUtilities);
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.data?.message || err.error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(page);
    }, [userInfo,utilityType,searchQuery]);

    const handlePageChange = (event, value) => {
        setPage(value);
        loadData(value);
        console.log(utilities);
    };

    const handleSort = (order) => {
        const sortedUtilities = [...utilities];
        if (order === "asc") {
            sortedUtilities.sort((a, b) => new Date(a.month) - new Date(b.month));
        } else if (order === "desc") {
            sortedUtilities.sort((a, b) => new Date(b.month) - new Date(a.month));
        }
        setUtilities(sortedUtilities);
    };
    
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };
    return (
        <>
            <Row className="d-flex justify-content-center"style={{ minHeight: 'calc(100vh - 240px)' }}>
               
                    <Row>
                        <Col>
                                            <div style={{ marginBottom: '10px', textAlign: 'left', color:'darkslategray' }}>
                                <label className={BillStyles.sortinglable}>Sort by Month:</label>
                                <select onChange={(e) => handleSort(e.target.value)} style={{ marginLeft: '10px', padding: '5px',color:'darkslategray'  }}>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            </Col>
                            <Col className="d-flex justify-content-end">
                            <Form.Group controlId="searchQuery" style={{ maxWidth: '300px',alignSelf:'right' }}>
                             <div style={{ display: 'flex', alignItems: 'right' }}>
                            <Form.Control
                                type="text"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={handleSearch} // Handle search query change
                            />
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                            </div>
                            </Form.Group>
                            </Col>
                            
                            </Row>
                    
                          <Row className="justify-content-center">
                        {isLoading || loading ? (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress />
                            </div>
                        ) : (utilities && utilities.length !== 0 ? (
                            utilities.map((utility, index) => (
                                <Card className={`${ownerStyles.cardc} mt-4`} key={utility._id} style={{ height: 'auto' } } >
                                    <CardContent className={ownerStyles.cardContent}>
                                        <Col lg={12}>
                                        <Row>
                                            <Col lg={3}>
                                                <Image
                                                    src={utility.utilityImage[0] || defaultImage}
                                                    onError={(e) => { e.target.src = defaultImage }}
                                                    alt="Utility"
                                                    fluid
                                                />
                                            </Col>
                                            
                                            <Col>
                                            <Row>
                                            <Col lg={5}>
                                        
                                                <Row>
                                                    <p><b>Amount:</b> Rs. {utility.amount} .00</p>
                                                </Row>
                                                <Row>
                                                
                                                    <p><b>Month:</b> {utility.month}</p>
                                                
                                                </Row>
                                                <Row>
                                                    
                                                <p><b>Description:</b> {utility.description}</p>
                                                
                                                </Row>
                                                </Col>
                                                <Col lg={5}>

                                                
                                                
                                                
                                                <Row>
                                                                <p>
                                                                    <b>No of occupants:</b> {utility.occupant.length}{" "}
                                                                    {utility.occupant.length !== 1 ? "occupants" : "occupant"}
                                                                </p>
                                                            </Row>

                                                                                                                                    <Row>
                                                                            {utility.perCost !== null && typeof utility.perCost !== 'undefined' &&(
                                                                                <p><b>Per Occupant Cost:</b> Rs. {utility.perCost.toFixed(2)}</p>
                                                                            )}
                                                                        </Row>
                                                                        </Col>
                                                                        
                                                                        </Row>

                                                            

                                                    
                                                        
                                                    
                                                    </Col>
                                                </Row>
                                               </Col>
                                            
                                        
                                    </CardContent>
                                </Card>
                            ))
                        ) : <div style={{height:'100%', width:'100%',display:'flex',justifyContent:'center',alignItems:'center', color:'dimgrey'}}>
                        <h2>You don't have any Bills!</h2>
                    </div>)}
                    
                </Row>                    
                
                {totalPages > 1 && (
                    <Row>
                        <Col className="mt-3">
                            <Pagination count={totalPages} page={page} onChange={handlePageChange} shape="rounded" />
                        </Col>
                    </Row>
                )}
                
                </Row>
        
        
            
        </>
    );
};

export default AllUtilitiesForOccupants;