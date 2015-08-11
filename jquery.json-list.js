(function($) {
  $.fn.jsonList = function(options) {
    return this.each(function() {
      new JSONList().init(this, options);
    });
  };
  var JSONList = function() {};
  JSONList.prototype = {
    init: function(el, options) {
      this.el = $(el);
      this.options = options = $.extend({
        url: null,
        groupLabel: 'name',
        itemLabel: 'name',
        onSuccess: function(jsonList) {},
        onListItem: function(event, listItem, data, isGroup) {},
        onResponse: function(data, textStatus) {}
      }, options);
      var self = this;
      $(this)
        .bind('success', this.options.onSuccess)
        .bind('listItem', this.options.onListItem)
        .bind('response', this.options.onResponse);
      $.getJSON(options.url, function(json, textStatus) {
        self.handleResponse(json, textStatus);
      });
    },
    handleResponse: function(data, textStatus) {
      $(this).trigger('response', [data, textStatus]);
      this.createList(data);
      $(this).trigger('success', [this]);
    },

   createList: function(data) {

    if (this.el.is('ol, ul')) {
      this.appendItems(data, this.el);
    } else {
      this.el.append(this.appendItems(data, $('<ol>')));
    }
   },
    appendItems: function(data, list) {
      var self = this;
      var data = data;

      for(var i = 0; i < data.length; i++){

        var listItem = $('<li>' + data[i]['text'] + '</li>');

        if(data[i]['name']){listItem.attr('data-name', data[i]['name']);}
        if(data[i]['checked'] && (data[i]['checked'] == true)) {listItem.attr('data-checked', 1);}

        list.append(listItem);

        if(data[i].children){
          $(self).trigger('listItem', [listItem, list, true]);
          var subList = $('<ol>');
          subList.appendTo(listItem);

          for(var j = 0; j < data[i].children.length; j++) {
            self.appendItems([data[i].children[j]], subList);
          }
        }else{
          $(self).trigger('listItem', [listItem, data[i], false]);
        }

      }
      return list;
    }
  };
}(jQuery));
