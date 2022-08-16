import React, { useEffect } from 'react';
import { useOrders } from '../../state/OrdersProvider';
import ChartOne from '../../charts/ChartOne';


const Statistics = () => {




    const {loading,statisticsDates,statisticsParams,statisticsLimit,methods} = useOrders();



    const data = {
        labels: statisticsDates,
        datasets:[
            {
            label: 'נתוני צריכה',
            data:statisticsParams,
            backgroundColor:'#51dafc',
            borderRadius : 50 
    
            },
            
        ],
        
    };

    
    useEffect(() => {
        methods.fetchStatistics()

    },[])
    return (
        <div className="statss">
            <div className='statss__container'>
                <div className='statss__body'>
                    <h1>נתוני צריכה</h1>
                    <ChartOne data={data}/>
                </div>
            </div>
        </div>
    );
};

export default Statistics;