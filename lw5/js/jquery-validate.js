(function(parentObject) {
  if (parentObject.validation)
    return;

  parentObject.validation = {
    _defaultOptions: {

      container: '',
      fieldSelector: '.field-input',
      liveCheck: true,
      submitSelector: '.save-button',
      submitHandler: null,
      errorClass: 'input-error',
      okClass: 'input-ok',
      validators: {
        'required': function(str) {
          return str.length > 0;
        },
        'password': function(str) {
          var regExp = new RegExp('^[а-яА-ЯёЁa-zA-Z0-9\\s]+$');
          return regExp.test(str) || !str;
        },
        'email': function(str) {
          var regExp = new RegExp('^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$');
          return regExp.test(str) || !str;
        },
        'phone': function(str) {
          var regExp = new RegExp(/^\d{11}$/);
          return regExp.test(str) || !str;
        },
      }
    },
    init: function(_options) {
      var options = $.extend({}, this._defaultOptions, (_options || {})),
        self = this;

      if ( options.container && options.fieldSelector ) {
        if ( options.submitSelector ) {
          $(options.container).find(options.submitSelector).on('click', function() {
            if (self.isValid(options)) {
              if (typeof(options.submitHandler) === 'function')
                options.submitHandler();
              return true;
            } else {
              return false;
            }
          });
        }

        if ( options.liveCheck ) {
          $( options.container ).find(options.fieldSelector).each(function(cnt, item) {
            $(item).on('click', function() {
              self.validItem($(item), options)
            }).on('blur', function() {
              self.validItem($(item), options)
            }).on('change', function() {
              self.validItem($(item), options)// //
            }).on('keyup', function() {
              self.validItem($(item), options)
            });
          });
        }
      }
    },

    validItem: function( item, _options) {
      var options = $.extend({}, this._defaultOptions, (_options || {})),
        classList = $( item).attr('class').split(/\s+/),
         validResult = true;
      $.each(classList, function(index, cl) {
        if ( cl === 'confirmfield' ) {
          validResult
            &= ($(options.container).find('[Name="' + $(item).attr('confirm-field') + '"]').val() ==
              $(item).val());
        } else if ( typeof(options.validators[cl]) === 'function') {
          validResult &= options.validators[cl](item.val());
        }
      });

      if (!validResult)
        $( item).addClass(options.errorClass).removeClass(options.okClass);

      else
        $( item).addClass(options.okClass).removeClass(options.errorClass);
      return validResult;
    },

    isValid: function( _options ) {
      var options = $.extend({}, this._defaultOptions, (_options || {})),
        validResult = true,
        self = this;
      if ( options.container && options.fieldSelector) {
        $( options.container).find(options.fieldSelector).each(function(cnt, item) {
          validResult &= self.validItem($(item), options);
        });
      }
      return validResult;
    },

    clear: function( _options  ) {
      var options = $.extend(true, {}, this._defaultOptions, (_options || {}));
      if (options.container && options.fieldSelector) {
        $(options.container).find(options.fieldSelector)
          .removeClass( options.errorClass).removeClass(options.okClass);
      }
    }
  }
})(window);
