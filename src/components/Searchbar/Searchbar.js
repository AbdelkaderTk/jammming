import React from 'react';
import './Searchbar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: sessionStorage.getItem('storedValue')};
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    // When rendering for the first time, check state and trigger search if there is a stored value
    if (this.state.term) {
      this.handleSearch();
    }
  }
  handleSearch() {
    if (this.state.term) {
      // Stores the inputValue in the browser (it allows to retrieve the stored value after a refresh)
      sessionStorage.setItem('storedValue', this.state.term);
      this.props.onClick(this.state.term);
    }
  }
  handleOnChange(e) {
      this.setState({term: e.target.value,});
  }
  render() {
    return (
      <div className="SearchBar">
        <input type="search" id="searchInput" placeholder="Enter A Song Title" onChange={this.handleOnChange}/>
        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
