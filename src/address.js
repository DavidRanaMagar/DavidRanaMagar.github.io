
import React, { useEffect, useState } from 'react';

const AddressList = () => {
    const [addresses, setAddresses] = useState([]); // State to hold the addresses
    const [loading, setLoading] = useState(true); // State to manage loading

    useEffect(() => {
        // Function to fetch address data from the API
        const fetchAddresses = async () => {
            try {
                const response = await fetch('http://34.239.138.222:3001/address'); // Replace with your API URL
                const data = await response.json();
                setAddresses(data); // Set the addresses in state
            } catch (error) {
                console.error('Error fetching addresses:', error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchAddresses(); // Call the fetch function
    }, []); // Empty dependency array means it runs once when the component mounts

    // Render loading state or addresses
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Addresses</h1>
            <ul>
                {addresses.map((address) => (
                    <li key={address.addressID}>
                        <strong>{address.streetAddress}</strong><br />
                        {address.city}, {address.state} {address.postalCode}, {address.country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddressList;
