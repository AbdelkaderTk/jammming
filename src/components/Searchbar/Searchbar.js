import React from 'react';
import './Searchbar.css';

class SearchBar extends React.Component {
  render() {
    return (
      <div className="SearchBar">
        <input type="search" id="searchInput" placeholder="Enter A Song Title" />
        <a onClick={this.props.onClick}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
