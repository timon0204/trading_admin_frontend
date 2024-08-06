import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Select,
    MenuItem,
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SymbolManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);
    const [assetNames, setAssetName] = useState([]);

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [newSymbol, setNewSymbol] = useState({});
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);
    }, [token]);

    const fetchSymbols = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getCommissions`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setSymbol(res.data.commissions);
            })
            .catch((err) => {
                console.log('Error fetching symbols', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const validate = () => {
        // const tempErrors = {};
        // if (!newSymbol.email || !newSymbol.email.includes('@')) {
        //     tempErrors.email = 'Email is required and must include "@"';
        // }

        // Check if password is strong
        // if (!newSymbol.password || newSymbol.password.length < 8) {
        //     tempErrors.password = 'Password must be at least 8 characters long';
        // }

        // Check if passwords match
        // if (newSymbol.password !== newSymbol.confirmPassword) {
        //     tempErrors.confirmPassword = 'Passwords do not match';
        // }

        // setErrors(tempErrors);
        // return Object.keys(tempErrors).length === 0;
        return true;
    };

    const handleCreateSymbol = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createCommissions`, newSymbol, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchSymbols();
                })
                .catch((error) => {});
            setOpenCreateModal(false);
        }
    };

    const handleEditSymbol = (symbol) => {
        symbol = { ...symbol, commissionId: symbol.id };
        setOpenEditModal(true);
        setSelectedSymbol(symbol);
    };

    const handleUpdateSymbol = async () => {
        // Logic for updating symbol information
        await axios
            .post(
                `${config.BackendEndpoint}/updateCommission`,
                {
                    ...selectedSymbol,
                },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
            })
            .catch((error) => {});
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setSelectedSymbol(null); // Clear selected symbol
    };

    const handleDeleteSymbol = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteSymbol`,
                { symbolId: selectedSymbol.id },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
                setOpenDeleteModal(false);
            })
            .catch((error) => {});
        setOpenCreateModal(false);
    };

    const handleConfirmDelete = (symbol) => {
        // Logic for deleting symbol
        setSelectedSymbol(symbol);
        setOpenDeleteModal(true);
    };

    return (
        <Container
            style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}
        >
            <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
            >
                <Typography
                    variant="h4"
                    style={{
                        marginLeft: '20vw',
                        color: 'white',
                        fontFamily: 'nycd',
                        fontWeight: '1000',
                        marginBottom: '30px'
                    }}
                >
                    Commission Management
                </Typography>
    

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="200px"
                    >
                        <CircularProgress />
                    </Box>
                ) : symbols.length > 0 ? ( // Ensure symbols is not empty
                    <TableContainer component={Paper} style={{ width: '100%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell style={{ color: '#fff' }}>
                                        CompanyEmail
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    Major
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    JPY pairs
                                    </TableCell>

                                    <TableCell style={{ color: '#fff' }}>
                                    Indices
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    Metal
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    Oil
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    BTC/USD
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    CreatedAt
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                    UpdatedAt
                                    </TableCell>
                                
                                    <TableCell style={{ color: '#fff' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {symbols.map((symbol) => (
                                    <TableRow key={symbol.id}>
                                        <TableCell>{symbol.companyEmail}</TableCell>
                                        <TableCell>{symbol.Major}</TableCell>
                                        <TableCell>{symbol.JPYpairs}</TableCell>
                                        <TableCell>{symbol.Indices}</TableCell>
                                        <TableCell>{symbol.Metal}</TableCell>
                                        <TableCell>{symbol.Oil}</TableCell>
                                        <TableCell>{symbol.BTCUSD}</TableCell>
                                        <TableCell>
                                            {formatDate(symbol.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(symbol.updatedAt)}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleEditSymbol(symbol)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                            
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" style={{ color: 'white' }}>
                        No symbol found.
                    </Typography>
                )}
            </Box>


            {/* Edit Symbol Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle>Edit Symbol</DialogTitle>
                <DialogContent>
                    {selectedSymbol && (
                        <>
                        
                            <TextField
                                margin="dense"
                                label="Major"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.Major}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        Major: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="JPYpairs"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.JPYpairs}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        JPYpairs: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Indices"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.Indices}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        Indices: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Metal"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.Metal}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        Metal: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Oil"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.Oil}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        Oil: e.target.value,
                                    })
                                }
                                required
                            />
                            <TextField
                                margin="dense"
                                label="BTCUSD"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedSymbol.BTCUSD}
                                onChange={(e) =>
                                    setSelectedSymbol({
                                        ...selectedSymbol,
                                        BTCUSD: e.target.value,
                                    })
                                }
                                required
                            />
                      
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenEditModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSymbol} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
};

export default SymbolManagement;
