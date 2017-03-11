import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetDepartment.html';

import { Departments } from '../../api/assets/departments.js';

class AssetDepartmentCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('departments');

        this.helpers({
            departments(){
                return Departments.find({}, {sort:{id:-1}});
            }
        });
    }

    addDepartment(newDepartment) {

        Session.set("newDepartment", newDepartment);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('departments.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var department = Session.get("newDepartment");

            department.id = (parseInt(result) + 1) + '';
            department.name = newDepartment.name,
            department.description = newDepartment.description,
            department.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('departments.insert', department);

        });     
    }     

    removeDepartment(id) {
        console.log("Remove department id: " + id);
        Meteor.call('departments.remove', id);   
    }   
}   
 
export default angular.module('assetDepartment', [
    angularMeteor
]).component('assetDepartment', {
    templateUrl: 'imports/components/assetDepartment/assetDepartment.html',
    controller: ['$scope', AssetDepartmentCtrl]
});