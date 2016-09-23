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
            'messages': 'messages',
            'newmessage': 'newmessage'

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

//-------------------------------------------------------------------------------------------------------------


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


//-------------------------------------------------------------------------------------------------------------


    var RegistrationModel = Backbone.Model.extend({
        save: function() {

            return $.post(this.url, this.toJSON());

        },
        setImage: function(file) {

            var formData = new FormData();
            formData.append('file', file);
            return $.ajax({
                url: '/upload',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false
            });
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
                var registrationView = this;

                this.model.set(
                    {
                        'name': $('#registrationData').find('input[name="name"]').val(),
                        'email': $('#registrationData').find('input[name="email"]').val(),
                        'password': $('#registrationData').find('input[name="password"]').val()
                    }

                ).save().then(function() {
                    console.log('saved');

                    var file = $('input[type="file"]').get(0).files[0];

                    registrationView.model.setImage(file);
                    window.location.hash = 'messages';
                });
            },

        }
    });

//-------------------------------------------------------------------------------------------------------------



    var LoginModel = Backbone.Model.extend({
        save: function() {
            return $.post(this.url, this.toJSON());
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
                var wi = this;

                this.model.set(
                    {
                        'email': $('#loginData').find('input[name="email"]').val(),
                        'password': $('#loginData').find('input[name="password"]').val()

                    }
                ).save()
                .then(function() {

                    console.log('logged');

                    window.location.hash = 'messages';
                })
                .catch(function() {
                    $('#loginData').find('input[name="email"]').val('');
                    $('#loginData').find('input[name="password"]').val('');
                    window.location.hash = 'login';
                    wi.$el.find('h2').show();
                    wi.$el.find('h3').show();
                    console.log('fdsfs')
                });
            }
        }
    });
//-------------------------------------------------------------------------------------------------------------

    var MessagesModel = Backbone.Model.extend({
        post: function() {
            var mo = this;
            return $.post(this.url, this.toJSON()).then(function() {
                mo.fetch();
            });
        },

        initialize: function() {

            this.fetch();
        },

        url: '/messages'
    });

    var MessagesView = Backbone.View.extend({
        initialize: function() {
            var view = this;
            this.model.on('change', function () {
                view.render();
            });
        },
        render: function() {

            this.$el.html(Handlebars.templates.messagesBoard(this.model.toJSON()));

        },
        events: {

            'click input[type="button"][name="messageSubmition"]': function(e) {
                console.log('aaaa');
                this.model.set(
                    {
                        'message': $('#messageBoard').val()
                    }
                ).post()
                .then(function() {
                    console.log('hohoh')
                    window.location.hash = 'messages';
                })
                .catch(function() {
                    console.log('there is smth wrong with message');
                });
            }
         }
    });

//-------------------------------------------------------------------------------------------------------------

    var router = new Router();
    Backbone.history.start();
    if (!adell.logged) {
        location.hash = 'startpage';
    } else {
        location.hash = 'messages';
    }

}())
