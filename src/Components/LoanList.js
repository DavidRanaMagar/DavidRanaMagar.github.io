import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container, IconButton,
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
                                    <TableRow key={loan.loanID}>
                                        <TableCell>{loan.borrowerLender}</TableCell>
                                        <TableCell>{loanTypeConversions[loan.loanTypeID]}</TableCell>
                                        <TableCell>{loan.loanStartDate}</TableCell>
                                        <TableCell>{loan.loanEndDate}</TableCell>
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