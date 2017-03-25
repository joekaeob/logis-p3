import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './systemConfig.html';

import { Maindocs } from '../../api/assets/maindocs.js';
import { Rfidlist } from '../../api/assets/rfidlist.js';
import { Rfidtmp } from '../../api/assets/rfidtmp.js';
import { Rfidtmpout } from '../../api/assets/rfidtmpout.js';

class SystemConfigCtrl {
    constructor($scope) {

        $scope.viewModel(this);
        this.subscribe('maindocs');
        this.subscribe('rfidlist');
        this.subscribe('rfidtmp');
        this.subscribe('rfidtmpout');

        this.helpers({
             maindocs(){
                 return Maindocs.find({}, {sort: [ ["createAt", "desc"], ["id", "asc"] ] });
             }
        });

    }

    removeMaindocsAll() {
        console.log("Remove all maindocs");
        Meteor.call('maindocs.removeAll');  
    }

    removeRfidlistAll() {
        console.log("Remove all rfidlist");
        Meteor.call('rfidlist.removeAll');  
    }

    removeRfidTmpAll() {
        console.log("Remove all rfidtmp");
        Meteor.call('rfidtmp.removeAll');  
    }
    
    removeRfidTmpOutAll() {
        console.log("Remove all rfidtmpout");
        Meteor.call('rfidtmpout.removeAll');  
    }
}   
 
export default angular.module('systemConfig', [
    angularMeteor
]).component('systemConfig', {
    templateUrl: 'imports/components/systemConfig/systemConfig.html',
    controller: ['$scope', SystemConfigCtrl]
});