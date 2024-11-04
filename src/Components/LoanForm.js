import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Grid2 } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from '../api/axios';

const LoanForm = () => {
    const [artifacts, setArtifacts] = useState([]);
    const [selectedArtifacts, setSelectedArtifacts] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]);
    const [loan, setLoan] = useState({
        loanTypeID: '',
        loanStartDate: '',
        loanEndDate: '',
        borrowerLender: '',
        loanAgreement: '',
        createdBy: 'collection manager',
        updatedBy: 'collection manager',
    });

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const response = await axios.post('/artifacts/available', {
                    startDate: loan.loanStartDate,
                    endDate: loan.loanEndDate
                });

                setArtifacts(response.data);
            } catch (error) {
                console.error('Error fetching artifacts:', error);
            }
        };

        const fetchLoanTypes = async () => {
            try {
                const response = await axios.get('/loanType');

                setLoanTypes(response.data);
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        fetchArtifacts();
        fetchLoanTypes();
    }, [loan.loanStartDate, loan.loanEndDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startDate = new Date(loan.loanStartDate);
        const endDate = new Date(loan.loanEndDate);

        if (startDate > endDate) {
            alert("Please choose a valid date range.")
            return;
        }

        const loanData = {
            ...loan,
            loanStartDate: startDate,
            laonEndDate: endDate,
        };

        try {
            const loanResponse = await axios.post('/loan', loanData);

            await Promise.all(selectedArtifacts.map(async (artifactID) => {
                const artifactLoanData = {
                    loanID: loanResponse.data.loanID,
                    artifactID: artifactID,
                    createdBy: 'collection manager',
                    updatedBy: 'collection manager',
                }
                await axios.post('/artifactsLoan', artifactLoanData);
            }));

            setLoan({
                loanTypeID: '',
                loanStartDate: '',
                loanEndDate: '',
                borrowerLender: '',
                loanAgreement: '',
                createdBy: 'collection manager',
                updatedBy: 'collection manager',
            });


            alert('Loan recorded successfully!');
        } catch (error) {
            console.error('Error creating exhibition:', error);
        }
    };

    const artifactColumns = [
        { field: 'artifactID', headerName: 'ID', width: 50 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'creator', headerName: 'Artist', width: 150 },
        { field: 'material', headerName: 'Material', width: 130 },
        { field: 'dimension', headerName: 'Dimensions', width: 150 },
        { field: 'dateCreated', headerName: 'Date', width: 120},
    ];

    return (
        <Container maxWidth="md">
            <Typography mb={4} variant="h4" gutterBottom>
                Record Artifact Loan
            </Typography>
            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Enter Loan Details
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                        <TextField
                            select
                            label="Loan Type"
                            value={loan.loanTypeID}
                            onChange={(e) => {
                                setLoan({ ...loan, loanTypeID: e.target.value });
                            }}
                            fullWidth
                            required
                        >
                            {loanTypes.map((loanType) => (
                                <MenuItem key={loanType.loanTypeID} value={loanType.loanTypeID}>
                                    {loanType.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={loan.loanStartDate}
                            onChange={(e) =>
                                setLoan({ ...loan, loanStartDate: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <TextField
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={loan.loanEndDate}
                            onChange={(e) =>
                                setLoan({ ...loan, loanEndDate: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Borrower"
                            value={loan.borrowerLender}
                            onChange={(e) =>
                                setLoan({ ...loan, borrowerLender: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            label="Loan Agreement Details"
                            value={loan.loanAgreement}
                            onChange={(e) =>
                                setLoan({ ...loan, loanAgreement: e.target.value })
                            }
                            fullWidth
                            required
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant="h6" gutterBottom>
                            Select Artifacts
                        </Typography>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={artifacts}
                                columns={artifactColumns}
                                pageSize={5}
                                checkboxSelection
                                onRowSelectionModelChange={(ids) => setSelectedArtifacts(ids)}
                                getRowId={(row) => row.artifactID}
                            />
                        </div>
                    </Grid2>
                    <Grid2 size={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Record Loan
                        </Button>
                    </Grid2>
                </Grid2>
            </form>
        </Container>
    );
};

export default LoanForm;