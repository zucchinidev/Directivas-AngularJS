/* global angular, $ */
(function() {
  'use strict';
  var app = angular.module('GitHub', []);
  app.directive('myAutocomplete', function() {
    function link(scope, element, attrs) {
      $(element).autocomplete({
        // establezco el source como el valor de la propiedad cuyo nombre coincidec con el calor
        //de mi atributo my-autocomplete que en este caso es scope.reposAutocomplete y que he creado
        // en la sección de abajo en la petición a la api de github
        source: scope[attrs.myAutocomplete],
        select: function(ev, ui) {
          ev.preventDefault();
          if (ui.item) {
            scope.optionSelected(ui.item.value);
          }
        },
        focus: function(ev, ui) {
          ev.preventDefault();
          $(this).val(ui.item.label);
        }
      });
    }
    return {
      link: link
    };
  });

  app.controller('PeticionAPI', function($scope, $http) {
    $scope.repos = $scope.reposAutocomplete = [];
    $http.get('https://api.github.com/users/zucchinidev/repos')
        .success(function(data) {
          $scope.repos = data;
          var limit = data.length - 1;
          for (var i = limit; i >= 0; i--) {
            // crear una nueva variable para mi scope que utilizaré como autocomplete
            $scope.reposAutocomplete.push(data[i].name);
          }
        })
        .error(function(err) {
          console.log(err);
        });

    /**
     * Método para obtener el repositorio seleccionado
     * @param {string} element nombre del repositorio selecciodo
     */
    $scope.optionSelected = function(element) {
      $scope.$apply(function() {
        $scope.repoSelected = element;
        console.log($scope.repoSelected);
      });
    };

    /**
     * Obtener datos del usuario
     */
    $http.get('https://api.github.com/users/zucchinidev')
        .success(function(data) {
          $scope.user = data;
        })
        .error(function(error) {
          console.log(error);
        });
  });

})();
