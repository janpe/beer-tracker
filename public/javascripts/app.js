var Header = React.createClass({
    render: function () {
        return (
            <header>
                <h1>beer-tracker</h1>
                <div className="search-area">
                    <label>Search</label>
                    <SearchBar searchHandler={this.props.searchHandler} searchText={this.props.searchText} />
                </div>
                { this.props.showBack ? <a className="header-button header-button__back" href="/#">&laquo; back</a> : null }
                <a className="header-button header-button__add-beer" href="#beers/new">Add a new beer +</a>
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
    getInitialState: function() {
        var ballSize = (this.props.beer.rating/100)*3.5 < 2 ? 2 : (this.props.beer.rating/100)*3.5;
        var ratingColor = "#fc605b";
        if(this.props.beer.rating >= 75) {
            ratingColor = "#34c849";
        } else if(this.props.beer.rating >= 50) {
            ratingColor = "#fdbc40";
        } else if(this.props.beer.rating >= 25) {
            ratingColor = "#fd8f4e";
        }
        return {ballStyle: {
            height: ballSize+"em",
            width: ballSize+"em",
            lineHeight: ballSize+"em",
            left: -ballSize/3+"em",
            top: -ballSize/3+"em",
            background: ratingColor
        }};
    },
    render: function () {
        return (
            <a className="beer-list-item" href={"#beers/" + this.props.beer.id}>
                <div className="beer-list-item__content">
                    {this.props.beer.name ? <h2>{this.props.beer.name}</h2> : null}
                    {this.props.beer.brewery ? <h3>{this.props.beer.brewery}</h3> : null}
                    {this.props.beer.beer_type ? <div className="beer-list-item__info">Type: {this.props.beer.beer_type}</div> : null}
                    {this.props.beer.abv ? <div className="beer-list-item__info">Abv: {this.props.beer.abv}%</div> : null}
                    {this.props.beer.rating ? <div className="beer-list-item__rating" style={this.state.ballStyle}>{this.props.beer.rating}</div> : null}
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
    componentDidMount: function() {
        this.setState({beers: this.props.service.getBeers()});
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
        if(this.props.beerId == 'new') {
            return {editable: true};
        } else {
            return {beer: this.props.service.findById(this.props.beerId), editable: false};
        }
    },
    edit: function() {
        this.setState({editable: true});
    },
    save: function(saveBeer, adding) {
        if(adding) {
            var self = this;
            this.props.service.postItem(saveBeer, function(id) {
                self.setState({editable: false, beer: saveBeer});
                router.load("#beers/" + id);
            });
        } else {
            this.props.service.putItem(saveBeer);
            this.setState({editable: false, beer: saveBeer});
        }
    },
    delete: function() {
        this.props.service.deleteItem(this.props.beerId);
        router.load('');
    },
    cancel: function() {
        this.setState({editable: false});
    },
    render: function () {
        var beerView;
        if(this.state.editable) {
            if(this.props.beerId == 'new') {
                beerView = <BeerEdit addingBeer={true} service={beerService} save={this.save} />
            } else {
                beerView = <BeerEdit beer={this.state.beer} service={beerService} save={this.save} />
            }
        } else {
            beerView = <BeerView beer={this.state.beer} service={beerService} edit={this.edit} delete={this.delete} />
        }
        return (
            <div>
                <Header showBack={true} />
                <div className="wrapper">
                    {beerView}
                </div>
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
                <div className="beer-info__header">
                    <button onClick={this.props.edit}>Edit</button>
                    <button onClick={this.props.delete}>Delete</button>
                </div>
                {this.state.beer.name ? <div className="beer-info__field"><label>Name</label>{this.state.beer.name}</div> : null}
                {this.state.beer.brewery ? <div className="beer-info__field"><label>Brewery</label>{this.state.beer.brewery}</div> : null}
                {this.state.beer.beer_type ? <div className="beer-info__field"><label>Type</label>{this.state.beer.beer_type}</div> : null}
                {this.state.beer.abv ? <div className="beer-info__field"><label>Abv</label>{this.state.beer.abv}%</div> : null}
                {this.state.beer.hops ? <div className="beer-info__field"><label>Hops</label>{this.state.beer.hops}</div> : null}
                {this.state.beer.country ? <div className="beer-info__field"><label>Country</label>{this.state.beer.country}</div> : null}
                {this.state.beer.rating ? <div className="beer-info__field"><label>Rating</label>{this.state.beer.rating}</div> : null}
                <div className="beer-info__field"><label>To-do</label>{this.state.beer.todo ? "Yes" : "No"}</div>
            </div>
        )
    }
});

var BeerEdit = React.createClass({
    getInitialState: function() {
        return {beer: this.props.beer, addingBeer: this.props.addingBeer ? true : false};
    },
    formSubmit: function(e) {
        e.preventDefault();
        var submitBeer = {
            name: this.refs.updateForm.getDOMNode().elements.name.value,
            brewery: this.refs.updateForm.getDOMNode().elements.brewery.value,
            beer_type: this.refs.updateForm.getDOMNode().elements.beer_type.value,
            abv: this.refs.updateForm.getDOMNode().elements.abv.valueAsNumber,
            hops: this.refs.updateForm.getDOMNode().elements.hops.value,
            country: this.refs.updateForm.getDOMNode().elements.country.value,
            rating: this.refs.updateForm.getDOMNode().elements.rating.valueAsNumber,
            todo: this.refs.updateForm.getDOMNode().elements.todo.checked
        };
        if(this.state.addingBeer) {
            this.props.save(submitBeer, true);
        } else {
            submitBeer.id = this.state.beer.id;
            this.props.save(submitBeer);
        }
    },
    todoHandler: function(e) {
        this.setState({todo: !e.target.checked});
    },
    render: function() {
        return (
            <form className="beer-info" ref="updateForm" onSubmit={this.formSubmit}>
                <div className="beer-info__header"></div>
                <div className="beer-info__field"><label>Name</label><input type="text" name="name" defaultValue={this.state.addingBeer ? null : this.state.beer.name}/></div>
                <div className="beer-info__field"><label>Brewery</label><input type="text" name="brewery" defaultValue={this.state.addingBeer ? null : this.state.beer.brewery}/></div>
                <div className="beer-info__field"><label>Type</label><input type="text" name="beer_type" defaultValue={this.state.addingBeer ? null : this.state.beer.beer_type}/></div>
                <div className="beer-info__field"><label>Abv</label><input type="number" step="0.1" min="0" max="100" name="abv" defaultValue={this.state.addingBeer ? null : this.state.beer.abv}/></div>
                <div className="beer-info__field"><label>Hops</label><input type="text" name="hops" defaultValue={this.state.addingBeer ? null : this.state.beer.hops}/></div>
                <div className="beer-info__field"><label>Country</label><input type="text" name="country" defaultValue={this.state.addingBeer ? null : this.state.beer.country}/></div>
                <div className="beer-info__field"><label>Rating</label><input type="number" step="1" min="1" max="100" name="rating" defaultValue={this.state.addingBeer ? null : this.state.beer.rating}/></div>
                <div className="beer-info__field"><label>To-do</label><input type="checkbox" name="todo" defaultChecked={this.state.addingBeer ? false : this.state.beer.todo} onChange={this.todoHandler} /></div>
                <div className="beer-info__footer">
                    <input type="submit" value="Save" /> <button onClick={this.props.cancel}>Cancel</button>
                </div>
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