import React from 'react';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';


const ChartOne = ({data}) => {


    return (
        <div>
            <Bar 
            type='bar' 
            data={data} 

            />

        </div>
    );
};

export default ChartOne;