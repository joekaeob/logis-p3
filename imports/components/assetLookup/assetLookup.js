import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetLookup.html';


class AssetLookupCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.helpers({

        });
    }
}       

export default angular.module('assetLookup', [
    angularMeteor
]).component('assetLookup', {
    templateUrl: 'imports/components/assetLookup/assetLookup.html',
    controller: ['$scope', AssetLookupCtrl]
}); 