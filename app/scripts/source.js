
const React = require('react');
const ReactDOM = require( 'react-dom');

var jsonData = {
  'total': 8228,
  'businesses': [{
    'rating': 4,
    'price': '$',
    'phone': '+14152520800',
    'id': 'four-barrel-coffee-san-francisco1',
    'is_closed': false,
    'categories': [{
      'alias': 'coffee',
      'title': 'Coffee & Tea'
    }],
    'review_count': 1738,
    'name': 'Four Barrel Coffee',
    'url': 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco',
    'coordinates': {
      'latitude': 37.7670169511878,
      'longitude': -122.42184275
    },
    'image_url': 'http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg',
    'location': {
      'city': 'San Francisco',
      'country': 'US',
      'address2': '',
      'address3': '',
      'state': 'CA',
      'address1': '375 Valencia St',
      'zip_code': '94103'
    },
    'distance': 1604.23
  }, {
    'rating': 4,
    'price': '$',
    'phone': '+14152520800',
    'id': 'four-barrel-coffee-san-francisco2',
    'is_closed': false,
    'categories': [{
      'alias': 'coffee',
      'title': 'Coffee & Tea'
    }],
    'review_count': 1738,
    'name': 'Example 2',
    'url': 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco',
    'coordinates': {
      'latitude': 37.7670169511878,
      'longitude': -122.42184275
    },
    'image_url': 'http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg',
    'location': {
      'city': 'San Francisco',
      'country': 'US',
      'address2': '',
      'address3': '',
      'state': 'CA',
      'address1': '375 Valencia St',
      'zip_code': '94103'
    },
    'distance': 1604.23
  }, {
    'rating': 4,
    'price': '$',
    'phone': '+14152520800',
    'id': 'four-barrel-coffee-san-francisco3',
    'is_closed': false,
    'categories': [{
      'alias': 'coffee',
      'title': 'Coffee & Tea'
    }],
    'review_count': 1738,
    'name': 'Example 3',
    'url': 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco',
    'coordinates': {
      'latitude': 37.7670169511878,
      'longitude': -122.42184275
    },
    'image_url': 'http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg',
    'location': {
      'city': 'San Francisco',
      'country': 'US',
      'address2': '',
      'address3': '',
      'state': 'CA',
      'address1': '375 Valencia St',
      'zip_code': '94103'
    },
    'distance': 1604.23
  }, {
    'rating': 4,
    'price': '$',
    'phone': '+14152520800',
    'id': 'four-barrel-coffee-san-francisco4',
    'is_closed': false,
    'categories': [{
      'alias': 'coffee',
      'title': 'Coffee & Tea'
    }],
    'review_count': 1738,
    'name': 'Example 4',
    'url': 'https://www.yelp.com/biz/four-barrel-coffee-san-francisco',
    'coordinates': {
      'latitude': 37.7670169511878,
      'longitude': -122.42184275
    },
    'image_url': 'http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg',
    'location': {
      'city': 'San Francisco',
      'country': 'US',
      'address2': '',
      'address3': '',
      'state': 'CA',
      'address1': '375 Valencia St',
      'zip_code': '94103'
    },
    'distance': 1604.23
  }, ]
};

var SearchResult = React.createClass({
  render: function() {
    return (
      <div className='media'>
        <div className='media-left'>
          <a href={this.props.url}>
            <img className='media-object' src={this.props.image_url} />
          </a>
        </div>
        <div className='media-body'>
          <h3 className='media-heading'>{this.props.name} <span className='badge'>2 Going</span></h3>
          Description
        </div>
      </div>
    )}
});

var SearchList = React.createClass({
  getInitialState: function(){
    return {
      businesses: jsonData.businesses
    };
  },
  populateSearchResults: function(result, i) {
    return (
      <SearchResult
            key={result.id}
            name={result.name}
            url={result.url}
            image_url={result.image_url}
          />
    );
  },
    render: function() {
    return (<div>{this.state.businesses.map(this.populateSearchResults)}</div>);
    }
});

ReactDOM.render(
  <SearchList />, document.getElementById('react-app')
);