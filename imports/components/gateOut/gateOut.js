import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './gateOut.html';


class GateOuttCtrl {
    constructor($scope) {
        $scope.viewModel(this);
    }
}

export default angular.module('gateOut', [
    angularMeteor
]).component('gateOut', {
    templateUrl: 'imports/components/gateOut/gateOut.html',
    controller: ['$scope', GateOuttCtrl]
}); 