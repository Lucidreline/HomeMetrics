import React, { useState, useEffect } from 'react';
import './main-dashboard.styles.scss'
import InfoBox from '../../info-box/info-box.component';

const MainDashboard = () => {
    const [data, setData] = useState([]);
    const [sensors, setSenors] = useState([]);
    const [pi1, setPi1] = useState([])
    const [pi2, setPi2] = useState([])
    const [pi3, setPi3] = useState([])
    const [pi4, setPi4] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://scrb5g3wl1.execute-api.us-west-1.amazonaws.com/Prod/last-x/1');
                const jsonData = await response.json();
                setData(jsonData.items);
                jsonData.items.forEach(item => {
                    if (item.id.includes("pi1")) {
                        setPi1({ ...item, location: "Office" })
                        console.log(pi1)
                    }
                    else if (item.id.includes("pi2")) {
                        setPi2({ ...item, location: "Outside" })
                    }
                    else if (item.id.includes("pi3")) {
                        setPi3({ ...item, location: "Bedroom" })
                    }
                    else if (item.id.includes("pi4")) {
                        setPi4({ ...item, location: "Living Room" })
                    }
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };



        fetchData();
    }, []);

    console.log(pi1)
    return (
        <div className="info-boxes">
            <InfoBox item={pi1} />
            <InfoBox item={pi2} />
            <InfoBox item={pi3} />
            <InfoBox item={pi4} />
        </div>
    )
}

export default MainDashboard