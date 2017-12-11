(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      title: '@',
      onRemove: '&',
      search: '<'
    },
    controller: NarrowItDownController,
    controllerAs: 'menu',
    bindToController: true
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.logMenuItems = function (searchTerm) {
    var promise = MenuSearchService.getMenuItems(searchTerm);

    promise.then(function (response) {
        menu.found = response;
        menu.title = (response.length+" item(s) matched your search");
        menu.filter = searchTerm;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  menu.removeItem = function(itemIndex) {
      menu.found.splice(itemIndex, 1);
      console.log("item removed");
      menu.title = (menu.found.length+" item(s) found");
      console.log(menu.title);
  };

};

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuItems = function (searchTerm) {
    return $http({method: "GET", url: (ApiBasePath+"/menu_items.json")})
        .then(function (response) {
            console.log(response.data);

            var m = response.data;
            var menuItems = m.menu_items;
            var foundItems = [];

            if (searchTerm == "") {
                foundItems = [];
            } else {
                for (var i = 0; i < menuItems.length; i++) {
                    var itemDesc = menuItems[i].description;

                    if (itemDesc.toLowerCase().indexOf(searchTerm) != -1) {
                        foundItems.push(menuItems[i]);
                    }
                }
            }
            console.log(foundItems);
            return foundItems;
        })
        .catch(function (error) {
              console.log("Error occured in  MenuSearchService service method");
              console.log(error);
        });
  };
};
})();
