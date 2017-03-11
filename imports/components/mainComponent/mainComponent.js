import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './mainComponent.html';

class MainComponentCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.helpers({

        });
    }
}   
 
export default angular.module('mainComponent', [
    angularMeteor
]).component('mainComponent', {
    templateUrl: 'imports/components/mainComponent/mainComponent.html',
    controller: ['$scope', MainComponentCtrl]
});