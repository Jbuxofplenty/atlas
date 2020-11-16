import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StockAnalyzer from 'assets/img/stock_analyzer.png';
import Charts from 'assets/img/charts.png';
import Simulator from 'assets/img/simulator.png';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
 
export default function CarouselSection() {
  return (
    <GridContainer justify="center" className='my-5'>
      <GridItem xs={12} sm={12} md={12}>
        <Carousel className={'w-100 h-100'} renderThumbs={() => null}>
          <div>
            <img src={StockAnalyzer} alt="analyzer" />
          </div>
          <div>
            <img src={Simulator} alt="simulator" />
          </div>
          <div>
            <img src={Charts} alt="charts" />
          </div>
        </Carousel>
      </GridItem>
    </GridContainer>
  );
};
