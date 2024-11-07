import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Container,
    IconButton,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "../api/axios";
import DepartmentForm from './DepartmentForm'; // Form component for editing/creating departments

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
    const [isCreating, setIsCreating] = useState(false); // Track create mode

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/department');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching department data:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleRowClick = (departmentID) => {
        setSelectedDepartmentID(departmentID);
        setIsCreating(false);
    };

    const handleCreateDepartment = () => {
        setSelectedDepartmentID(null);
        setIsCreating(true);
    };

    const clearSelection = () => {
        setSelectedDepartmentID(null);
        setIsCreating(false);
    };

    const handleDelete = async (departmentID) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`/department/${departmentID}`);
                setDepartments(departments.filter(dept => dept.departmentID !== departmentID));
                alert('Department deleted successfully!');
            } catch (err) {
                console.error('Error deleting department:', err);
                alert('Failed to delete department');
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={4} mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" align="center" gutterBottom>
                    Department Information
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateDepartment}>
                    Create New Department
                </Button>
            </Box>
            {!selectedDepartmentID && !isCreating ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">Department ID</Typography></TableCell>
                                <TableCell><Typography variant="h6">Title</Typography></TableCell>
                                <TableCell><Typography variant="h6">Manager ID</Typography></TableCell>
                                <TableCell><Typography variant="h6">Created At</Typography></TableCell>
                                <TableCell><Typography variant="h6">Created By</Typography></TableCell>
                                <TableCell><Typography variant="h6">Updated At</Typography></TableCell>
                                <TableCell><Typography variant="h6">Updated By</Typography></TableCell>
                                <TableCell><Typography variant="h6">Actions</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow key={department.departmentID} hover onClick={() => handleRowClick(department.departmentID)}>
                                    <TableCell>{department.departmentID}</TableCell>
                                    <TableCell>{department.title}</TableCell>
                                    <TableCell>{department.managerID}</TableCell>
                                    <TableCell>{department.createdAt}</TableCell>
                                    <TableCell>{department.createdBy}</TableCell>
                                    <TableCell>{department.updatedAt}</TableCell>
                                    <TableCell>{department.updatedBy}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleRowClick(department.departmentID)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(department.departmentID)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <>
                    <Button variant="contained" color="secondary" onClick={clearSelection} style={{ marginBottom: '10px' }}>
                        Back to List
                    </Button>
                    <DepartmentForm
                        departmentID={selectedDepartmentID}
                        setSelectedDepartmentID={setSelectedDepartmentID}
                        clearSelection={clearSelection}
                        isCreating={isCreating} // Pass down create mode status
                    />
                </>
            )}
        </Container>
    );
};

export default DepartmentList;
