import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container, Drawer, IconButton, List, ListItem, ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import axios from '../api/axios';
import DeleteIcon from "@mui/icons-material/Delete";
import LoanForm from "./LoanForm";

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loanTypeConversions, setLoanTypeConversions] = useState({});
    const [isCreating, setIsCreating] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedArtifacts, setSelectedArtifacts] = useState([]);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get('/loan');
                setLoans(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        }

        const fetchLoanTypes = async () => {
            try {
                const response = await axios.get('/loanType');

                setLoanTypeConversions(Object.fromEntries(
                    response.data.map(loanType => [loanType.loanTypeID, loanType.title])
                ));
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        fetchLoans();
        fetchLoanTypes();
    }, [])

    const handleCreateLoan = () => {
        setIsCreating(true);
    }

    const handleBackButton = () => {
        setIsCreating(false);
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleDelete = async (loanID) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            try {
                await axios.delete(`/loan/${loanID}`);
                setLoans(loans.filter(loan => loan.loanID !== loanID));
                alert('Loan deleted successfully!');
            } catch (err) {
                console.error('Error deleting loan:', err);
                alert('Failed to delete loan');
            }
        }
    }

    const handleRowClick = async (loanID) => {
        // Fetch artifacts for this exhibition
        const response = await axios.get(`/loan/${loanID}/artifacts`);
        console.log(response.data)
        setSelectedArtifacts(response.data);
        setIsDrawerOpen(true);
    };

    return (
        <Container maxWidth="lg" mb={4}>
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Loan Information
                </Typography>
            </Box>
            {!isCreating ? (
                <Container maxWidth="lg">
                    <Box  mb={4} display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <Button variant="contained" color="primary" onClick={handleCreateLoan}>
                            Create New Loan
                        </Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="h6">Borrower</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Type</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Start Date</Typography></TableCell>
                                    <TableCell><Typography variant="h6">End Date</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loans.map((loan) => (
                                    <TableRow key={loan.loanID} onClick={() => handleRowClick(loan.loanID)}>
                                        <TableCell>{loan.borrowerLender}</TableCell>
                                        <TableCell>{loanTypeConversions[loan.loanTypeID]}</TableCell>
                                        <TableCell>
                                            {new Date(loan.loanStartDate).toLocaleDateString("en-US", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric"
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(loan.loanEndDate).toLocaleDateString("en-US", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric"
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="secondary"
                                                        onClick={() => handleDelete(loan.loanID)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
                        <Box width={300}>
                            <Typography variant="h6" style={{ padding: '16px' }}>Artifacts</Typography>
                            <List>
                                {selectedArtifacts.map(artifact => (
                                    <ListItem key={artifact.artifactID}>
                                        <ListItemText primary={artifact.title} secondary={artifact.creator} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </Container>
            ) : (
                <Container maxWidth="lg">
                    <Box  mb={4} display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleBackButton}>
                            Back to List
                        </Button>
                    </Box>
                    <LoanForm/>
                </Container>
            )}
        </Container>
    );
};

export default LoanList;
