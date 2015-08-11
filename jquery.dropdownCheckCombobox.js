(function($){
  $.fn.dropdownCheckCombobox = function(options) {
    var args = arguments;
    return this.each(function() {
      var dropdownCheckCombobox = $(this).data('dropdownCheckCombobox');
      if (!dropdownCheckCombobox) {
        dropdownCheckCombobox = new DropdownCheckCombobox(this, options);
        $(this).data('dropdownCheckCombobox', dropdownCheckCombobox);
      }
      if (typeof options == 'string') {
        var method = options;
        return dropdownCheckCombobox[method].apply(dropdownCheckCombobox, [].slice.call(args, 1));
      }
    });
  };

  $.dropdownCheckCombobox = {};
  $.dropdownCheckCombobox.defaults = {
      inputBox: {id : "dropdownCheckCombobox"}
  };

  var DropdownCheckCombobox = function(el, options) {
    var self = this;
    var options = options || {};

    this.options = $.extend({}, $.dropdownCheckCombobox.defaults, options);
    this.el = $(el).addClass('dropdownCheckCombobox').data('dropdownCheckCombobox', self);
    this.inputel = this.inputel || {};
    this.bonsai = this.bonsai || {};
    if (!this.options.scope) {
      this.options.scope = this.el;
    }
    // store the scope in the options for child nodes
    this.init();
    if (this.inputel){
      this.inputel.on('click', function(ev) {
        if (!self.bonsai.length){
          self.createBonsai();
        }
          self.bonsai.toggle();
      });
    }
  };

  DropdownCheckCombobox.prototype = {
    init: function() {
      this.el.css("display","none");
      var inputTag = $('<div class="combo"><input type="text" autocomplete="off" class="combo-text" readonly="readonly"' +
        'style="cursor: pointer; width: 176px; height: 20px; line-height: 20px;"></div>')

      inputTag.attr("id", this.options.inputBox.id);
      this.el.after(inputTag);
      this.inputel =  inputTag;
    },
    createBonsai: function() {
      var self = this;
      var listTag = $('<div class="dropdownCheckComboboxWapper"></div>');
      this.inputel.after(listTag);
      this.bonsai = listTag.jsonList({
        url: self.options.dataUrl,
        onListItem: function(event, listItem, data, isGroup) {
          if(!isGroup){listItem.attr('data-value', data.id);}
        },
        onSuccess: function(event, jsonList)  {
            return $(this.el).find('> ol').bonsai({
              checkboxes: true,
              createInputs: 'checkbox',
              handleDuplicateCheckboxes: true,
              expandAll: true
            });
          }
      });
      this.handleCombobox();
    },
    handleCombobox: function() {
      var self = this;
      var comboBox = $(dropdownCheckCombobox).children('input.combo-text');
      this.setCombobox(comboBox);
      this.el.find('input[type="checkbox"]').each(function(i,e){
        self.appendOptionTag(e, comboBox);
      });
      this.el.on('change', 'input[type=checkbox]', function(e) {
        self.setCombobox(comboBox); // Set Combobox Text.
        // Create input hidden Tag.
        if ($(e.target).is(':checked')) {
          self.changeOptionTag(e.target, true);
        } else {
          self.changeOptionTag(e.target, false);
        }

      });
    },
    setCombobox: function(comboBox) {
      var checkedText=[];
      console.log(this.bonsai.children());
      this.bonsai.find('input[type="checkbox"]:checked').each(function(i,el){
        var genderValue = $(el).attr("id");
        var genderText = $('label[for="' + genderValue + '"]').text();
        checkedText.push(genderText);
      });
      comboBox.val($.unique(checkedText));
    },
    appendOptionTag: function(target) {
      var targetVal = $(target).val();
      if (targetVal) {
        var tag = $('<option value=""></option>')
        tag.val(targetVal);
        if ($(target).is(':checked')) tag.attr('selected', true);
        self.selectTag.append(tag);
      };
    },
    changeOptionTag: function(target, flag) {
      var targetVal = $(target).val();
      self.selectTag.find('option').each(function(i,el){
        if ($(el).val() == targetVal) $(el).attr('selected', flag);
      });
    },
    destroy : function( ) {
     return this.each(function(){
       var $this = $(this),
           data = $this.data('dropdownCheckCombobox');
       $(window).unbind('.dropdownCheckCombobox');
       data.dropdownCheckCombobox.remove();
       $this.removeData('dropdownCheckCombobox');
     })
    },
    reposition : function( ) {},
    show : function( ) {},
    hide : function( ) {},
    update : function( content ) {}
  };
})( jQuery );
