import React from 'react';
import ReactApexChart from 'react-apexcharts';

class SectorChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: props.data,
        
        options: {
        
          chart: {
            type: 'donut',
            
          },
          labels: props.labels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      
      
      };
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.labels !== prevProps.labels) {
            this.setState ({
      
                series: this.props.data,
                
                options: {
                
                  chart: {
                    type: 'donut',
                    
                  },
                  labels: this.props.labels,
                  responsive: [{
                    breakpoint: 480,
                    options: {
                      chart: {
                        
                        width: 200
                      },
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }]
                },
            })
        }
      }

    render() {
      return (
        

        <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height="600"/>
        </div>


      );
    }
  }

export default SectorChart;