import React, { useState, useEffect } from 'react';
import './main-dashboard.styles.scss'

const MainDashboard = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://scrb5g3wl1.execute-api.us-west-1.amazonaws.com/Prod/last-x/1');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <div>{data}</div>
    )
}

export default MainDashboard