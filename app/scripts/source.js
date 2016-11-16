const React = require('react');
const ReactDOM = require('react-dom');

var searchButton = document.querySelector('.btn--search');
const searchInput = document.querySelector('.input--search');

$(searchInput).keyup(function(event) {
  if (event.keyCode == 13) {
    document.querySelector('.btn--search').click();
  }
});

var BarAttendance = React.createClass({
  render: function() {
    if (!this.props.loggedIn){
          return (
      <div>
        <span className='badge'> {this.props.attendance} Going</span>
      </div>
      );
    } else {
      if (this.props.attending){
              return (<div>
        <span className='badge badge--loggedIn' onClick={this.props.going}> 
          {this.props.attendance} 
          <span className='badge__text' id={'badge' + this.props.index}> 
            &nbsp;Going, And So Are You!
          </span>
        </span>
      </div>);
      } else {
    return (
      <div>
        <span className='badge badge--loggedIn' onClick={this.props.going}> 
          {this.props.attendance} 
          <span className='badge__text' id={'badge' + this.props.index}> 
            &nbsp;Going, Are You?
          </span>
        </span>
      </div>
      );
      }
    }
  }
});

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
          <h3 className='media-heading'>{this.props.name} 
             <BarAttendance
                id = {this.props.id}
                index={this.props.index} 
                attendance={this.props.attendance} 
                loggedIn={this.props.loggedIn}
                going={this.props.going(this.props.id, this.props.index, this.props.attending)}
                attending={this.props.attending}
                />
          </h3>
          <p>{this.props.address}, {this.props.city}, {this.props.state} 
          {this.props.zip}</p>
          <p>{this.props.snippet}</p>
        </div>
      </div>
    );
  }
});

var SearchList = React.createClass({
  getInitialState: function() {
    return {
      businesses: [],
      loggedIn: false,
      searchWord: null
    };
  },
  dataSource: function(event) {
    event.preventDefault();
    if (!searchInput.value) {
      alert('enter the name of a city');
    } else if (searchInput.value === this.state.searchWord){
      alert('you already entered this search term');
    } else {
      return $.ajax({
        type: 'get',
        dataType: 'json',
        url: appUrl + '/api/yelp/' + searchInput.value
      }).done(function(result) {
        console.log(result);
        if (result.error){
          alert('enter a valid U.S. city');
        } else {
        this.setState({
          businesses: result.businesses,
          loggedIn: result.loggedIn,
          searchWord: searchInput.value
        });
      }
      }.bind(this));
    }
  },
  going: function(bar, index){
    return function updateBarAttendance() {
      var text = $('#badge' + index).text();
      return $.ajax({
          type: 'post',
          dataType: 'json',
          url: appUrl + '/api/bar/' + bar
        }).done(function(result) {
          if (result.error === true){
            alert('An error occurred.');
          } else if (result.attending === true){
            
            $('#badge' + index).text(' Going, And So Are You!');
          } else if (result.attending === false){
            $('#badge' + index).text(' Going, Are You?');
          }
        });
    };
  },
  populateSearchResults: function(result, i) {
    return (
      <SearchResult
            key={result.id}
            id={result.id}
            index={i}
            name={result.name}
            url={result.url}
            image_url={result.image_url}
            address={result.location.address}
            city={result.location.city}
            state={result.location.state_code}
            zip={result.location.postal_code}
            snippet={result.snippet_text}
            attendance={result.attendance}
            loggedIn={this.state.loggedIn}
            going={this.going}
            attending={result.attending}
          />
    );
  },
  render: function() {
    if (this.state.businesses) {
      return (
        <div>
      <button type="button" 
            className="btn btn-default btn--search" 
            onClick={this.dataSource}>
            <i className="glyphicon glyphicon-search"></i> Search
            </button>
            <div className="">
            {this.state.businesses.map(this.populateSearchResults)}
            </div>
        </div>);
    }
    else {
      return (<div>
      <button type="button" className="btn btn-default btn--search" 
      onClick={this.dataSource}>
      <i className="glyphicon glyphicon-search"></i> Search </button>
      </div>);
    }
  }
});

ReactDOM.render(
  <SearchList />, document.getElementById('react-app')
);
