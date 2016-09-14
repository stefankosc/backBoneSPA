(function(){

    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    let Router = Backbone.Router.extend({
        routes: {
            '/': '/'
        }
    });

    let router = new Router();

    Backbone.history.start();

    let UsersModel = Backbone.Model.extend({
        initialize: function () {
        },
        url: '/'
    });

    let usersModel = new UsersModel();

    let PageView = Backbone.View.extend({
        initialize: function() {
            this.render();

        },
        render: function() {


            this.$el.html(Handlebars.templates.noid())
        },
        events: {
            'click #data': function(e) {
                console.log('Helo');
            }
        },
        el: "#main"
    })
    new PageView();
}())
