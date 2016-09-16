(function(){

    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

    var Router = Backbone.Router.extend({
        routes: {
            'startpage': 'startpage',
            'registration': 'registration',
            'login': 'login',
            'messages': 'messages'

        },
        login: function () {
            $("#main").off();
            new LoginView({
                model: new LoginModel(),
                el: "#main"
            });
        },
        registration: function () {
            $("#main").off();
            new RegistrationView({
                model: new RegistrationModel(),
                el: "#main"
            });
        },
        startpage: function () {
            $('#main').off();
            new StartpageView({
                model: new StartpageModel(),
                el: "#main"
            });
        },
        messages: function () {
            $('#main').off();
            new MessagesView({
                model: new MessagesModel(),
                el: "#main"
            });
        }
    });




    var StartpageModel = Backbone.Model.extend({
        initialize: function() {
        },
        url: '/'
    });

    var StartpageView = Backbone.View.extend({
        initialize: function() {

            this.render();
        },
        render: function() {

            this.$el.html(Handlebars.templates.startPage())
        },
        events: {
            'click #loginButton': function() {
                window.location.hash = 'login';
            },
            'click #registrationButton': function() {
                window.location.hash = 'registration';
            }
        }
    });




    var RegistrationModel = Backbone.Model.extend({
        save: function() {
            return $.post(this.url, this.toJSON());
        },
        url: '/registration'
    });

    var RegistrationView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.registrationForm())
        },
        events: {
            'click input[name="registrationInput"]': function(e) {
                this.model.set(
                    {
                        'name': $('#registrationData').find('input[name="name"]').val(),
                        'email': $('#registrationData').find('input[name="email"]').val(),
                        'password': $('#registrationData').find('input[name="password"]').val()
                    }

                ).save().then(function() {
                    console.log('saved');
                    window.location.hash = 'messages';
                })
            }
        }
    });




    var LoginModel = Backbone.Model.extend({
        initialize: function () {

        },
        url: '/login'
    });

    var LoginView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.loginForm())
        },
        events: {
            'click input[type="button"][name="loginInput"]': function(e) {
                this.model.save($('#loginData').find('input[name="email"]').val());
                this.model.save($('#loginData').find('input[name="password"]').val());
            }
        }
    });




    var MessagesModel = Backbone.Model.extend({

        url: '/messages'
    });

    var MessagesView = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.messagesBoard())
        }
    });


    var router = new Router();
    console.log(Router);
    Backbone.history.start();
    window.location.hash = 'startpage';

}())
