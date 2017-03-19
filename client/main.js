import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import mainComponent from '../imports/components/mainComponent/mainComponent';
import assetsMain from '../imports/components/assetsMain/assetsMain';
import assetContract from '../imports/components/assetContract/assetContract';
import assetVendor from '../imports/components/assetVendor/assetVendor';
import assetItem from '../imports/components/assetItem/assetItem';
import assetDepartment from '../imports/components/assetDepartment/assetDepartment';
import assetWarehouse from '../imports/components/assetWarehouse/assetWarehouse';
import assetZone from '../imports/components/assetZone/assetZone';
import assetLookup from '../imports/components/assetLookup/assetLookup';

import regisComponent from '../imports/components/regisComponent/regisComponent';
import gateIn from '../imports/components/gateIn/gateIn';

import orderComponent from '../imports/components/orderComponent/orderComponent';
import gateOut from '../imports/components/gateOut/gateOut';

angular.module('main-module', [
  angularMeteor,
  uiRouter,
  mainComponent.name,
  assetsMain.name,
  assetContract.name,
  assetVendor.name,
  assetItem.name,
  assetDepartment.name,
  assetWarehouse.name,
  assetZone.name,
  regisComponent.name,
  gateIn.name,
  orderComponent.name,
  gateOut.name,
  assetLookup.name
])

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/main");

        /**
         * วิธีตั้งชื่อ template ให้ template เป็นชื่อเดียวกันกับ ชือ folder component โดยถ้ามีตัวใหญ่ให้เว้นวรรค์แล้วเพิ่ม - เข้าไป
         * ตัวอย่าง mainComponent คือชื่อ folder เราจะเปลี่ยนให้มันเป็น main-component แบบนี้แทน
         * 
         * ในส่วนของ state เราจะอิงตามกฏของ ui-router สามารถตั้งได้อิสระ ถ้ามี master template อยู่เราจะให้ชื่อเป็น masterTemplateState.childState
         */
        $stateProvider
            .state('main-component', {
                url: "/main",
                template:'<main-component></main-component>'
            })
            
            .state('assets-config', {
                url: "/assets-config",
                template:'<assets-main></assets-main>'
            })
            .state('assets-config.contract', {
                url: "/contract",
                template:'<asset-contract></asset-contract>'
            })
            .state('assets-config.vendor', {
                url: "/vendor",
                template:'<asset-vendor></asset-vendor>'
            })
            .state('assets-config.item', {
                url: "/item",
                template:'<asset-item></asset-item>'
            })
            .state('assets-config.department', {
                url: "/department",
                template:'<asset-department></asset-department>'
            })
            .state('assets-config.warehouse', {
                url: "/warehouse",
                template:'<asset-warehouse></asset-warehouse>'
            })
            .state('assets-config.zone', {
                url: "/zone",
                template:'<asset-zone></asset-zone>'
            })

            .state('regis-component', {
                url: "/regis-item",
                template:'<regis-component></regis-component>'
            })
            .state('gate-in', {
                url: "/gate-in",
                template:'<gate-in></gate-in>'
            })

            .state('order-component', {
                url: "/order-item",
                template:'<order-component></order-component>'
            }) 
            .state('gate-out', {
                url: "/gate-out",
                template:'<gate-out></gate-out>'
            })
            
            .state('asset-lookup', {
                url: "/asset-lookup",
                template:'<asset-lookup></asset-lookup>'
            });
    }
]);