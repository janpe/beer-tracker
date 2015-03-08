var Header = React.createClass({
    render: function () {
        return (
            <header>
                { this.props.showBack ? <a className="go-back" href="/#">&laquo; back</a> : null }
                <h1>beer-tracker</h1>
                <div className="search-area">
                    <label>Search</label>
                    <SearchBar searchHandler={this.props.searchHandler} searchText={this.props.searchText} />
                </div>
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
            <a className="beer-list-item" href={"#beers/" + this.props.beer.id}>
                <div className="beer-list-item__content">
                    {this.props.beer.name ? <h2>{this.props.beer.name}</h2> : null}
                    {this.props.beer.brewery ? <h3>{this.props.beer.brewery}</h3> : null}
                    {this.props.beer.beer_type ? <div className="beer-list-item__info">Type: {this.props.beer.beer_type}</div> : null}
                    {this.props.beer.abv ? <div className="beer-list-item__info">Abv: {this.props.beer.abv}%</div> : null}
                    {this.props.beer.todo ? <div className="beer-list-item__info"><small>This beer is still on your to-do list!</small></div> : null}
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
        this.setState({searchText: key, beers: this.props.service.search(key)});
    },
    render: function () {
        return (
            <div>
                <Header showBack={false} service={beerService} searchText={this.state.searchText} searchHandler={this.searchHandler}/>
                <BeerList beers={this.state.beers} />
            </div>
        );
    }
});

var BeerPage = React.createClass({
    getInitialState: function() {
        return {beer: this.props.service.findById(this.props.beerId), editable: false};
    },
    edit: function() {
        this.setState({editable: true});
    },
    save: function(putBeer) {
        this.props.service.put(putBeer);
        this.setState({editable: false, beer: putBeer});
    },
    cancel: function() {
        this.setState({editable: false});
    },
    render: function () {
        var beerView;
        if(this.state.editable) {
            beerView = <BeerEdit beer={this.state.beer} service={beerService} save={this.save} />
        } else {
            beerView = <BeerView beer={this.state.beer} service={beerService} edit={this.edit} />
        }
        return (
            <div>
                <Header showBack={true} />
                {beerView}
            </div>
        );
    }
});

var BeerView = React.createClass({
    getInitialState: function() {
        return {beer: this.props.beer};
    },
    render: function() {
        return (
            <div className="beer-info">
                <button onClick={this.props.edit}>Edit</button>
                <div className="beer-info__row"><label>Name</label> {this.state.beer.name}</div>
                <div className="beer-info__row"><label>Brewery</label> {this.state.beer.brewery}</div>
                <div className="beer-info__row"><label>Type</label> {this.state.beer.beer_type}</div>
                <div className="beer-info__row"><label>Abv</label> {this.state.beer.abv}%</div>
                <div className="beer-info__row"><label>Country</label> {this.state.beer.country}</div>
                <div className="beer-info__row"><label>To-do</label> {this.state.beer.todo ? "Yes" : "No"}</div>
            </div>
        )
    }
});

var BeerEdit = React.createClass({
    getInitialState: function() {
        return {beer: this.props.beer};
    },
    formSubmit: function(e) {
        e.preventDefault();
        this.props.save({
            id: this.state.beer.id,
            name: this.refs.updateForm.getDOMNode().elements.name.value,
            brewery: this.refs.updateForm.getDOMNode().elements.brewery.value,
            beer_type: this.refs.updateForm.getDOMNode().elements.beer_type.value,
            abv: this.refs.updateForm.getDOMNode().elements.abv.valueAsNumber,
            country: this.refs.updateForm.getDOMNode().elements.country.value,
            todo: this.refs.updateForm.getDOMNode().elements.todo.checked
        });
    },
    todoHandler: function(e) {
        this.setState({todo: !e.target.checked});
    },
    render: function() {
        return (
            <form className="beer-info" ref="updateForm" onSubmit={this.formSubmit}>
                <div className="beer-info__row"><label>Name</label><input type="text" name="name" defaultValue={this.state.beer.name}/></div>
                <div className="beer-info__row"><label>Brewery</label><input type="text" name="brewery" defaultValue={this.state.beer.brewery}/></div>
                <div className="beer-info__row"><label>Type</label><input type="text" name="beer_type" defaultValue={this.state.beer.beer_type}/></div>
                <div className="beer-info__row"><label>Abv</label><input type="number" name="abv" defaultValue={this.state.beer.abv}/></div>
                <div className="beer-info__row"><label>Country</label><input type="text" name="country" defaultValue={this.state.beer.country}/></div>
                <div className="beer-info__row"><label>To-do</label><input type="checkbox" name="todo" defaultChecked={this.state.beer.todo} onChange={this.todoHandler} /></div>
                <input type="submit" value="Save" /> <button onClick={this.props.cancel}>Cancel</button>
            </form>
        )
    }
});

// Routing of the listing page
router.addRoute('', function() {
    React.render(
        <HomePage service={beerService}/>,
        document.body
    );
});

// Routing of the single item page
router.addRoute('beers/:id', function(id) {
    React.render(
        <BeerPage beerId={id} service={beerService}/>,
        document.body
    );
});
router.start();