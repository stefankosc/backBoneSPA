(function(){

    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var Router = Backbone.Router.extend({
        routes: {
            'registration': 'registration',
            'login': 'login'
        },
        login: function () {
            new LoginView({
                model: new LoginModel(),
                el: "#main"
            });
        },
        registration: function () {
            new RegistrationView({
                model: new RegistrationModel(),
                el: "#main"
            });
        }
    });

    var LoginModel = Backbone.Model.extend({
        initialize: function () {
        },
        url: '/login'
    });

    var RegistrationModel = Backbone.Model.extend({
        initialize: function() {
        },
        url: '/registration'
    })

    var RegistrationView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.registrationForm())
        }
    })

    var LoginView = Backbone.View.extend({
        initialize: function() {
            this.render();
            console.log(this.model.id);
        },
        render: function() {

            this.$el.html(Handlebars.templates.loginForm())
        },
        events: {
            'click #data': function(e) {
                console.log('Helo');
            }
        },
    })

    var router = new Router();
    Backbone.history.start();
}())
