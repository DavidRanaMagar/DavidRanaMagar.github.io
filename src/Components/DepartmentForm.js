import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from "../api/axios";

const DepartmentForm = ({ departmentID, setSelectedDepartmentID, clearSelection, isCreating }) => {
    const [title, setTitle] = useState('');
    const [managerID, setManagerID] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [updatedBy, setUpdatedBy] = useState('');

    useEffect(() => {
        if (departmentID) {
            const fetchDepartment = async () => {
                try {
                    const response = await axios.get(`/department/${departmentID}`);
                    const { title, managerID, createdBy, updatedBy } = response.data;
                    setTitle(title);
                    setManagerID(managerID);
                    setCreatedBy(createdBy);
                    setUpdatedBy(updatedBy);
                } catch (error) {
                    console.error('Error fetching department:', error);
                }
            };
            fetchDepartment();
        } else {
            setTitle('');
            setManagerID('');
            setCreatedBy('');
            setUpdatedBy('');
        }
    }, [departmentID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await axios.post('/department', { title, managerID, createdBy, updatedBy });
            } else {
                await axios.put(`/department/${departmentID}`, { title, managerID, createdBy, updatedBy });
            }
            clearSelection();
        } catch (error) {
            console.error('Error saving department:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" alignItems="center">
            <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                margin="normal"
            />
            <TextField
                label="Manager ID"
                variant="outlined"
                value={managerID}
                onChange={(e) => setManagerID(e.target.value)}
                required
                margin="normal"
            />
            <TextField
                label="Created By"
                variant="outlined"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                margin="normal"
            />
            <TextField
                label="Updated By"
                variant="outlined"
                value={updatedBy}
                onChange={(e) => setUpdatedBy(e.target.value)}
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                {isCreating ? 'Create Department' : 'Update Department'}
            </Button>
        </Box>
    );
};

export default DepartmentForm;
