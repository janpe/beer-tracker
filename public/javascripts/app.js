var Header = React.createClass({
    render: function () {
        return (
            <header>
                <a href="/#">back</a>
                <h1>{this.props.text}</h1>
            </header>
        );
    }
});

var SearchBar = React.createClass({
    getInitialState: function() {
        return {searchText: ''};
    },
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchTextInput.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="beer-search"><input type="search" ref="searchTextInput" value={this.props.searchText} onChange={this.searchHandler}/></div>
        );
    }
});

var BeerListItem = React.createClass({
    render: function () {
        return (
            <a className="beers-list__beer" href={"#beers/" + this.props.beer.id}>
                <div className="beers-list__beer-content">
                    {this.props.beer.name ? <h2>{this.props.beer.name}</h2> : ''}
                    {this.props.beer.brewery ? <h3>{this.props.beer.brewery}</h3> : ''}
                    {this.props.beer.beer_type ? <div className="beers-list__beer-info">Type: {this.props.beer.beer_type}</div> : ''}
                    {this.props.beer.abv ? <div className="beers-list__beer-info">Abv: {this.props.beer.abv}%</div> : ''}
                    {this.props.beer.country ? <div className="beers-list__beer-info">Country: {this.props.beer.country}</div> : ''}
                    {this.props.beer.todo ? <div className="beers-list__beer-info"><small>This beer is still on your to-do list!</small></div> : ''}
                </div>
            </a>
        );
    }
});

var BeerList = React.createClass({
    render: function () {
        var items = this.props.beers.map(function (beer) {
            return (
                <BeerListItem key={beer.id} beer={beer} />
            );
        });
        return (
            <div className="beers-list">
                {items}
            </div>
        );
    }
});

var HomePage = React.createClass({
    getInitialState: function() {
        return {beers: this.props.service.getBeers(), searchText: ''};
    },
    searchHandler:function(key) {
        this.setState({searchText: key, beers: this.props.service.findByName(key)});
    },
    render: function () {
        return (
            <div>
                <Header text="beer-tracker"/>
                <SearchBar searchHandler={this.searchHandler} searchText={this.state.searchText} />
                <BeerList beers={this.state.beers} />
            </div>
        );
    }
});

var BeerPage = React.createClass({
    getInitialState: function() {
        return {beer: {}};
    },
    componentDidMount: function() {
        this.setState({beer: this.props.service.findById(this.props.beerId)});
    },
    render: function () {
        return (
            <div>
                <Header text={this.state.beer.name}/>
                <h2>{this.state.beer.name} {this.state.beer.brewery}</h2>
            </div>
        );
    }
});

router.addRoute('', function() {
    React.render(
        <HomePage service={beerService}/>,
        document.body
    );
});

router.addRoute('beers/:id', function(id) {
    React.render(
        <BeerPage beerId={id} service={beerService}/>,
        document.body
    );
});
router.start();