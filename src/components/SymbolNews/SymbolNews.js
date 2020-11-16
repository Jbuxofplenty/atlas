import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import s from './SymbolNews.module.scss';

import { dataActions } from 'actions';


const useStyles = makeStyles((theme) => ({
'@global': {
    '*::-webkit-scrollbar': {
      display: 'none'
    },
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingBottom: 20,
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  gridListTileBar: {
    width: '100%',
    height: 'auto !important',
  },
  titleWrap: {
    whiteSpace: 'normal',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function SymbolNews(props) {
  const [newsArticles, setNewsArticles] = useState([]);
  const [ticker, setTicker] = useState(props.ticker ? props.ticker.value : null);
  const classes = useStyles();

  useEffect(() => {
    if(props.ticker) props.pullNewsData(props.ticker.value);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(!props.ticker) setNewsArticles(null);
    else if(ticker !== props.ticker.value) {
      props.pullNewsData(props.ticker.value);
      setTicker(props.ticker.value);
    } 
    //eslint-disable-next-line
  }, [props.ticker]);

  useEffect(() => {
    if(props.ticker) setNewsArticles(props.newsData[ticker]);
    //eslint-disable-next-line
  }, [props.newsData]);

  const handleOnMouseDown = async (e) => {
    e.stopPropagation();
  }

  const navigate = async (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <div className={classes.root}>
    {newsArticles && ticker &&
      <>
        <div className={s.title}>{props.ticker && props.ticker.label} News</div>
          <GridList cellHeight={180} className={classes.gridList} onMouseDown={handleOnMouseDown}>
            {newsArticles.map((tile, index) => (
              <GridListTile key={index}>
                <img src={tile.image} alt={tile.headline} />
                <GridListTileBar
                  title={tile.headline}
                  classes={{
                    root: classes.gridListTileBar,
                    title: classes.titleWrap
                  }}
                  actionIcon={
                    <IconButton aria-label={`info about ${tile.headline}`} className={classes.icon} onClick={() => navigate(tile.url)}>
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </>
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    portfolio: state.simulator.portfolio,
    settings: state.simulator.settings,
    symbolData: state.data.symbolData,
    newsData: state.data.newsData,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    pullNewsData: (ticker) => dispatch(dataActions.pullNewsData(ticker)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SymbolNews));
