/*
 ***************************************
 * @decription  : 分页模块
 * @author      : luoye-fe
 * @date        : 2015-11-08
 * @other       :
 -- 控制器
 $scope.paginationConf = {
 currentPage: 1,     // 当前页
 totalItems: 30,     // 总条数
 itemsPerPage: 4,    // 每页条数
 pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
 onChange: function() {
 // 回调
 }
 };
 -- 页面
 // paginationConf 配置参数
 <pagination conf="paginationConf"></pagination>
 ***************************************
 */

angular.module('mPagination', [])
    .directive('pagination', [function() {
        return {
            restrict: 'EA',
            template: '<div class="page-list">' +
                '<ul class="pagination" ng-show="conf.totalItems > 0">' +
                '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="changeCurrentPage(1)"><span>首页</span></li>' +
                '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span><</span></li>' +
                '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage}" ng-click="changeCurrentPage(item)"><span>{{item}}</span></li>' +
                '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>></span></li>' +
                '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="changeCurrentPage(conf.numberOfPages)"><span>末页</span></li>' +
                '</ul>' +
                '<div class="page-total" ng-show="conf.totalItems > 0">' +
                '<input type="text" ng-model="jumpPageNum"/>页 ' +
                '<span ng-click="changeCurrentPage(jumpPageNum)">GO</span>' +
                '共<strong> {{ conf.numberOfPages }} </strong>页' +
                '</div>' +
                '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
                '</div>',
            replace: true,
            scope: {
                conf: '='
            },
            link: function(scope, element, attrs) {

                // 变更当前页
                scope.changeCurrentPage = function(item) {
                    scope.conf.currentPage = item;
                };

                // 定义分页的长度必须为奇数 (default:9)
                scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9;
                if (scope.conf.pagesLength % 2 === 0) {
                    // 如果不是奇数的时候处理一下
                    scope.conf.pagesLength = scope.conf.pagesLength - 1;
                }

                // conf.perPageOptions
                if (!scope.conf.perPageOptions) {
                    scope.conf.perPageOptions = [10, 15, 20, 30, 50];
                }

                // pageList数组
                function getPagination(newValue, oldValue) {

                    // conf.currentPage
                    scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;

                    // conf.totalItems
                    scope.conf.totalItems = parseInt(scope.conf.totalItems) ? parseInt(scope.conf.totalItems) : 0;

                    // conf.itemsPerPage (default:8)
                    scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 8;


                    // numberOfPages
                    scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);

                    // judge currentPage > scope.numberOfPages
                    if (scope.conf.currentPage < 1) {
                        scope.conf.currentPage = 1;
                    }

                    // 如果分页总数>0，并且当前页大于分页总数
                    if (scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages) {
                        scope.conf.currentPage = scope.conf.numberOfPages;
                    }

                    // jumpPageNum 跳转页
                    scope.jumpPageNum = scope.conf.currentPage;


                    scope.pageList = [];
                    if (scope.conf.numberOfPages <= scope.conf.pagesLength) {
                        // 判断总页数如果小于等于分页的长度，若小于则直接显示
                        for (i = 1; i <= scope.conf.numberOfPages; i++) {
                            scope.pageList.push(i);
                        }
                    } else {
                        // 计算中心偏移量
                        var offset = (scope.conf.pagesLength + 1) / 2;
                        if (scope.conf.currentPage <= offset) {
                            // 左边
                            for (i = 1; i <= scope.conf.pagesLength; i++) {
                                scope.pageList.push(i);
                            }
                        } else if (scope.conf.currentPage > scope.conf.numberOfPages - offset) {
                            // 右边
                            for (i = scope.conf.pagesLength - 1; i > 0; i--) {
                                scope.pageList.push(scope.conf.numberOfPages - i);
                            }
                            scope.pageList.push(scope.conf.numberOfPages)

                        } else {
                            // 中间
                            for (i = Math.ceil(scope.conf.pagesLength / 2); i > 1; i--) {
                                scope.pageList.push(scope.conf.currentPage - i + 1);
                            }
                            scope.pageList.push(scope.conf.currentPage);
                            for (i = 1; i < Math.ceil(scope.conf.pagesLength / 2); i++) {
                                scope.pageList.push(scope.conf.currentPage + i);
                            }
                        }
                    }

                    if (scope.conf.onChange) {
                        // 防止初始化两次请求问题
                        if (!(oldValue != newValue && oldValue[0] == 0)) {
                            // 回调
                            scope.conf.onChange();
                            console.log(scope.pageList);
                        }
                    }
                    scope.$parent.conf = scope.conf;
                }

                // prevPage
                scope.prevPage = function() {
                    if (scope.conf.currentPage > 1) {
                        scope.conf.currentPage -= 1;
                    }
                };
                // nextPage
                scope.nextPage = function() {
                    if (scope.conf.currentPage < scope.conf.numberOfPages) {
                        scope.conf.currentPage += 1;
                    }
                };

                scope.$watch(function() {
                    if (!scope.conf.totalItems) {
                        scope.conf.totalItems = 0;
                    }
                    var newValue = scope.conf.totalItems + ' ' + scope.conf.currentPage + ' ' + scope.conf.itemsPerPage;
                    return newValue;
                }, getPagination);

            }
        };
    }]);
