import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetsMain.html';

class AssetsMainCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        $scope.showConfigMenu = true;
        
        $scope.setConfigMenu = function(flag){
            $scope.showConfigMenu = flag;
        }

        this.helpers({

        });
    }
}   
 
export default angular.module('assetsMain', [
    angularMeteor
]).component('assetsMain', {
    templateUrl: 'imports/components/assetsMain/assetsMain.html',
    controller: ['$scope', AssetsMainCtrl]
});